import {
    IonApp, IonRouterOutlet,
    setupIonicReact,
} from '@ionic/react';
import {IonReactRouter} from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import {Redirect, Route} from "react-router-dom";
import ReportPage from "./pages/CameraPage/ReportPage/ReportPage";
import TraceabilityPage from "./pages/CameraPage/TraceabiltyPage/TraceabilityPage";
import NavBar from "./components/NavBar";

setupIonicReact();

function App() {
    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    {/* Pages hors tabs (plein écran, pas de tab bar) */}
                    <Route exact path="/report" component={ReportPage}/>
                    <Route exact path="/traceability" component={TraceabilityPage}/>

                    {/* Toutes les pages tabbées sont gérées par NavBar */}
                    <Route path="/tabs" component={NavBar}/>

                    {/* Redirection entrée */}
                    <Redirect exact from="/" to="/tabs/home"/>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
}

export default App;