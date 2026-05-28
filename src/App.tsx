import {
    IonApp,
    setupIonicReact,
} from '@ionic/react';
import {IonReactRouter} from "@ionic/react-router";


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import NavBar from "./components/NavBar.tsx";

setupIonicReact();

function App() {
    return (
        <IonApp>
            <IonReactRouter>
                <NavBar/>
            </IonReactRouter>
        </IonApp>
    );
}

export default App;