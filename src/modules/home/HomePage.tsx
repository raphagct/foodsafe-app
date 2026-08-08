import { IonPage, IonContent, IonHeader, IonToolbar, useIonViewWillEnter, useIonRouter, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonBadge } from "@ionic/react";
import { bulbOutline, schoolOutline, bookOutline, alertCircleOutline, closeOutline } from "ionicons/icons";
import { useState } from "react";
import "./HomePage.css";
import "../history/HistoryPage.css";
import HistorySection from "../../components/HistorySection";
import LanguageButton from "../../components/LanguageButton";
import LogoutButton from "../../components/LogoutButton";
import { supabase } from "../../services/supabaseClient";
import { getRecentScans } from "../../services/traceabilityService";
import { getDailyTip } from "../../services/educationService";
import { fetchRecentRecalls, classifyRecallSeverity, getDismissedRecallIds, dismissRecall } from "../../services/recallService";
import { t, getLanguage } from "../../utils/i18n";
import type { ReportRecord } from "../../types/report";
import type { DailyTip as DailyTipType } from "../../types/education";
import type { FdaRecallRecord } from "../../types/recall";
import { useAuth } from "../../contexts/AuthContext";

function HomePage() {
  const router = useIonRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState<{
    id: string;
    photoUrl: string | null;
    productName: string;
  }[]>([]);
  const [scans, setScans] = useState<{
    id: string;
    batchId?: string | null;
    photoUrl?: string | null;
    productName: string;
    isRecall?: boolean;
    expiryStatus?: string;
  }[]>([]);
  const [dailyTip, setDailyTip] = useState<DailyTipType | null>(null);
  const [criticalRecalls, setCriticalRecalls] = useState<FdaRecallRecord[]>([]);
  const [dismissedRecallIds, setDismissedRecallIds] = useState<string[]>([]);
  const currentLanguage = getLanguage();

  useIonViewWillEnter(() => {
    async function fetchReports() {
      if (!user) return;
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }

      if (data) {
        const mapped = data.map((r: ReportRecord) => ({
          id: r.report_id,
          photoUrl: r.image_url,
          productName: r.product_name,
        }));
        setReports(mapped);
      }
    }

    async function fetchScans() {
      if (!user) return;
      const data = await getRecentScans(user.id, 4);
      const mapped = data.map((s) => {
        let photoUrl = null;
        if (s.full_response_json) {
          try {
            const parsed = JSON.parse(s.full_response_json);
            if (parsed?.product?.image_url) {
              photoUrl = parsed.product.image_url;
            }
          } catch {
            // ignore
          }
        }
        return {
          id: s.id || s.lookup_key,
          batchId: s.batch_id || s.lookup_key,
          photoUrl,
          productName: s.product_name || s.lookup_key,
          isRecall: s.is_recall,
          expiryStatus: s.expiry_status,
        };
      });
      setScans(mapped);
    }

    async function fetchTip() {
      try {
        const tip = await getDailyTip(currentLanguage);
        setDailyTip(tip);
      } catch {
        setDailyTip(null);
      }
    }

    async function fetchRecalls() {
      const { recalls } = await fetchRecentRecalls({ days: 30, limit: 15 });
      const highSeverity = recalls.filter((r) => classifyRecallSeverity(r.classification).level === "HIGH");
      setCriticalRecalls(highSeverity);
      setDismissedRecallIds(getDismissedRecallIds());
    }

    fetchReports();
    fetchScans();
    fetchTip();
    fetchRecalls();
  });

  const visibleCriticalRecall = criticalRecalls.find((r) => !dismissedRecallIds.includes(r.recall_number));

  const handleDismissRecall = (recallNumber: string) => {
    dismissRecall(recallNumber);
    setDismissedRecallIds((prev) => [...prev, recallNumber]);
  };

  const eduTexts = {
    fr: {
      sectionTitle: "Éducation & Prévention",
      tipTitle: "Conseil du jour",
      tipSub: dailyTip?.text || "Bonnes pratiques d'hygiène et conservation",
      quizTitle: "Quiz express",
      quizSub: "Testez vos connaissances en 2 minutes",
      guideTitle: "Réglementations",
      guideSub: "Normes sanitaires & contacts d'urgence"
    },
    en: {
      sectionTitle: "Education & Prevention",
      tipTitle: "Daily Tip",
      tipSub: dailyTip?.text || "Best practices for hygiene & storage",
      quizTitle: "Quick Quiz",
      quizSub: "Test your food safety knowledge",
      guideTitle: "Regulations",
      guideSub: "Health standards & emergency contacts"
    },
    vi: {
      sectionTitle: "Giáo dục & Phòng ngừa",
      tipTitle: "Mẹo hôm nay",
      tipSub: dailyTip?.text || "Thực hành vệ sinh & bảo quản tốt nhất",
      quizTitle: "Câu hỏi nhanh",
      quizSub: "Kiểm tra kiến thức an toàn thực phẩm",
      guideTitle: "Quy định",
      guideSub: "Tiêu chuẩn y tế & liên hệ khẩn cấp"
    }
  }[currentLanguage as "fr" | "en" | "vi"] || {
    sectionTitle: "Éducation & Prévention",
    tipTitle: "Conseil du jour",
    tipSub: dailyTip?.text || "Bonnes pratiques d'hygiène et conservation",
    quizTitle: "Quiz express",
    quizSub: "Testez vos connaissances en 2 minutes",
    guideTitle: "Réglementations",
    guideSub: "Normes sanitaires & contacts d'urgence"
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="flex items-center justify-between px-[18px] py-[8px]">
            <div className="flex flex-col items-start text-[24px] font-extrabold leading-tight tracking-[-0.5px]">
              <span className="text-black">{t("appNameFood", currentLanguage)}</span>
              <span className="text-[var(--color-primary)]">{t("appNameSafe", currentLanguage)}</span>
            </div>

            <div className="flex items-center gap-2">
              <LanguageButton />
              <LogoutButton />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content">
        <main className="px-[18px] py-[13px] pb-8">
          {visibleCriticalRecall && (
            <div
              className="mb-4 rounded-[20px] p-4 flex items-start gap-3 animate-slide-up"
              style={{ background: "#FEF2F2", border: "1px solid #FEE2E2" }}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 text-lg shadow-sm">
                🚨
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold" style={{ color: "#B91C1C" }}>
                  {t("recallAlertsSection", currentLanguage)}
                </p>
                <p className="text-xs font-medium mt-0.5 line-clamp-2" style={{ color: "#7F1D1D" }}>
                  {visibleCriticalRecall.product_description}
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/tabs/recalls")}
                  className="text-xs font-bold mt-2 underline underline-offset-2"
                  style={{ color: "#EF4444" }}
                >
                  {t("viewRecalls", currentLanguage)}
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleDismissRecall(visibleCriticalRecall.recall_number)}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                style={{ color: "#B91C1C" }}
                aria-label={t("dismiss", currentLanguage)}
              >
                <IonIcon icon={closeOutline} className="text-lg" />
              </button>
            </div>
          )}

          <section>
            <HistorySection title={t("scanHistory", currentLanguage)} items={scans} type="scan" />
            <HistorySection title={t("reportHistory", currentLanguage)} items={reports} type="report" />
          </section>

          {/* Education Quick Access Section */}
          <IonCard className="w-full rounded-[14px] mt-4 box-border shadow-none border border-gray-100 bg-white">
            <IonCardHeader className="flex flex-row items-center justify-between p-0 pt-[16px] px-[16px]">
              <IonCardTitle className="m-0 text-[18px] font-extrabold text-black tracking-[-0.4px]">
                {eduTexts.sectionTitle}
              </IonCardTitle>
              <IonButton
                className="view-all-button m-0 p-0 text-[13px] font-bold text-[var(--color-primary)]"
                fill="clear"
                size="small"
                onClick={() => router.push("/tabs/education")}
              >
                {t("viewAll", currentLanguage)}
              </IonButton>
            </IonCardHeader>

            <IonCardContent className="mt-4 p-0 pb-[16px] px-[16px]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Daily Tip Card */}
                <div
                  onClick={() => router.push("/tabs/education")}
                  className="bg-white rounded-[14px] p-4 border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <IonIcon icon={bulbOutline} className="text-xl text-gray-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[14px] font-extrabold text-gray-900 block truncate">
                      {eduTexts.tipTitle}
                    </span>
                    <span className="text-[12px] font-medium text-gray-500 block truncate mt-0.5">
                      {eduTexts.tipSub}
                    </span>
                  </div>
                </div>

                {/* Quick Quiz Card */}
                <div
                  onClick={() => router.push("/tabs/education")}
                  className="bg-white rounded-[14px] p-4 border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <IonIcon icon={schoolOutline} className="text-xl text-gray-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[14px] font-extrabold text-gray-900 block truncate">
                      {eduTexts.quizTitle}
                    </span>
                    <span className="text-[12px] font-medium text-gray-500 block truncate mt-0.5">
                      {eduTexts.quizSub}
                    </span>
                  </div>
                </div>

                {/* Regulations & Guide Card */}
                <div
                  onClick={() => router.push("/tabs/education")}
                  className="bg-white rounded-[14px] p-4 border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors active:scale-[0.98]"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <IonIcon icon={bookOutline} className="text-xl text-gray-700" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[14px] font-extrabold text-gray-900 block truncate">
                      {eduTexts.guideTitle}
                    </span>
                    <span className="text-[12px] font-medium text-gray-500 block truncate mt-0.5">
                      {eduTexts.guideSub}
                    </span>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Recall Alerts Quick Access */}
          <IonCard className="w-full rounded-[14px] mt-4 box-border shadow-none border border-gray-100 bg-white">
            <IonCardHeader className="flex flex-row items-center justify-between p-0 pt-[16px] px-[16px]">
              <IonCardTitle className="m-0 text-[18px] font-extrabold text-black tracking-[-0.4px]">
                {t("recallAlertsSection", currentLanguage)}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent className="mt-4 p-0 pb-[16px] px-[16px]">
              <div
                onClick={() => router.push("/tabs/recalls")}
                className="bg-white rounded-[14px] p-4 border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
                  <IonIcon icon={alertCircleOutline} className="text-xl text-red-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[14px] font-extrabold text-gray-900 block truncate">
                    {t("viewRecalls", currentLanguage)}
                  </span>
                  <span className="text-[12px] font-medium text-gray-500 block truncate mt-0.5">
                    {t("recallAlertsSubtitle", currentLanguage)}
                  </span>
                </div>
                {criticalRecalls.length > 0 && (
                  <IonBadge color="danger" className="rounded-full px-2 py-1 text-[10px] font-bold flex-shrink-0">
                    {criticalRecalls.length}
                  </IonBadge>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        </main>
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
