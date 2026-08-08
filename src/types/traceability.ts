// ── Supplier ──────────────────────────────────────────────────────────────────
interface SupplierLocation {
  state: string;
  county: string;
  address: string;
  lat: number;
  lng: number;
}

interface Supplier {
  id: string;
  name: string;
  type: string;
  license: string;
  certification: string[];
  location: SupplierLocation;
  contact: { phone: string; email: string };
  inspector: string;
  last_audit: string;
  audit_result: string;
  products_grown: string[];
}

// ── Product ───────────────────────────────────────────────────────────────────
interface StorageTemp {
  min: number;
  max: number;
}

export interface Product {
  id: string;
  barcode_gs1: string;
  name: string;
  category: string;
  supplier_id: string;
  unit: string;
  shelf_life_days: number;
  storage_temp_f: StorageTemp;
  storage_temp_c: StorageTemp;
  image_url: string;
  qr_url: string;
  country_of_origin: string;
  allergens: string[];
  [key: string]: unknown; // nutrition, tests, etc.
}

// ── Batch ─────────────────────────────────────────────────────────────────────
interface RecallInfo {
  recall_number: string;
  class: string;
  issued_date: string;
  initiating_firm: string;
  reason: string;
  authority: string;
  affected_states: string[];
  action_required: string;
  consumer_hotline: string;
  press_release_url: string;
  severity: string;
}

interface QCTest {
  date: string;
  lab: string;
  result: string;
  certificate_no?: string;
  [key: string]: unknown;
}

export interface ColdChainEntry {
  timestamp: string;
  location: string;
  temp_f?: number;
  temp_c?: number;
  humidity_pct?: number;
  note?: string;
}

interface DistributionEntry {
  dest_id: string;
  quantity_units: number;
  shipped_date: string;
  carrier: string;
  temp_f?: number;
}

interface Batch {
  id: string;
  product_id: string;
  qr_payload: string;
  qr_url: string;
  status: "ACTIVE" | "RECALL";
  production_date: string;
  harvest_date?: string;
  pack_date?: string;
  expiry_date: string;
  quantity_lbs?: number;
  quantity_units?: number;
  recall_info?: RecallInfo;
  qc_test?: QCTest;
  distribution?: DistributionEntry[];
  cold_chain_log?: ColdChainEntry[];
  [key: string]: unknown;
}

// ── Distributor ───────────────────────────────────────────────────────────────
interface Distributor {
  id: string;
  name: string;
  type: string;
  location: { city: string; state: string; address: string };
}

// ── Cold Chain Analysis ───────────────────────────────────────────────────────
export interface ColdChainAnalysis {
  totalReadings: number;
  violationCount: number;
  violationRate: string;
  dangerZoneHours: number;
  violations: ColdChainEntry[];
  status: "PASS" | "WARNING" | "FAIL";
  recommendation: string;
}

// ── Enriched Distribution Entry ───────────────────────────────────────────────
export interface EnrichedDistributionEntry extends DistributionEntry {
  distributor: Distributor | null;
}

// ── Expiry Status ─────────────────────────────────────────────────────────────
export type ExpiryStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED" | "RECALL";

// ── Lookup Result ─────────────────────────────────────────────────────────────
export interface TraceabilityResultFound {
  found: true;
  batch: Batch;
  product: Product;
  supplier: Supplier;
  expiryStatus: ExpiryStatus;
  daysLeft: number;
  isRecall: boolean;
  coldChain: ColdChainAnalysis | null;
  distributionTrail: EnrichedDistributionEntry[];
}

export interface TraceabilityResultNotFound {
  found: false;
  scannedValue: string;
  error: string;
}

export type TraceabilityResult = TraceabilityResultFound | TraceabilityResultNotFound;

// ── Database Shape ────────────────────────────────────────────────────────────
export interface TraceabilityDatabase {
  suppliers: Record<string, Supplier>;
  products: Record<string, Product>;
  batches: Record<string, Batch>;
  distributors: Record<string, Distributor>;
  qr_scan_lookup: Record<string, string>;
}

// ── Scan History (for Supabase) ───────────────────────────────────────────────
export interface ScanHistoryRecord {
  id?: string;
  scanned_at: string;
  raw_value: string;
  lookup_key: string;
  batch_id: string | null;
  product_id: string | null;
  product_name: string | null;
  supplier_name: string | null;
  expiry_date: string | null;
  expiry_status: ExpiryStatus | "UNKNOWN";
  is_recall: boolean;
  recall_class: string | null;
  recall_reason: string | null;
  cold_chain_status: "PASS" | "WARNING" | "FAIL" | null;
  allergens_json: string | null;
  full_response_json: string | null;
}
