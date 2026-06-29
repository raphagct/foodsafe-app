import {
    IonApp, IonRouterOutlet,
    IonSpinner,
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
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import {useAuth} from "./contexts/AuthContext";

setupIonicReact();

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
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                            <IonSpinner name="crescent" style={{ width: 40, height: 40, '--color': '#159947' } as React.CSSProperties} />
                        </div>
                    );
                }
                return user ? <Component {...props} /> : <Redirect to="/login" />;
            }}
        />
    );
}

function App() {
    const { user, loading } = useAuth();

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
                        {loading ? null : user ? <Redirect to="/tabs/home"/> : <Redirect to="/login"/>}
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    );
}

export default App;