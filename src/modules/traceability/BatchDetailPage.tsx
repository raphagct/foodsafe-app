import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from "@ionic/react";

function BatchDetailPage() {
    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/tabs/camera" />
                    </IonButtons>
                    <IonTitle className="font-bold">Traceability</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h2>Batch Detail — Coming Soon</h2>
            </IonContent>
        </IonPage>
    );
}

export default BatchDetailPage;
