import { useState, useRef, useEffect, useCallback } from 'react';
import {
  IonPage,
  IonContent,
  useIonViewDidEnter,
  useIonViewWillLeave,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { Html5Qrcode } from 'html5-qrcode';
import CreateReportModal from '../report/CreateReportModal';
import { lookupByQR, saveScanToHistory } from '../../services/traceabilityService';
import type { TraceabilityResult, TraceabilityResultNotFound } from '../../types/traceability';
import { t, getLanguage } from '../../utils/i18n';

function ScannerPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [mode, setMode] = useState<'photo' | 'qr'>('qr');
  const [isLoading, setIsLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const router = useIonRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const currentLanguage = getLanguage();

  const stopQrScanner = useCallback(async () => {
    if (qrScannerRef.current) {
      try {
        const state = qrScannerRef.current.getState();
        // State 2 = SCANNING
        if (state === 2) {
          await qrScannerRef.current.stop();
        }
      } catch {
        // Ignore cleanup errors
      }
      qrScannerRef.current = null;
    }
  }, []);

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
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleQrResult = useCallback(async (decodedText: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsLoading(true);
    setScanError(null);

    try {
      await stopQrScanner();
      const result: TraceabilityResult = await lookupByQR(decodedText);

      // Save scan to Supabase history
      await saveScanToHistory(decodedText, result);

      if (!result.found) {
        const notFound = result as TraceabilityResultNotFound;
        setScanError(notFound.error);
        // Restart scanner after showing error
        setTimeout(() => {
          setScanError(null);
          isProcessingRef.current = false;
          startQrScanner();
        }, 3000);
      } else {
        // Store result in sessionStorage for BatchDetailPage to read
        sessionStorage.setItem('lastScanResult', JSON.stringify(result));
        router.push(`/tabs/camera/traceability/${result.batch.id}`, 'forward', 'push');
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setScanError("An error occurred during lookup.");
      setTimeout(() => {
        setScanError(null);
        isProcessingRef.current = false;
        startQrScanner();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  }, [router, stopQrScanner]);

  const startQrScanner = useCallback(async () => {
    await stopQrScanner();
    isProcessingRef.current = false;

    const readerEl = document.getElementById("qr-reader");
    if (!readerEl) return;

    try {
      const html5Qrcode = new Html5Qrcode("qr-reader");
      qrScannerRef.current = html5Qrcode;

      // Compute a square qrbox based on the container's actual size
      const containerWidth = readerEl.clientWidth;
      const containerHeight = readerEl.clientHeight;
      const smallerDim = Math.min(containerWidth, containerHeight);
      const qrboxSize = Math.max(200, Math.min(300, Math.floor(smallerDim * 0.65)));

      await html5Qrcode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: qrboxSize, height: qrboxSize },
          aspectRatio: containerHeight / containerWidth,
        },
        (decodedText) => {
          handleQrResult(decodedText);
        },
        () => {
          // Ignore non-fatal scan errors (no QR found in frame)
        }
      );
    } catch (err) {
      console.error("QR Scanner start error:", err);
    }
  }, [handleQrResult, stopQrScanner]);

  // Switch between QR and Photo mode
  useEffect(() => {
    if (mode === 'qr') {
      stopCamera();
      // Small delay to let DOM render the #qr-reader div
      const timer = setTimeout(() => {
        startQrScanner();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopQrScanner().then(() => startCamera());
    }
  }, [mode, startQrScanner, stopQrScanner]);

  useIonViewDidEnter(() => {
    if (mode === 'qr') {
      setTimeout(() => startQrScanner(), 100);
    } else {
      startCamera();
    }
  });

  useIonViewWillLeave(() => {
    stopCamera();
    stopQrScanner();
    isProcessingRef.current = false;
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
    stopQrScanner();
    router.push('/tabs/home', 'back', 'pop');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding-none">
        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">

          {/* QR mode: html5-qrcode renders its own video */}
          {mode === 'qr' && (
            <div
              id="qr-reader"
              className="absolute top-0 left-0 w-full h-full z-0"
              style={{ background: '#000' }}
            />
          )}

          {/* Photo mode: raw video feed */}
          {mode === 'photo' && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            />
          )}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full z-30 bg-black/70 flex flex-col items-center justify-center gap-4">
              <IonSpinner name="crescent" color="light" style={{ width: 48, height: 48 }} />
              <p className="text-white font-semibold text-lg">{t("lookingUp", currentLanguage)}</p>
            </div>
          )}

          {/* Error overlay */}
          {scanError && (
            <div className="absolute top-0 left-0 w-full h-full z-30 bg-black/70 flex flex-col items-center justify-center gap-4 px-8">
              <div className="bg-red-500/20 border border-red-400 rounded-2xl p-6 max-w-sm text-center">
                <p className="text-3xl mb-3">❌</p>
                <p className="text-white font-bold text-lg mb-2">{t("productNotFound", currentLanguage)}</p>
                <p className="text-white/80 text-sm">{scanError}</p>
              </div>
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
                  <div
                    onClick={takePhoto}
                    role="button"
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.9)',
                      padding: 2,
                      background: 'transparent',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                    className="active:scale-90 transition-transform duration-150"
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  </div>
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
                  {t("photoReport", currentLanguage)}
                </button>
                <button
                  onClick={() => setMode('qr')}
                  className={`flex-1 relative z-10 font-medium text-sm transition-colors duration-300 ${mode === 'qr' ? 'text-black' : 'text-[#8e8e8e]'}`}
                >
                  {t("scanQR", currentLanguage)}
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

export default ScannerPage;
