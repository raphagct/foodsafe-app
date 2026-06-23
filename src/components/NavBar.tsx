import {
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router-dom";

import { home, camera, school, time } from "ionicons/icons";
import { t, getLanguage } from "../utils/i18n";

import HomePage from "../pages/HomePage/HomePage";
import CameraPage from "../pages/CameraPage/CameraPage";
import EducationPage from "../pages/EducationPage/EducationPage";
import HistoryPage from "../pages/HistoryPage/HistoryPage";
import ReportDetailsPage from "../pages/HistoryPage/ReportDetailsPage";
import TraceabilityPage from "../pages/CameraPage/TraceabiltyPage/TraceabilityPage";

function NavBar() {
  const currentLanguage = getLanguage();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tabs/home" component={HomePage} />
        <Route exact path="/tabs/camera" component={CameraPage} />
        <Route
          exact
          path="/tabs/camera/traceability/:id"
          component={TraceabilityPage}
        />
        <Route exact path="/tabs/education" component={EducationPage} />
        <Route exact path="/tabs/history" component={HistoryPage} />
        <Route
          exact
          path="/tabs/history/report/:id"
          component={ReportDetailsPage}
        />

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
      </IonTabBar>
    </IonTabs>
  );
}

export default NavBar;
