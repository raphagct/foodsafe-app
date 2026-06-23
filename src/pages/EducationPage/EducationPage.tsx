import { IonContent, IonHeader, IonPage } from "@ionic/react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSearchbar,
} from "@ionic/react";
import { t, getLanguage } from "../../utils/i18n";

function EducationPage() {
  const currentLanguage = getLanguage();

  return (
    <IonPage>
      <IonHeader>
        <h1 className="text-2xl font-bold">{t("educationTitle", currentLanguage)}</h1>
      </IonHeader>
      <IonContent>
        <IonSearchbar placeholder={t("searchPlaceholder", currentLanguage)}></IonSearchbar>
        <div className="flex flex-col p-4">
          <h2>{t("warningSignGuides", currentLanguage)}</h2>
          <div className="flex flex-row p-4 gap-4">
            <IonCard>
              <img
                alt={t("cardTitle", currentLanguage)}
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"
              />
              <IonCardHeader>
                <IonCardTitle>{t("cardTitle", currentLanguage)}</IonCardTitle>
                <IonCardSubtitle>{t("cardSubtitle", currentLanguage)}</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                {t("cardSubtitle", currentLanguage)}
              </IonCardContent>
            </IonCard>
            <IonCard>
              <img
                alt={t("cardTitle", currentLanguage)}
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"
              />
              <IonCardHeader>
                <IonCardTitle>{t("cardTitle", currentLanguage)}</IonCardTitle>
                <IonCardSubtitle>{t("cardSubtitle", currentLanguage)}</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                {t("cardSubtitle", currentLanguage)}
              </IonCardContent>
            </IonCard>
            <IonCard>
              <img
                alt={t("cardTitle", currentLanguage)}
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600&h=400"
              />
              <IonCardHeader>
                <IonCardTitle>{t("cardTitle", currentLanguage)}</IonCardTitle>
                <IonCardSubtitle>{t("cardSubtitle", currentLanguage)}</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                {t("cardSubtitle", currentLanguage)}
              </IonCardContent>
            </IonCard>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default EducationPage;
