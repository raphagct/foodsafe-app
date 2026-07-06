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

/* Safe Area padding utilities */
import '@ionic/react/css/padding.css';

import {Redirect, Route} from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./modules/auth/LoginPage";
import RegisterPage from "./modules/auth/RegisterPage";
import {useAuth} from "./contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';

setupIonicReact();

// Configure the status bar on native iOS so the webview renders behind it
if (Capacitor.isNativePlatform()) {
    StatusBar.setStyle({ style: Style.Light });
    StatusBar.setOverlaysWebView({ overlay: true });
}

/**
 * PrivateRoute — redirects to /login if the user is not authenticated.
 */
function PrivateRoute({ component: Component, ...rest }: { component: React.ComponentType<any>; path: string; [key: string]: any }) {
    const { user, loading } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (loading) {
                    return null;
                }
                return user ? <Component {...props} /> : <Redirect to="/login" />;
            }}
        />
    );
}

function App() {
    const { user, loading } = useAuth();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // Show splash for a minimum of 2 seconds
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (showSplash || loading) {
        return <SplashScreen />;
    }

    return (
        <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    {/* Auth routes */}
                    <Route exact path="/login" component={LoginPage}/>
                    <Route exact path="/register" component={RegisterPage}/>

                    {/* Protected routes */}
                    <PrivateRoute path="/tabs" component={NavBar}/>

                    {/* Default redirect */}
                    <Route exact path="/">
                        {user ? <Redirect to="/tabs/home"/> : <Redirect to="/login"/>}
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
}

export default App;