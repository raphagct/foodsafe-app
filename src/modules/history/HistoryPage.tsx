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
  IonSkeletonText,
} from "@ionic/react";
import { documentTextOutline, scanOutline, alertCircleOutline, searchOutline, chevronForwardOutline } from "ionicons/icons";
import { supabase } from "../../services/supabaseClient";
import { t, getLanguage } from "../../utils/i18n";
import { getRecentScans } from "../../services/traceabilityService";
import type { ScanHistoryRecord } from "../../types/traceability";
import type { ReportRecord } from "../../types/report";
import { REPORT_CATEGORIES } from "../../types/report";
import LogoutButton from "../../components/LogoutButton";
import "./HistoryPage.css";

function HistoryPage() {
  const router = useIonRouter();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [scans, setScans] = useState<ScanHistoryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"reports" | "scans">("reports");
  const [isLoading, setIsLoading] = useState(true);
  const currentLanguage = getLanguage();

  useIonViewWillEnter(() => {
    async function fetchData() {
      setIsLoading(true);
      
      const fetchReports = async () => {
        const { data, error } = await supabase
          .from("report")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) setReports(data);
      };

      const fetchScans = async () => {
        const data = await getRecentScans(50);
        setScans(data);
      };

      await Promise.all([fetchReports(), fetchScans()]);
      setIsLoading(false);
    }
    
    fetchData();
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

  // Skeleton Loader Component
  const renderSkeletons = () => (
    <IonList className="history-list pt-4 pb-20" lines="none">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="mb-4 mx-[18px] p-3 rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center gap-3">
          <IonSkeletonText animated style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
          <div className="flex-1">
            <IonSkeletonText animated style={{ width: '60%', height: '16px', borderRadius: '4px', marginBottom: '8px' }} />
            <IonSkeletonText animated style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
          </div>
          <IonSkeletonText animated style={{ width: '50px', height: '24px', borderRadius: '12px' }} />
        </div>
      ))}
    </IonList>
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white">
        <IonToolbar className="[--background:white]">
          <div className="flex items-center justify-between px-[18px] py-[10px]">
            <div>
              <h1 className="m-0 text-[24px] font-black leading-tight text-black">
                {t("historyPageTitle", currentLanguage)}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <LogoutButton />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="history-content">
        <div className="px-4 pb-3 pt-4">
          <IonSegment
            value={activeTab}
            onIonChange={(e) => setActiveTab(e.detail.value as "reports" | "scans")}
            mode="ios"
            className="custom-segment"
          >
            <IonSegmentButton value="reports" className="custom-segment-button">
              <div className="flex items-center justify-center gap-2 w-full">
                <IonIcon icon={documentTextOutline} className="text-lg" />
                <IonLabel>{t("tabReports", currentLanguage)}</IonLabel>
              </div>
            </IonSegmentButton>
            <IonSegmentButton value="scans" className="custom-segment-button">
              <div className="flex items-center justify-center gap-2 w-full">
                <IonIcon icon={scanOutline} className="text-lg" />
                <IonLabel>{t("tabScans", currentLanguage)}</IonLabel>
              </div>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {isLoading ? (
          renderSkeletons()
        ) : (
          <>
            {/* ── Reports Tab ──────────────────────────────────────────── */}
            {activeTab === "reports" && (
              <>
                {reports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6 animate-slide-up">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <IonIcon icon={alertCircleOutline} className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{t("historyNoReports", currentLanguage) || "No reports yet"}</h3>
                    <p className="text-gray-500 text-sm">Submit your first food safety report to see it appear here.</p>
                  </div>
                ) : (
                  <IonList className="history-list pt-4 pb-20" lines="none">
                    {reports.map((report, index) => (
                      <IonItem
                        key={report.report_id}
                        routerLink={`/tabs/history/report/${report.report_id}`}
                        className={`history-card-item mb-4 mx-[18px] rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] [--background:white] overflow-hidden border border-gray-100 animate-slide-up animate-delay-${(index % 5) + 1}`}
                        detail={false}
                      >
                        <IonThumbnail slot="start" className="rounded-xl overflow-hidden border border-gray-100/50 shadow-inner">
                          <img
                            alt={report.product_name}
                            src={report.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100&h=100"}
                            className="object-cover w-full h-full"
                          />
                        </IonThumbnail>
                        <IonLabel className="ml-3 my-2 overflow-hidden flex-1">
                          <h2 className="font-bold text-gray-900 text-base mb-1 truncate block">
                            {getCategoryIcon(report.category)} {report.product_name}
                          </h2>
                          <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                            {new Date(report.created_at).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'vi' ? 'vi-VN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </IonLabel>
                        <div slot="end" className="flex items-center gap-2">
                          <IonBadge
                            color={getRiskColor(report.risk_level)}
                            className="rounded-lg px-2.5 py-1.5 shadow-sm text-[10px] font-bold uppercase tracking-wider"
                          >
                            {report.risk_level}
                          </IonBadge>
                          <IonIcon icon={chevronForwardOutline} className="text-gray-400 text-xl opacity-80" />
                        </div>
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
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6 animate-slide-up">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <IonIcon icon={searchOutline} className="text-4xl text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{t("historyNoScans", currentLanguage) || "No scans yet"}</h3>
                    <p className="text-gray-500 text-sm">Scan a barcode or product to see its history here.</p>
                  </div>
                ) : (
                  <IonList className="history-list pt-4 pb-20" lines="none">
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
                          className={`history-card-item mb-4 mx-[18px] rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] [--background:white] overflow-hidden border border-gray-100 animate-slide-up animate-delay-${(index % 5) + 1}`}
                          detail={false}
                        >
                          <div
                            slot="start"
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm"
                            style={{
                              background: scan.is_recall ? "#FEF2F2" : scan.product_name ? "#F0FDF4" : "#F9FAFB",
                              color: scan.is_recall ? "#EF4444" : scan.product_name ? "#22C55E" : "#9CA3AF",
                              border: `1px solid ${scan.is_recall ? '#FEE2E2' : scan.product_name ? '#DCFCE7' : '#F3F4F6'}`
                            }}
                          >
                            {scan.is_recall ? "🚨" : scan.product_name ? "✅" : "❌"}
                          </div>
                          <IonLabel className="ml-3 my-2 overflow-hidden flex-1">
                            <h2 className="font-bold text-gray-900 text-[15px] mb-1 truncate block">
                              {scan.product_name ?? scan.lookup_key}
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">
                              {new Date(scan.scanned_at).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : currentLanguage === 'vi' ? 'vi-VN' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              {scan.supplier_name && <span className="block mt-0.5 text-gray-400 truncate">{scan.supplier_name}</span>}
                            </p>
                          </IonLabel>
                          <div slot="end" className="flex items-center gap-2">
                            <IonBadge
                              color={getExpiryColor(scan.expiry_status)}
                              className="rounded-lg px-2.5 py-1.5 shadow-sm text-[10px] font-bold uppercase tracking-wider"
                            >
                              {scan.expiry_status}
                            </IonBadge>
                            <IonIcon icon={chevronForwardOutline} className="text-gray-400 text-xl opacity-80" />
                          </div>
                        </IonItem>
                      );
                    })}
                  </IonList>
                )}
              </>
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
}

export default HistoryPage;
