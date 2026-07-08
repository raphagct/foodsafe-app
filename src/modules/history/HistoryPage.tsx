import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonBadge,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  useIonViewWillEnter,
  useIonRouter,
} from "@ionic/react";
import { documentTextOutline, scanOutline } from "ionicons/icons";
import { supabase } from "../../services/supabaseClient";
import { t, getLanguage } from "../../utils/i18n";
import { getRecentScans } from "../../services/traceabilityService";
import type { ScanHistoryRecord } from "../../types/traceability";
import type { ReportRecord } from "../../types/report";
import { REPORT_CATEGORIES } from "../../types/report";
import LogoutButton from "../../components/LogoutButton";

function HistoryPage() {
  const router = useIonRouter();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [scans, setScans] = useState<ScanHistoryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"reports" | "scans">("reports");
  const currentLanguage = getLanguage();

  useIonViewWillEnter(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }

      if (data) {
        setReports(data);
      }
    }

    async function fetchScans() {
      const data = await getRecentScans(50);
      setScans(data);
    }

    fetchReports();
    fetchScans();
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "UNSAFE": return "danger";
      case "SUSPECTED": return "warning";
      case "SAFE": return "success";
      default: return level === "Unsafe" ? "danger" : "warning";
    }
  };

  const getExpiryColor = (status: string) => {
    switch (status) {
      case "VALID": return "success";
      case "EXPIRING_SOON": return "warning";
      case "EXPIRED": return "medium";
      case "RECALL": return "danger";
      default: return "medium";
    }
  };

  const getCategoryIcon = (cat: string | null) => {
    if (!cat) return "";
    const found = REPORT_CATEGORIES.find(c => c.value === cat);
    return found?.icon ?? "";
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="font-bold">{t("historyPageTitle", currentLanguage)}</IonTitle>
          <IonButtons slot="end" className="pr-2">
            <LogoutButton />
          </IonButtons>
        </IonToolbar>
        <IonToolbar className="pb-2" style={{ '--padding-start': '16px', '--padding-end': '16px' } as React.CSSProperties}>
          <IonSegment
            value={activeTab}
            onIonChange={(e) => setActiveTab(e.detail.value as "reports" | "scans")}
            mode="ios"
            style={{ width: '100%' }}
          >
            <IonSegmentButton value="reports">
              <IonIcon icon={documentTextOutline} />
              <IonLabel>{t("tabReports", currentLanguage)}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="scans">
              <IonIcon icon={scanOutline} />
              <IonLabel>{t("tabScans", currentLanguage)}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="[--background:var(--color-surface)]">
        {/* ── Reports Tab ──────────────────────────────────────────── */}
        {activeTab === "reports" && (
          <>
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 font-medium">
                {t("historyNoReports", currentLanguage)}
              </div>
            ) : (
              <IonList className="bg-transparent px-4 py-4 mt-2" lines="none">
                {reports.map((report) => (
                  <IonItem
                    key={report.report_id}
                    routerLink={`/tabs/history/report/${report.report_id}`}
                    className="mb-3 rounded-xl shadow-sm [--background:white] py-1"
                    detail={true}
                  >
                    <IonThumbnail slot="start" className="rounded-lg overflow-hidden border border-gray-100">
                      <img
                        alt={report.product_name}
                        src={report.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100&h=100"}
                        className="object-cover w-full h-full"
                      />
                    </IonThumbnail>
                    <IonLabel className="ml-2">
                      <h2 className="font-bold text-gray-900 text-base">
                        {getCategoryIcon(report.category)} {report.product_name}
                      </h2>
                      <p className="text-sm text-gray-500 font-medium">
                        {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </IonLabel>
                    <IonBadge
                      slot="end"
                      color={getRiskColor(report.risk_level)}
                      className="rounded-lg px-2 py-1 shadow-sm text-xs font-bold"
                    >
                      {report.risk_level.toUpperCase()}
                    </IonBadge>
                  </IonItem>
                ))}
              </IonList>
            )}
          </>
        )}

        {/* ── Scans Tab ────────────────────────────────────────────── */}
        {activeTab === "scans" && (
          <>
            {scans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 font-medium">
                {t("historyNoScans", currentLanguage)}
              </div>
            ) : (
              <IonList className="bg-transparent px-4 py-4 mt-2" lines="none">
                {scans.map((scan, index) => {
                  const targetId = scan.batch_id || scan.lookup_key;
                  return (
                    <IonItem
                      key={scan.id ?? index}
                      button={true}
                      onClick={() => {
                        if (scan.full_response_json) {
                          sessionStorage.setItem("lastScanResult", scan.full_response_json);
                        }
                        router.push(`/tabs/history/traceability/${targetId}`);
                      }}
                      className="mb-3 rounded-xl shadow-sm [--background:white] py-2 cursor-pointer"
                      detail={true}
                    >
                    <div
                      slot="start"
                      className="w-11 h-11 rounded-lg flex items-center justify-center text-lg font-bold"
                      style={{
                        background: scan.is_recall ? "#FFEBEE" : scan.product_name ? "#E8F5E9" : "#F5F5F5",
                        color: scan.is_recall ? "#D32F2F" : scan.product_name ? "#388E3C" : "#9E9E9E",
                      }}
                    >
                      {scan.is_recall ? "🚨" : scan.product_name ? "✅" : "❌"}
                    </div>
                    <IonLabel className="ml-3">
                      <h2 className="font-bold text-gray-900 text-sm">
                        {scan.product_name ?? scan.lookup_key}
                      </h2>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(scan.scanned_at).toLocaleString()}
                        {scan.supplier_name && ` · ${scan.supplier_name}`}
                      </p>
                    </IonLabel>
                    <IonBadge
                      slot="end"
                      color={getExpiryColor(scan.expiry_status)}
                      className="rounded-lg px-2 py-1 text-xs font-bold"
                    >
                      {scan.expiry_status}
                    </IonBadge>
                  </IonItem>
                );
              })}
              </IonList>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}

export default HistoryPage;
