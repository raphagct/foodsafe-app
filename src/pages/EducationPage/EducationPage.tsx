import { IonContent, IonHeader, IonPage } from "@ionic/react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSearchbar,
} from "@ionic/react";

function EducationPage() {
  return (
    <IonPage>
      <IonHeader>
        <h1 className="text-2xl font-bold">Education</h1>
      </IonHeader>
      <IonContent>
        <IonSearchbar placeholder="Search"></IonSearchbar>
        <div className="flex flex-col p-4">
          <h2>Warning Sign Guides</h2>
          <div className="flex flex-row p-4 gap-4">
            <IonCard>
              <img
                alt="Silhouette of mountains"
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"
              />
              <IonCardHeader>
                <IonCardTitle>Card Title</IonCardTitle>
                <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                Here's a small text description for the card content. Nothing
                more, nothing less.
              </IonCardContent>
            </IonCard>
            <IonCard>
              <img
                alt="Silhouette of mountains"
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"
              />
              <IonCardHeader>
                <IonCardTitle>Card Title</IonCardTitle>
                <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                Here's a small text description for the card content. Nothing
                more, nothing less.
              </IonCardContent>
            </IonCard>
            <IonCard>
              <img
                alt="Silhouette of mountains"
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"
              />
              <IonCardHeader>
                <IonCardTitle>Card Title</IonCardTitle>
                <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                Here's a small text description for the card content. Nothing
                more, nothing less.
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default EducationPage;
