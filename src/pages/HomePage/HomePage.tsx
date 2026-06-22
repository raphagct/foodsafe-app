import { IonPage, IonContent, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import "./HomePage.css";
import HistorySection from "../../components/HistorySection";
import LanguageButton from "../../components/LanguageButton";
import { supabase } from "../../utils/supabase";

function HomePage() {
  const [reports, setReports] = useState<any[]>([]);

  useIonViewWillEnter(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("report")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }

      if (data) {
        // Map DB columns to the shape HistorySection expects
        const mapped = data.map((r: any) => ({
          id: r.report_id,
          photoUrl: r.image_url,
          productName: r.product_name,
        }));
        setReports(mapped);
      }
    }

    fetchReports();
  });

  return (
    <IonPage>
      <IonContent className="home-content">
        <main className="min-h-screen px-[18px] py-[13px]">
          <header className="flex items-center justify-between">
            <div className="flex flex-col items-start text-[18px] font-extrabold leading-[0.78] tracking-[-0.5px]">
              <span className="text-black">Food</span>
              <span className="text-[var(--color-primary)]">Safe.</span>
            </div>

            <LanguageButton />
          </header>

          <section className="mt-4">
            <HistorySection title="Scan History" type="scan" />
            <HistorySection title="Report History" items={reports} type="report" />
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}

export default HomePage;

