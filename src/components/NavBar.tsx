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

import HomePage from "../pages/HomePage/HomePage";
import CameraPage from "../pages/CameraPage/CameraPage";
import EducationPage from "../pages/EducationPage/EducationPage";
import HistoryPage from "../pages/HistoryPage/HistoryPage";
import ReportDetailsPage from "../pages/HistoryPage/ReportDetailsPage";
import TraceabilityPage from "../pages/CameraPage/TraceabiltyPage/TraceabilityPage";

function NavBar() {
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
          <IonLabel>Accueil</IonLabel>
        </IonTabButton>

        <IonTabButton tab="camera" href="/tabs/camera">
          <IonIcon icon={camera} />
          <IonLabel>Caméra</IonLabel>
        </IonTabButton>

        <IonTabButton tab="education" href="/tabs/education">
          <IonIcon icon={school} />
          <IonLabel>Éducation</IonLabel>
        </IonTabButton>

        <IonTabButton tab="history" href="/tabs/history">
          <IonIcon icon={time} />
          <IonLabel>Historique</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default NavBar;
