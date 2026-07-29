import { useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonItem,
  IonList,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  checkmarkCircle,
  warning,
  closeCircle,
  alertCircle,
  snowOutline,
  leafOutline,
  businessOutline,
  cubeOutline,
  flaskOutline,
  navigateOutline,
} from "ionicons/icons";
import { useParams } from "react-router-dom";
import { lookupByQR } from "../../services/traceabilityService";
import type {
  TraceabilityResultFound,
  ExpiryStatus,
} from "../../types/traceability";
import { t, getLanguage } from "../../utils/i18n";
import "../history/HistoryPage.css";

const STATUS_CONFIG: Record<
  ExpiryStatus,
  { bg: string; border: string; icon: string; textColor: string; ionColor: string }
> = {
  RECALL: { bg: "#FFEBEE", border: "#D32F2F", icon: "🚨", textColor: "#C62828", ionColor: "danger" },
  EXPIRED: { bg: "#F5F5F5", border: "#9E9E9E", icon: "⛔", textColor: "#616161", ionColor: "medium" },
  EXPIRING_SOON: { bg: "#FFF8E1", border: "#F9A825", icon: "⚠️", textColor: "#F57F17", ionColor: "warning" },
  VALID: { bg: "#E8F5E9", border: "#388E3C", icon: "✅", textColor: "#2E7D32", ionColor: "success" },
};

const statusLabel = (status: ExpiryStatus, lang: ReturnType<typeof getLanguage>) => {
  const map: Record<ExpiryStatus, Parameters<typeof t>[0]> = {
    VALID: "statusValid",
    EXPIRING_SOON: "statusExpiringSoon",
    EXPIRED: "statusExpired",
    RECALL: "statusRecall",
  };
  return t(map[status], lang);
};

function BatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<TraceabilityResultFound | null>(null);
  const lang = getLanguage();

  useIonViewWillEnter(() => {
    async function loadBatch() {
      const stored = sessionStorage.getItem("lastScanResult");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.found && (!id || parsed.batch?.id === id)) {
            setResult(parsed);
            return;
          }
        } catch {
          // ignore
        }
      }
      if (id) {
        const lookupRes = await lookupByQR(id);
        if (lookupRes.found) {
          setResult(lookupRes);
          sessionStorage.setItem("lastScanResult", JSON.stringify(lookupRes));
        }
      }
    }
    loadBatch();
  });

  if (!result) {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/camera" />
            </IonButtons>
            <IonTitle className="font-bold">{t("loading", lang)}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="flex items-center justify-center h-full text-gray-500">
            {t("productNotFound", lang)}
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const { batch, product, supplier, expiryStatus, daysLeft, coldChain, distributionTrail } = result;
  const s = STATUS_CONFIG[expiryStatus];

  return (
    <IonPage>
      <IonHeader className="ion-no-border bg-white">
        <IonToolbar className="[--background:white] py-2 px-2">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/camera" />
          </IonButtons>
          <IonTitle className="font-bold">{t("batchInfo", lang)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="history-content">
        <div className="px-4 pb-8 pt-2 flex flex-col gap-4">

          {/* ── Recall Banner ──────────────────────────────────────────── */}
          {result.isRecall && batch.recall_info && (
            <div
              className="rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              style={{ background: s.bg, borderLeft: `6px solid ${s.border}` }}
            >
              <h2 className="text-lg font-black flex items-center gap-2 mb-3" style={{ color: s.textColor }}>
                {s.icon} {t("recallBannerTitle", lang)}
              </h2>
              <div className="flex flex-col gap-1 text-sm">
                <p><strong>{t("recallNumber", lang)}:</strong> {batch.recall_info.recall_number}</p>
                <p><strong>{t("recallClass", lang)}:</strong> {batch.recall_info.class}</p>
                <p><strong>{t("recallReason", lang)}:</strong> {batch.recall_info.reason}</p>
                <p><strong>{t("recallAction", lang)}:</strong> {batch.recall_info.action_required}</p>
                <p><strong>{t("recallHotline", lang)}:</strong> {batch.recall_info.consumer_hotline}</p>
              </div>
            </div>
          )}

          {/* ── Product Header ─────────────────────────────────────────── */}
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-xl font-black text-gray-900 mb-1">{product.name}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  🌎 {t("countryOfOrigin", lang)}: {product.country_of_origin}
                </p>
              </div>
              <IonBadge
                color={s.ionColor}
                className="px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap shadow-sm"
              >
                {s.icon} {statusLabel(expiryStatus, lang)}
              </IonBadge>
            </div>

            {expiryStatus === "EXPIRING_SOON" && (
              <p className="text-sm mt-3 font-semibold" style={{ color: s.textColor }}>
                ⚠️ {t("expiresIn", lang)} {daysLeft} {daysLeft !== 1 ? "days" : "day"}
              </p>
            )}
            {expiryStatus === "EXPIRED" && (
              <p className="text-sm mt-3 font-semibold" style={{ color: s.textColor }}>
                ⛔ {t("expiredAgo", lang)} {Math.abs(daysLeft)} {Math.abs(daysLeft) !== 1 ? "days" : "day"} ago
              </p>
            )}
          </div>

          {/* ── Supplier & Certifications ──────────────────────────────── */}
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
            <h2 className="text-base font-bold flex items-center gap-2 mb-3 text-gray-900">
              <IonIcon icon={businessOutline} className="text-xl text-[var(--color-primary)]" />
              {t("producer", lang)}
            </h2>
            <p className="font-semibold text-gray-900">{supplier.name}</p>
            <p className="text-sm text-gray-500 mb-4">📍 {supplier.location.address}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {supplier.certification.map(c => (
                <IonChip key={c} color="success" className="text-xs font-semibold h-7 rounded-lg">
                  <IonIcon icon={leafOutline} />
                  <IonLabel>{c}</IonLabel>
                </IonChip>
              ))}
            </div>

            <p className="text-sm text-gray-600">
              {t("lastInspection", lang)}: {supplier.last_audit} —{" "}
              <strong style={{ color: "#388E3C" }}>{supplier.audit_result}</strong>
            </p>
          </div>

          {/* ── Batch Info ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
            <h2 className="text-base font-bold flex items-center gap-2 mb-3 text-gray-900">
              <IonIcon icon={cubeOutline} className="text-xl text-[var(--color-primary)]" />
              {t("batchInfo", lang)}
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t("batchId", lang)}</p>
                <h3 className="font-mono font-bold text-gray-900 mt-1">{batch.id}</h3>
              </div>
              <div className="w-full h-px bg-gray-50" />
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t("productionDate", lang)}</p>
                <h3 className="font-semibold text-gray-900 mt-1">{batch.production_date}</h3>
              </div>
              {batch.harvest_date && (
                <>
                  <div className="w-full h-px bg-gray-50" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t("harvestDate", lang)}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{batch.harvest_date}</h3>
                  </div>
                </>
              )}
              <div className="w-full h-px bg-gray-50" />
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{t("bestBy", lang)}</p>
                <h3 className="font-semibold text-gray-900 mt-1">{batch.expiry_date}</h3>
              </div>
            </div>
          </div>

          {/* ── Quality Control ────────────────────────────────────────── */}
          {batch.qc_test && (
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
              <h2 className="text-base font-bold flex items-center gap-2 mb-3 text-gray-900">
                <IonIcon icon={flaskOutline} className="text-xl text-[var(--color-primary)]" />
                {t("qualityControl", lang)}
              </h2>
              <p className="text-sm text-gray-700 font-medium">
                {batch.qc_test.lab}
              </p>
              <p className="text-sm mt-2 flex items-center gap-2">
                <span className="text-gray-500 font-medium">Result:</span>
                <strong className="px-2 py-0.5 rounded bg-gray-50" style={{ color: batch.qc_test.result === "PASS" ? "#388E3C" : "#D32F2F" }}>
                  {batch.qc_test.result}
                </strong>
              </p>
              {batch.qc_test.certificate_no && (
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  Certificate: <span className="text-gray-900">{batch.qc_test.certificate_no}</span>
                </p>
              )}
            </div>
          )}

          {/* ── Cold Chain ─────────────────────────────────────────────── */}
          {coldChain && (
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
              <h2 className="text-base font-bold flex items-center gap-2 mb-3 text-gray-900">
                <IonIcon icon={snowOutline} className="text-xl text-[var(--color-primary)]" />
                {t("coldChainIntegrity", lang)}
              </h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">{t("readings", lang)}</span>
                  <span className="font-bold text-gray-900">{coldChain.totalReadings}</span>
                </div>
                <div className="w-full h-px bg-gray-50" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">{t("violations", lang)}</span>
                  <span className="font-bold text-gray-900">{coldChain.violationCount} ({coldChain.violationRate})</span>
                </div>
                {coldChain.dangerZoneHours > 0 && (
                  <p className="text-sm font-bold bg-[#FFF8E1] p-3 rounded-xl mt-1" style={{ color: "#F57F17" }}>
                    ⚠️ {coldChain.dangerZoneHours}h in FDA {t("dangerZone", lang)} (40–140°F)
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <IonBadge
                    color={
                      coldChain.status === "PASS" ? "success" :
                      coldChain.status === "WARNING" ? "warning" : "danger"
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    <IonIcon
                      icon={
                        coldChain.status === "PASS" ? checkmarkCircle :
                        coldChain.status === "WARNING" ? warning : closeCircle
                      }
                      className="mr-1 text-sm align-text-bottom"
                    />
                    {coldChain.status === "PASS" ? t("coldChainPass", lang) :
                     coldChain.status === "WARNING" ? t("coldChainWarning", lang) :
                     t("coldChainFail", lang)}
                  </IonBadge>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">{coldChain.recommendation}</p>
              </div>
            </div>
          )}

          {/* ── Allergens ──────────────────────────────────────────────── */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-l-4 border-l-[#FF6F00] p-5 border-y border-r border-y-gray-100 border-r-gray-100">
              <h2 className="text-base font-bold flex items-center gap-2 mb-3 text-gray-900">
                <IonIcon icon={alertCircle} color="warning" className="text-xl" />
                {t("containsAllergens", lang)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map(a => (
                  <IonChip key={a} color="warning" className="font-bold text-xs uppercase h-7 rounded-lg">
                    <IonLabel>{a}</IonLabel>
                  </IonChip>
                ))}
              </div>
            </div>
          )}

          {/* ── Distribution Trail ─────────────────────────────────────── */}
          {distributionTrail.length > 0 && (
            <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5">
              <h2 className="text-base font-bold flex items-center gap-2 mb-4 text-gray-900">
                <IonIcon icon={navigateOutline} className="text-xl text-[var(--color-primary)]" />
                {t("distributionTrail", lang)}
              </h2>
              <div className="flex flex-col gap-4 relative">
                {/* Vertical line indicator */}
                <div className="absolute left-2.5 top-2 bottom-6 w-0.5 bg-gray-100 rounded-full" />
                
                {distributionTrail.map((d, i) => (
                  <div key={i} className="flex gap-4 relative z-10">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 pb-1">
                      <h3 className="font-bold text-gray-900 text-[15px]">
                        {d.distributor?.name ?? d.dest_id}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {d.shipped_date} · {d.carrier} · {d.quantity_units} units
                      </p>
                      {d.distributor?.type && (
                        <IonBadge color="light" className="mt-2 text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider font-bold">
                          {d.distributor.type.replace(/_/g, " ")}
                        </IonBadge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
}

export default BatchDetailPage;
