import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/react";
import { globeOutline } from "ionicons/icons";
import "../theme/HomePage.css"
import HistorySection from "../components/HistorySection";

function HomePage() {
  return (
    <IonPage>
      <IonContent className="home-content">
        <main className="home-page">
          <header className="home-header">
            <div className="logo-text">
              <span className="logo-food">Food</span>
              <span className="logo-safe">Safe.</span>
            </div>
            <LanguageButton />
          </header>

          <section>
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
      <IonIcon className="language-icon" slot="icon-only" icon={globeOutline} />
    </IonButton>
  );
}

export default HomePage;