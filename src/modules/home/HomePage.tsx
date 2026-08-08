import { IonPage, IonContent, IonHeader, IonToolbar, useIonViewWillEnter, useIonRouter, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from "@ionic/react";
import { bulbOutline, schoolOutline, bookOutline } from "ionicons/icons";
import { useState } from "react";
import "./HomePage.css";
import HistorySection from "../../components/HistorySection";
import LanguageButton from "../../components/LanguageButton";
import LogoutButton from "../../components/LogoutButton";
import { supabase } from "../../services/supabaseClient";
import { getRecentScans } from "../../services/traceabilityService";
import { getDailyTip } from "../../services/educationService";
import { t, getLanguage } from "../../utils/i18n";
import type { ReportRecord } from "../../types/report";
import type { DailyTip as DailyTipType } from "../../types/education";
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

    fetchReports();
    fetchScans();
    fetchTip();
  });

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
        </main>
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
