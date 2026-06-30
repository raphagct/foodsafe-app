import { useState, useRef } from 'react';
import {
  IonPage,
  IonContent,
  useIonViewDidEnter,
  useIonViewWillLeave,
  IonIcon,
} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import CreateReportModal from './ReportPage/ReportPage';

function CameraTest() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [mode, setMode] = useState<'photo' | 'qr'>('qr');
  const router = useIonRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useIonViewDidEnter(() => {
    startCamera();
  });

  useIonViewWillLeave(() => {
    stopCamera();
  });

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedPhoto(dataUrl);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedPhoto(null);
  };

  const closeCamera = () => {
    stopCamera();
    router.push('/tabs/home', 'back', 'pop');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding-none">
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
          {/* Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />

          {/* QR Code Overlay (Grey background with clear square) */}
          {mode === 'qr' && (
            <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none flex items-center justify-center overflow-hidden">
              <div 
                className="w-64 h-64 relative z-20"
                style={{
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
                }}
              ></div>
            </div>
          )}

          {/* UI Layer */}
          <div className="absolute top-0 left-0 w-full h-full z-20 flex flex-col justify-between p-6 pointer-events-none">
            
            {/* Top Bar with Close Button */}
            <div className="flex justify-start items-start pointer-events-auto mt-8">
              <button 
                onClick={closeCamera}
                className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white active:bg-black/60 transition-colors"
              >
                <IonIcon icon={closeOutline} className="text-3xl" />
              </button>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col items-center pb-6 pointer-events-auto w-full">
              {/* Capture Button (only in photo mode) */}
              <div className="h-24 flex items-center justify-center mb-4">
                {mode === 'photo' && (
                  <button 
                    onClick={takePhoto}
                    className="w-16 h-16 rounded-full border-[3px] border-white p-1"
                  >
                    <div className="w-full h-full bg-white rounded-full"></div>
                  </button>
                )}
              </div>

              {/* Mode Toggle Pill */}
              <div className="bg-black/40 backdrop-blur-md rounded-full p-1 flex w-72 h-12 relative">
                <div 
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#d4d4d4] rounded-full transition-all duration-300 ease-in-out ${mode === 'qr' ? 'left-[50%]' : 'left-1'}`}
                ></div>
                <button 
                  onClick={() => setMode('photo')}
                  className={`flex-1 relative z-10 font-medium text-sm transition-colors duration-300 ${mode === 'photo' ? 'text-black' : 'text-[#8e8e8e]'}`}
                >
                  Photo Report
                </button>
                <button 
                  onClick={() => setMode('qr')}
                  className={`flex-1 relative z-10 font-medium text-sm transition-colors duration-300 ${mode === 'qr' ? 'text-black' : 'text-[#8e8e8e]'}`}
                >
                  Scan QR
                </button>
              </div>
            </div>
          </div>
        </div>
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