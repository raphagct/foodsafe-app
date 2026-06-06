import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  useIonViewDidEnter,
} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import CreateReportModal from './ReportPage/ReportPage';

function CameraTest() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const router = useIonRouter();

  const prendreUnePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 800
      });

      if (image.dataUrl) {
        setSelectedPhoto(image.dataUrl);
      }
    } catch (erreur) {
      console.log("L'utilisateur a annulé ou une erreur est survenue :", erreur);
      // Si l'utilisateur ferme la caméra sans prendre de photo, on le renvoie à l'accueil
      router.push('/tabs/home', 'back', 'pop');
    }
  };

  useIonViewDidEnter(() => {
    if (!selectedPhoto) {
      prendreUnePhoto();
    }
  });

  const handleCloseModal = (wasSubmitted?: boolean) => {
    setSelectedPhoto(null);
    if (!wasSubmitted) {
      // Si on a annulé le formulaire (pas de submit), on réouvre direct la caméra !
      prendreUnePhoto();
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle className="font-bold">Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding [--background:var(--color-surface)]">
        {/* On laisse un écran noir ou vide car la caméra passe direct par dessus */}
      </IonContent>

      <CreateReportModal 
        isOpen={!!selectedPhoto} 
        photoUrl={selectedPhoto} 
        onClose={handleCloseModal} 
      />
    </IonPage>
  );
}

export default CameraTest;