import {
    IonApp,
    IonRouterOutlet,
    setupIonicReact,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
} from '@ionic/react';
import {IonReactRouter} from "@ionic/react-router";
import {Route, Redirect} from 'react-router-dom';

import {home, camera, school, time} from 'ionicons/icons';

import HomePage from "./pages/HomePage.tsx";
import CameraPage from "./pages/CameraPage.tsx";
import EducationPage from "./pages/EducationPage.tsx";
import HistoryPage from "./pages/HistoryPage.tsx";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

setupIonicReact();

function App() {
    return (
        <IonApp>
            <IonReactRouter>
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
            </IonReactRouter>
        </IonApp>
    );
}

export default App;