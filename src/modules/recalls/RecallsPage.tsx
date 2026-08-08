import { useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonBadge,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  useIonViewWillEnter,
  type RefresherEventDetail,
} from "@ionic/react";
import {
  searchOutline,
  alertCircleOutline,
  closeCircleOutline,
  chevronDownOutline,
  businessOutline,
  calendarOutline,
  navigateOutline,
} from "ionicons/icons";
import {
  fetchRecentRecalls,
  classifyRecallSeverity,
  formatRecallDate,
} from "../../services/recallService";
import type { FdaRecallRecord } from "../../types/recall";
import { t, getLanguage } from "../../utils/i18n";
import "../history/HistoryPage.css";

const SEVERITY_ICON: Record<string, string> = {
  HIGH: "🚨",
  MEDIUM: "⚠️",
  LOW: "✅",
  UNKNOWN: "ℹ️",
};

function severityLabel(level: string, lang: ReturnType<typeof getLanguage>) {
  if (level === "HIGH") return t("recallSeverityHigh", lang);
  if (level === "MEDIUM") return t("recallSeverityMedium", lang);
  if (level === "LOW") return t("recallSeverityLow", lang);
  return level;
}

function RecallsPage() {
  const lang = getLanguage();
  const [recalls, setRecalls] = useState<FdaRecallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadRecalls(keyword: string, forceRefresh = false) {
    setIsLoading(true);
    const { recalls: results, error: fetchError, fromCache } = await fetchRecentRecalls({
      keyword,
      forceRefresh,
    });
    setRecalls(results);
    setError(fetchError && results.length === 0 ? fetchError : null);
    setIsOffline(fromCache && !!fetchError);
    setIsLoading(false);
  }

  useIonViewWillEnter(() => {
    loadRecalls(query);
  });

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      loadRecalls(value);
    }, 450);
  };

  const handleRefresh = async (e: CustomEvent<RefresherEventDetail>) => {
    await loadRecalls(query, true);
    e.detail.complete();
  };

  const renderSkeletons = () => (
    <div className="pt-4 pb-20">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="mb-4 mx-[18px] p-4 rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50"
        >
          <div className="flex items-center gap-3 mb-2">
            <IonSkeletonText animated style={{ width: "40px", height: "40px", borderRadius: "12px" }} />
            <div className="flex-1">
              <IonSkeletonText animated style={{ width: "70%", height: "14px", borderRadius: "4px", marginBottom: "6px" }} />
              <IonSkeletonText animated style={{ width: "40%", height: "11px", borderRadius: "4px" }} />
            </div>
          </div>
          <IonSkeletonText animated style={{ width: "100%", height: "11px", borderRadius: "4px" }} />
        </div>
      ))}
    </div>
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white">
        <IonToolbar className="[--background:white]">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" text="" />
          </IonButtons>
          <IonTitle className="font-bold">{t("recallsPageTitle", lang)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="history-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-4 h-11 shadow-[0_2px_8px_rgb(0,0,0,0.03)]">
            <IonIcon icon={searchOutline} className="text-gray-400 text-lg flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t("searchPlaceholder", lang)}
              className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {isOffline && !isLoading && (
          <div className="mx-[18px] mb-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            {t("recallsOfflineNotice", lang)}
          </div>
        )}

        {isLoading ? (
          renderSkeletons()
        ) : error && recalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IonIcon icon={closeCircleOutline} className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t("recallsLoadError", lang)}</h3>
          </div>
        ) : recalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <IonIcon icon={alertCircleOutline} className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t("noRecallsFound", lang)}</h3>
          </div>
        ) : (
          <div className="history-list pt-2 pb-20">
            {recalls.map((recall, index) => {
              const severity = classifyRecallSeverity(recall.classification);
              const cardId = `${recall.recall_number}-${index}`;
              const isExpanded = expandedId === cardId;

              return (
                <div
                  key={cardId}
                  onClick={() => setExpandedId(isExpanded ? null : cardId)}
                  className={`mb-4 mx-[18px] rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden cursor-pointer animate-slide-up animate-delay-${(index % 5) + 1}`}
                >
                  <div className="p-4 flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: severity.bg, border: `1px solid ${severity.border}` }}
                    >
                      {SEVERITY_ICON[severity.level]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-bold text-gray-900 text-[14px] leading-snug line-clamp-2">
                          {recall.product_description}
                        </h2>
                        <IonBadge
                          style={{ background: severity.bg, color: severity.color, border: `1px solid ${severity.border}` }}
                          className="rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-wider flex-shrink-0"
                        >
                          {severityLabel(severity.level, lang)}
                        </IonBadge>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                        <IonIcon icon={businessOutline} className="text-gray-400" />
                        {recall.recalling_firm}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                        <IonIcon icon={calendarOutline} className="text-gray-400" />
                        {formatRecallDate(recall.recall_initiation_date)}
                        {recall.state && ` · ${recall.state}`}
                      </p>
                    </div>
                    <IonIcon
                      icon={chevronDownOutline}
                      className={`text-gray-300 text-lg flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 -mt-1 border-t border-gray-50">
                      <p className="text-xs text-gray-600 font-medium leading-relaxed pt-3">
                        {recall.reason_for_recall}
                      </p>
                      {recall.distribution_pattern && (
                        <p className="text-xs text-gray-500 font-medium mt-2 flex items-start gap-1">
                          <IonIcon icon={navigateOutline} className="text-gray-400 mt-0.5" />
                          <span>
                            <span className="text-gray-400">{t("recallDistributionPattern", lang)}: </span>
                            {recall.distribution_pattern}
                          </span>
                        </p>
                      )}
                      {recall.status && (
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          <span className="text-gray-400">{t("recallStatus", lang)}: </span>
                          {recall.status}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default RecallsPage;
