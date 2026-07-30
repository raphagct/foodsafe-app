import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonBadge,
  IonChip,
  IonLabel,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router";
import { useState } from "react";
import { checkmarkCircle, closeCircle, storefrontOutline } from "ionicons/icons";
import { supabase } from "../../services/supabaseClient";
import { t, getLanguage } from "../../utils/i18n";
import { REPORT_CATEGORIES, WARNING_SIGNS } from "../../types/report";
import type { ReportRecord } from "../../types/report";
import "../history/HistoryPage.css";

function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportRecord | null>(null);
  const currentLanguage = getLanguage();

  useIonViewWillEnter(() => {
    async function fetchReport() {
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .eq("report_id", id)
        .single();

      if (error) {
        console.error("Error fetching report:", error);
        return;
      }

      if (data) {
        setReport(data);
      }
    }

    fetchReport();
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "UNSAFE": return "danger";
      case "SUSPECTED": return "warning";
      case "SAFE": return "success";
      default: return level === "Unsafe" ? "danger" : "warning";
    }
  };

  const getCategoryInfo = (cat: string | null) => {
    if (!cat) return null;
    return REPORT_CATEGORIES.find(c => c.value === cat) ?? null;
  };

  const getWarningSignLabels = (json: string | null): string[] => {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  const getWarningSeverityColor = (key: string) => {
    const ws = WARNING_SIGNS.find(w => w.key === key);
    return ws?.severity === "HIGH" ? "danger" : "warning";
  };

  const getWarningLabel = (key: string) => {
    const ws = WARNING_SIGNS.find(w => w.key === key);
    return ws?.label ?? key.replace(/_/g, " ");
  };

  if (!report) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start"><IonBackButton defaultHref="/tabs/history" /></IonButtons>
            <IonTitle>{t("loading", currentLanguage)}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="flex items-center justify-center h-full text-gray-500">
            {t("reportNotFound", currentLanguage)}
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const categoryInfo = getCategoryInfo(report.category);
  const warningSigns = getWarningSignLabels(report.warning_signs_json);

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white">
        <IonToolbar className="[--background:white] py-2 px-2">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/history" />
          </IonButtons>
          <IonTitle className="font-bold">{t("reportDetailsTitle", currentLanguage)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="history-content">
        {/* Image */}
        <div className="relative w-full h-[220px]">
          <img
            alt={report.product_name}
            src={report.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"}
            className="w-full h-full object-cover bg-gray-200"
          />
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[var(--color-surface)] to-transparent"></div>
        </div>

        <div className="px-4 pb-8 pt-3 flex flex-col gap-4 relative z-10 -mt-2">
          {/* Product Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900">{report.product_name}</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
            </div>
            <IonBadge
              color={getRiskColor(report.risk_level)}
              className="px-3 py-1.5 text-sm rounded-xl shadow-sm font-bold"
            >
              {report.risk_level.toUpperCase()}
            </IonBadge>
          </div>

          {/* Category */}
          {categoryInfo && (
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 flex items-center gap-3">
              <span className="text-3xl">{categoryInfo.icon}</span>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t("category", currentLanguage)}</p>
                <p className="font-bold text-gray-900 text-base">{categoryInfo.label}</p>
              </div>
            </div>
          )}

          {/* Warning Signs */}
          {warningSigns.length > 0 && (
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">{t("warningSigns", currentLanguage)}</p>
              <div className="flex flex-wrap gap-2">
                {warningSigns.map(key => (
                  <IonChip key={key} color={getWarningSeverityColor(key)} className="text-xs font-semibold h-7 rounded-lg">
                    <IonLabel>{getWarningLabel(key)}</IonLabel>
                  </IonChip>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {t("notesTitle", currentLanguage)}
            </p>
            <p className="text-gray-800 font-medium leading-relaxed text-[15px]">
              {report.description || t("noNotesProvided", currentLanguage)}
            </p>
          </div>

          {/* Store & Barcode Info */}
          {(report.store_name || report.barcode_scanned) && (
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 flex flex-col gap-3">
              {report.store_name && (
                <div className="flex items-start gap-3">
                  <IonIcon icon={storefrontOutline} className="text-xl text-[var(--color-primary)] mt-1" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t("storeName", currentLanguage)}</p>
                    <h3 className="font-semibold text-gray-900 text-base">{report.store_name}</h3>
                  </div>
                </div>
              )}
              {report.barcode_scanned && (
                <div className="flex items-start gap-3 mt-1">
                  <div className="w-5 h-5 flex-shrink-0" /> {/* Spacer */}
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t("barcode", currentLanguage)}</p>
                    <h3 className="font-mono font-semibold text-gray-900 text-[15px] bg-gray-50 px-2 py-0.5 rounded-md mt-1">{report.barcode_scanned}</h3>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reported to store badge */}
          <div className="flex items-center gap-2">
            <IonChip
              color={report.reported_to_store ? "success" : "medium"}
              className="text-xs font-semibold"
            >
              <IonIcon icon={report.reported_to_store ? checkmarkCircle : closeCircle} />
              <IonLabel>
                {t("reportedToStore", currentLanguage)}: {report.reported_to_store ? t("yes", currentLanguage) : t("no", currentLanguage)}
              </IonLabel>
            </IonChip>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default ReportDetailPage;
