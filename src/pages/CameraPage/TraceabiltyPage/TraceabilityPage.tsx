import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from "@ionic/react";

function TraceabilityPage() {
    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tabs/camera" />
                    </IonButtons>
                    <IonTitle className="font-bold">Traçabilité</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h2>Bonjour, je suis le composant Traceability !</h2>
            </IonContent>
        </IonPage>
    );
}

export default TraceabilityPage;