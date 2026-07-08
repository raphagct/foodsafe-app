import { IonPage, IonContent, IonHeader, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import "./HomePage.css";
import HistorySection from "../../components/HistorySection";
import LanguageButton from "../../components/LanguageButton";
import LogoutButton from "../../components/LogoutButton";
import { supabase } from "../../services/supabaseClient";
import { getRecentScans } from "../../services/traceabilityService";
import { t, getLanguage } from "../../utils/i18n";
import type { ReportRecord } from "../../types/report";

function HomePage() {
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
  const currentLanguage = getLanguage();

  useIonViewWillEnter(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("report")
        .select("*")
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
      const data = await getRecentScans(4);
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

    fetchReports();
    fetchScans();
  });

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
        <main className="px-[18px] py-[13px]">
          <section>
            <HistorySection title={t("scanHistory", currentLanguage)} items={scans} type="scan" />
            <HistorySection title={t("reportHistory", currentLanguage)} items={reports} type="report" />
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
