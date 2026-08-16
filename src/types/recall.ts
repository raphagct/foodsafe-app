export interface FdaRecallRecord {
  recall_number: string;
  event_id?: string;
  status: string;
  classification: "Class I" | "Class II" | "Class III" | string;
  product_description: string;
  reason_for_recall: string;
  recalling_firm: string;
  city?: string;
  state?: string;
  distribution_pattern?: string;
  recall_initiation_date: string;
  report_date?: string;
  termination_date?: string;
}

export type RecallSeverityLevel = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export interface RecallSeverity {
  level: RecallSeverityLevel;
  color: string;
  bg: string;
  border: string;
}
