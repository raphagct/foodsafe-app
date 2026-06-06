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
import NavBar from "./components/NavBar";

setupIonicReact();

function App() {
    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>


                    <Route path="/tabs" component={NavBar}/>

                    <Redirect exact from="/" to="/tabs/home"/>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
}

export default App;