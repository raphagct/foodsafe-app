export interface ReportRecord {
  report_id: string;
  product_name: string;
  risk_level: string;
  category: string | null;
  description: string;
  image_url: string;
  created_at: string;
  warning_signs_json: string | null;
  store_name: string | null;
  barcode_scanned: string | null;
  linked_batch_id: string | null;
  reported_to_store: boolean;
  tags_json: string | null;
}

export const REPORT_CATEGORIES = [
  { value: "mold_spoilage", label: "Mold / Spoilage", icon: "🦠" },
  { value: "label_discrepancy", label: "Label Discrepancy", icon: "🏷️" },
  { value: "temperature_abuse", label: "Temperature Abuse", icon: "🌡️" },
  { value: "foreign_object", label: "Foreign Object", icon: "🔍" },
  { value: "expired_on_shelf", label: "Expired on Shelf", icon: "📅" },
  { value: "recall_item_on_shelf", label: "Recalled Item", icon: "🚨" },
  { value: "packaging_damage", label: "Packaging Damage", icon: "📦" },
  { value: "allergen_labeling", label: "Allergen Labeling", icon: "⚠️" },
  { value: "counterfeit_label", label: "Counterfeit / Missing Label", icon: "🔎" },
  { value: "routine_check", label: "Routine Check", icon: "✅" },
] as const;

export type ReportCategory = typeof REPORT_CATEGORIES[number]["value"];

export interface WarningSign {
  key: string;
  label: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  action: string;
}

export const WARNING_SIGNS: WarningSign[] = [
  { key: "visible_mold", label: "Visible mold growth", severity: "HIGH", action: "Do not consume. Dispose of product." },
  { key: "off_color", label: "Abnormal color change", severity: "MEDIUM", action: "Compare to normal product appearance. When in doubt, discard." },
  { key: "off_odor", label: "Abnormal or sour smell", severity: "HIGH", action: "Do not taste. Discard if odor is sour, putrid, or strongly uncharacteristic." },
  { key: "color_change_gray", label: "Gray/green discoloration (meat)", severity: "HIGH", action: "Discard immediately. May indicate bacterial spoilage." },
  { key: "temperature_abuse_suspected", label: "Suspected temperature abuse", severity: "HIGH", action: "Report to store. Do not purchase." },
  { key: "foreign_object_physical", label: "Foreign object in product", severity: "HIGH", action: "Do not consume. Report to FDA MedWatch." },
  { key: "packaging_seam_damage", label: "Damaged can seam", severity: "HIGH", action: "Do not purchase or consume. Risk of botulinum." },
  { key: "past_use_by_date", label: "Past Use By date", severity: "HIGH", action: "Do not consume. 'Use By' is a food safety date." },
  { key: "label_irregularity", label: "Label appears irregular", severity: "MEDIUM", action: "Report to store. May indicate counterfeit." },
  { key: "packaging_anomaly", label: "Unusual packaging", severity: "MEDIUM", action: "Inspect carefully. Compare with known genuine product." },
  { key: "allergen_label_incomplete", label: "Allergen declaration incomplete", severity: "HIGH", action: "Do not consume if you have the suspected allergen." },
  { key: "active_fda_recall", label: "Active FDA recall detected", severity: "HIGH", action: "Do not consume. Return for refund." },
  { key: "missing_required_label_info", label: "Missing required label info", severity: "MEDIUM", action: "Avoid purchase. Report to health authority." },
];
