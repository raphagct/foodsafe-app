import { IonPage, IonContent, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import "./HomePage.css";
import HistorySection from "../../components/HistorySection";
import LanguageButton from "../../components/LanguageButton";

function HomePage() {
  const [reports, setReports] = useState<any[]>([]);

  useIonViewWillEnter(() => {
    const existing = localStorage.getItem("foodsafe_reports");
    if (existing) {
      setReports(JSON.parse(existing));
    }
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
