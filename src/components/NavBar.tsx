import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";

import { home, camera, school, time, chatbubbles } from "ionicons/icons";
import { t, getLanguage } from "../utils/i18n";

import HomePage from "../modules/home/HomePage";
import ScannerPage from "../modules/traceability/ScannerPage";
import EducationPage from "../modules/education/EducationPage";
import HistoryPage from "../modules/history/HistoryPage";
import ReportDetailPage from "../modules/report/ReportDetailPage";
import BatchDetailPage from "../modules/traceability/BatchDetailPage";
import FoodSafetyBot from "../modules/chatbot/FoodSafetyBot";

function NavBar() {
  const currentLanguage = getLanguage();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={HomePage} />
        <Route exact path="/tabs/camera" component={ScannerPage} />
        <Route
          exact
          path="/tabs/camera/traceability/:id"
          component={BatchDetailPage}
        />
        <Route
          exact
          path="/tabs/history/traceability/:id"
          component={BatchDetailPage}
        />
        <Route exact path="/tabs/education" component={EducationPage} />
        <Route exact path="/tabs/history" component={HistoryPage} />
        <Route
          exact
          path="/tabs/history/report/:id"
          component={ReportDetailPage}
        />
        <Route exact path="/tabs/assistant" component={FoodSafetyBot} />

        <Redirect exact from="/tabs" to="/tabs/home" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>{t("appMenuHome", currentLanguage)}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="camera" href="/tabs/camera">
          <IonIcon icon={camera} />
          <IonLabel>{t("appMenuCamera", currentLanguage)}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="education" href="/tabs/education">
          <IonIcon icon={school} />
          <IonLabel>{t("appMenuEducation", currentLanguage)}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="history" href="/tabs/history">
          <IonIcon icon={time} />
          <IonLabel>{t("appMenuHistory", currentLanguage)}</IonLabel>
        </IonTabButton>

        <IonTabButton tab="assistant" href="/tabs/assistant">
          <IonIcon icon={chatbubbles} />
          <IonLabel>{t("appMenuAssistant", currentLanguage)}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default NavBar;
