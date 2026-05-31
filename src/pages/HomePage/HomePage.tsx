import { IonPage, IonContent } from "@ionic/react";
import "./HomePage.css";
import HistorySection from "../../components/HistorySection";
import LanguageButton from "../../components/LanguageButton";

function HomePage() {
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
            <HistorySection title="Scan History" />
            <HistorySection title="Report History" />
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
}

export default HomePage;
