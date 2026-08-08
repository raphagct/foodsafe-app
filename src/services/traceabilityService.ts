import type {
  TraceabilityDatabase,
  TraceabilityResult,
  ColdChainAnalysis,
  ColdChainEntry,
  Product,
  EnrichedDistributionEntry,
  ScanHistoryRecord,
} from "../types/traceability";
import { supabase } from "./supabaseClient";

let _db: TraceabilityDatabase | null = null;

async function getDatabase(): Promise<TraceabilityDatabase> {
  if (_db) return _db;
  const res = await fetch("/data/mock_traceability_db_EN.json");
  _db = await res.json();
  return _db!;
}

/**
 * Look up a QR or barcode scan result.
 * Accepts: batch ID, product ID, or GS1 barcode.
 * Returns enriched record with expiry status and cold chain analysis.
 */
export async function lookupByQR(rawValue: string): Promise<TraceabilityResult> {
  const db = await getDatabase();

  // Strip URL prefix if user scanned a full URL QR code
  const key = rawValue
    .replace(/^https?:\/\/trace\.foodsafe\.io\/scan\//i, "")
    .trim();

  const batchId = db.qr_scan_lookup[key];
  if (!batchId) {
    // If not found in mock DB, try Open Food Facts API
    try {
      // Check if it looks like a barcode (mostly digits)
      if (/^\d+$/.test(key)) {
        const offRes = await fetch(`https://world.openfoodfacts.org/api/v0/product/${key}.json`);
        const offData = await offRes.json();

        if (offData.status === 1) {
          const offProduct = offData.product;
          
          return {
            found: true,
            batch: {
              id: `OFF-${key}`,
              product_id: key,
              qr_payload: key,
              qr_url: "",
              status: "ACTIVE",
              production_date: "N/A",
              expiry_date: "N/A",
            },
            product: {
              id: key,
              barcode_gs1: key,
              name: offProduct.product_name || "Unknown Product",
              category: offProduct.categories?.split(",")[0] || "Unknown",
              supplier_id: "OFF",
              unit: offProduct.quantity || "N/A",
              shelf_life_days: 0,
              storage_temp_f: { min: 0, max: 0 },
              storage_temp_c: { min: 0, max: 0 },
              image_url: offProduct.image_url || offProduct.image_front_url || "",
              qr_url: "",
              country_of_origin: offProduct.countries || "Unknown",
              allergens: offProduct.allergens_tags?.map((tag: string) => tag.replace('en:', '')) || [],
              ingredients: offProduct.ingredients_text || "Not available",
            },
            supplier: {
              id: "OFF",
              name: offProduct.brands || "Unknown Brand",
              type: "Manufacturer",
              license: "N/A",
              certification: [],
              location: { state: "N/A", county: "N/A", address: "N/A", lat: 0, lng: 0 },
              contact: { phone: "N/A", email: "N/A" },
              inspector: "N/A",
              last_audit: "N/A",
              audit_result: "N/A",
              products_grown: [],
            },
            expiryStatus: "VALID",
            daysLeft: 999, // Unknown expiry
            isRecall: false,
            coldChain: null,
            distributionTrail: [],
          };
        }
      }
    } catch (e) {
      console.error("Open Food Facts fetch error:", e);
    }

    return {
      found: false,
      scannedValue: key,
      error: `No product information found for: "${key}". This product may not be in the system yet.`,
    };
  }

  const batch = db.batches[batchId];
  const product = db.products[batch.product_id];
  const supplier = db.suppliers[product.supplier_id];

  // Expiry calculation
  const today = new Date();
  const expiryDate = new Date(batch.expiry_date);
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / 86_400_000);

  const expiryStatus =
    batch.status === "RECALL" ? "RECALL" as const :
    daysLeft < 0 ? "EXPIRED" as const :
    daysLeft <= 2 ? "EXPIRING_SOON" as const : "VALID" as const;

  // Cold chain analysis
  const coldChain = batch.cold_chain_log
    ? analyzeColdChain(batch.cold_chain_log, product)
    : null;

  // Enrich distributor info
  const distributionTrail: EnrichedDistributionEntry[] = (batch.distribution || []).map(d => ({
    ...d,
    distributor: db.distributors[d.dest_id] || null,
  }));

  return {
    found: true,
    batch,
    product,
    supplier,
    expiryStatus,
    daysLeft,
    isRecall: batch.status === "RECALL",
    coldChain,
    distributionTrail,
  };
}

