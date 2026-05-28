import {
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
} from '@ionic/react';
import {Route, Redirect} from 'react-router-dom';

import {home, camera, school, time} from 'ionicons/icons';

import HomePage from "../pages/HomePage.tsx";
import CameraPage from "../pages/CameraPage.tsx";
import EducationPage from "../pages/EducationPage.tsx";
import HistoryPage from "../pages/HistoryPage.tsx";


function NavBar() {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/home" render={() => <HomePage/>}/>
                <Route exact path="/camera" render={() => <CameraPage/>}/>
                <Route exact path="/education" render={() => <EducationPage/>}/>
                <Route exact path="/history" render={() => <HistoryPage/>}/>

                <Route exact path="/" render={() => <Redirect to="/home"/>}/>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                    <IonIcon icon={home}/>
                    <IonLabel>Accueil</IonLabel>
                </IonTabButton>

                <IonTabButton tab="camera" href="/camera">
                    <IonIcon icon={camera}/>
                    <IonLabel>Caméra</IonLabel>
                </IonTabButton>

                <IonTabButton tab="education" href="/education">
                    <IonIcon icon={school}/>
                    <IonLabel>Éducation</IonLabel>
                </IonTabButton>

                <IonTabButton tab="history" href="/history">
                    <IonIcon icon={time}/>
                    <IonLabel>Historique</IonLabel>
                </IonTabButton>
            </IonTabBar>

        </IonTabs>
    );
}

export default NavBar;