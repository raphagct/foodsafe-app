import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/react";
import { globeOutline } from "ionicons/icons";
import "../theme/HomePage.css";
import HistorySection from "../components/HistorySection";

function HomePage() {
  return (
    <IonPage>
      {}
      <IonContent className="home-content">       
        <main className="home-page">
          <header className="flex items-center justify-between">
            
            
            <div className="flex flex-col items-start font-['Inter',sans-serif] text-[18px] font-extrabold leading-[0.78] tracking-[-0.5px]">
              <span className="text-black">Food</span>
              <span className="text-[#159947]">Safe.</span>
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

function LanguageButton() {
  return (
    <IonButton className="language-button" shape="round">
      <IonIcon className="text-[26px]" slot="icon-only" icon={globeOutline} />
    </IonButton>
  );
}

export default HomePage;