/**
 * Analyze cold chain log for temperature violations.
 */
function analyzeColdChain(log: ColdChainEntry[], product: Product): ColdChainAnalysis {
  const safeMin = product.storage_temp_f?.min ?? (product.storage_temp_c?.min * 9 / 5 + 32);
  const safeMax = product.storage_temp_f?.max ?? (product.storage_temp_c?.max * 9 / 5 + 32);
  const tempKey: "temp_f" | "temp_c" = log[0]?.temp_f !== undefined ? "temp_f" : "temp_c";

  const violations = log.filter(r => {
    const t = r[tempKey];
    if (t === undefined) return false;
    return t < safeMin || t > safeMax;
  });

  // FDA Danger Zone: 40°F–140°F (4°C–60°C)
  const dangerZoneHours = tempKey === "temp_f"
    ? log.filter(r => r.temp_f !== undefined && r.temp_f >= 40 && r.temp_f <= 140).length
    : log.filter(r => r.temp_c !== undefined && r.temp_c >= 4 && r.temp_c <= 60).length;

  return {
    totalReadings: log.length,
    violationCount: violations.length,
    violationRate: ((violations.length / log.length) * 100).toFixed(1) + "%",
    dangerZoneHours,
    violations,
    status:
      violations.length === 0 ? "PASS" :
      violations.length <= 1 ? "WARNING" : "FAIL",
    recommendation:
      violations.length === 0
        ? "Cold chain integrity confirmed."
        : `${violations.length} temperature excursion(s) detected. Verify product quality before sale.`,
  };
}

/**
 * Save a scan result to Supabase scan_history table.
 */
export async function saveScanToHistory(
  rawValue: string,
  result: TraceabilityResult
): Promise<void> {
  const record: Omit<ScanHistoryRecord, "id"> = {
    scanned_at: new Date().toISOString(),
    raw_value: rawValue,
    lookup_key: rawValue.replace(/^https?:\/\/trace\.foodsafe\.io\/scan\//i, "").trim(),
    batch_id: null,
    product_id: null,
    product_name: null,
    supplier_name: null,
    expiry_date: null,
    expiry_status: "UNKNOWN",
    is_recall: false,
    recall_class: null,
    recall_reason: null,
    cold_chain_status: null,
    allergens_json: null,
    full_response_json: JSON.stringify(result),
  };

  if (result.found) {
    record.batch_id = result.batch.id;
    record.product_id = result.product.id;
    record.product_name = result.product.name;
    record.supplier_name = result.supplier.name;
    record.expiry_date = result.batch.expiry_date;
    record.expiry_status = result.expiryStatus;
    record.is_recall = result.isRecall;
    record.recall_class = result.batch.recall_info?.class ?? null;
    record.recall_reason = result.batch.recall_info?.reason ?? null;
    record.cold_chain_status = result.coldChain?.status ?? null;
    record.allergens_json = result.product.allergens.length > 0
      ? JSON.stringify(result.product.allergens)
      : null;
  }

  const { error } = await supabase.from("scan_history").insert(record);
  if (error) {
    console.error("Error saving scan to history:", error);
  }
}

/**
 * Fetch recent scan history from Supabase.
 */
export async function getRecentScans(limit = 50): Promise<ScanHistoryRecord[]> {
  const { data, error } = await supabase
    .from("scan_history")
    .select("*")
    .order("scanned_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching scan history:", error);
    return [];
  }

  return data ?? [];
}
