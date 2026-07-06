# Integration Guide
## Food Safety R&D System — English Edition

---

## 1. RECOMMENDED PROJECT STRUCTURE

```
food-safety-app/
├── public/
│   └── data/
│       ├── mock_traceability_db_EN.json    ← Traceability mock database
│       └── education_content_EN.json       ← Education module content
├── src/
│   ├── modules/
│   │   ├── traceability/
│   │   │   ├── QRScanner.jsx               ← Camera QR / barcode scanner
│   │   │   ├── BatchDetail.jsx             ← Batch info display card
│   │   │   ├── ColdChainTimeline.jsx       ← Temperature log visualization
│   │   │   ├── RecallBanner.jsx            ← High-visibility recall alert
│   │   │   └── SupplyChainMap.jsx          ← Farm → distributor map
│   │   ├── education/
│   │   │   ├── CategoryList.jsx            ← Browse by category
│   │   │   ├── ArticleDetail.jsx           ← Content block renderer
│   │   │   ├── QuizEngine.jsx              ← Timed quiz with scoring
│   │   │   └── DailyTip.jsx                ← Date-rotated safety tip
│   │   └── chatbot/
│   │       └── FoodSafetyBot.jsx           ← Claude API chatbot UI
│   ├── services/
│   │   ├── traceabilityService.js          ← QR lookup, cold chain analysis
│   │   ├── educationService.js             ← Content fetching, quiz grading
│   │   ├── recallService.js                ← FDA API + local recall alerts
│   │   └── aiService.js                    ← Claude API calls via Worker
│   └── workers/
│       └── food-safety-bot.js              ← Cloudflare Worker (backend)
└── scripts/
    └── generate-qr-codes.js               ← Utility: print test QR labels
```

---

## 2. TRACEABILITY MODULE

### Step 1 — Install Scanner Library

```bash
# React Web / PWA
npm install html5-qrcode

# React Native / Expo
npx expo install expo-barcode-scanner

# Flutter
flutter pub add mobile_scanner
```

### Step 2 — Traceability Service

```javascript
// src/services/traceabilityService.js

let _db = null;

async function getDatabase() {
  if (_db) return _db;
  const res = await fetch("/data/mock_traceability_db_EN.json");
  _db = await res.json();
  return _db;
}

/**
 * Look up a QR or barcode scan result.
 * Accepts: batch ID, product ID, or GS1 barcode (no dashes).
 * Returns enriched record with expiry status and cold chain analysis.
 */
export async function lookupByQR(rawValue) {
  const db = await getDatabase();

  // Strip URL prefix if user scanned a full URL QR code
  const key = rawValue
    .replace(/^https?:\/\/trace\.foodsafe\.io\/scan\//i, "")
    .trim();

  const batchId = db.qr_scan_lookup[key];
  if (!batchId) {
    return {
      found: false,
      scannedValue: key,
      error: `No product information found for: "${key}". This product may not be in the system yet.`
    };
  }

  const batch   = db.batches[batchId];
  const product = db.products[batch.product_id];
  const supplier = db.suppliers[product.supplier_id];

  // Expiry calculation
  const today      = new Date();
  const expiryDate = new Date(batch.expiry_date);
  const daysLeft   = Math.ceil((expiryDate - today) / 86_400_000);

  const expiryStatus =
    batch.status === "RECALL"  ? "RECALL"         :
    daysLeft < 0               ? "EXPIRED"         :
    daysLeft <= 2              ? "EXPIRING_SOON"   : "VALID";

  // Cold chain analysis
  const coldChain = batch.cold_chain_log
    ? analyzeColdChain(batch.cold_chain_log, product)
    : null;

  // Enrich distributor info
  const distributionTrail = (batch.distribution || []).map(d => ({
    ...d,
    distributor: db.distributors[d.dest_id] || null
  }));

  return {
    found:            true,
    batch,
    product,
    supplier,
    expiryStatus,
    daysLeft,
    isRecall:         batch.status === "RECALL",
    coldChain,
    distributionTrail
  };
}

/**
 * Analyze cold chain log for temperature violations.
 */
function analyzeColdChain(log, product) {
  const safeMin = product.storage_temp_f?.min ?? (product.storage_temp_c?.min * 9/5 + 32);
  const safeMax = product.storage_temp_f?.max ?? (product.storage_temp_c?.max * 9/5 + 32);
  const tempKey = log[0]?.temp_f !== undefined ? "temp_f" : "temp_c";

  const violations = log.filter(r => {
    const t = r[tempKey];
    return t < safeMin || t > safeMax;
  });

  // FDA Danger Zone: 40°F–140°F (4°C–60°C)
  const dangerZoneHours = tempKey === "temp_f"
    ? log.filter(r => r.temp_f >= 40 && r.temp_f <= 140).length
    : log.filter(r => r.temp_c >= 4  && r.temp_c <= 60).length;

  return {
    totalReadings:    log.length,
    violationCount:   violations.length,
    violationRate:    ((violations.length / log.length) * 100).toFixed(1) + "%",
    dangerZoneHours,
    violations,
    status:
      violations.length === 0 ? "PASS" :
      violations.length <= 1  ? "WARNING" : "FAIL",
    recommendation:
      violations.length === 0
        ? "Cold chain integrity confirmed."
        : `${violations.length} temperature excursion(s) detected. Verify product quality before sale.`
  };
}

export async function getAllProducts() {
  const db = await getDatabase();
  return Object.values(db.products).map(p => ({
    ...p,
    supplier: db.suppliers[p.supplier_id]
  }));
}
```

### Step 3 — QR Scanner Component (React / PWA)

```jsx
// src/modules/traceability/QRScanner.jsx
import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { lookupByQR } from "../../services/traceabilityService";

export default function QRScanner({ onResult }) {
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading]   = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 260, height: 260 },
      rememberLastUsedCamera: true
    });

    scanner.render(
      async (decodedText) => {
        setScanning(false);
        setLoading(true);
        scanner.clear().catch(() => {});
        const result = await lookupByQR(decodedText);
        setLoading(false);
        onResult(result);
      },
      (err) => { /* suppress non-fatal scan errors */ }
    );

    scannerRef.current = scanner;
    return () => scannerRef.current?.clear().catch(() => {});
  }, [onResult]);

  return (
    <div className="qr-scanner">
      {scanning && (
        <>
          <p className="scan-hint">
            📷 Point the camera at the QR code or barcode on the product packaging
          </p>
          <div id="qr-reader" style={{ width: "100%", maxWidth: 420 }} />
        </>
      )}
      {loading && <p className="loading">🔍 Looking up product information…</p>}
    </div>
  );
}
```

### Step 4 — Batch Detail Display

```jsx
// src/modules/traceability/BatchDetail.jsx
const STATUS_CONFIG = {
  RECALL:        { bg: "#FFEBEE", border: "#D32F2F", icon: "🚨", label: "RECALLED" },
  EXPIRED:       { bg: "#F5F5F5", border: "#9E9E9E", icon: "⛔", label: "EXPIRED" },
  EXPIRING_SOON: { bg: "#FFF8E1", border: "#F9A825", icon: "⚠️", label: "Expires Soon" },
  VALID:         { bg: "#E8F5E9", border: "#388E3C", icon: "✅", label: "In Date" },
};

export default function BatchDetail({ result }) {
  if (!result.found) {
    return (
      <div className="error-card">
        <p>❌ {result.error}</p>
        <p style={{ fontSize: "0.85em", color: "#666" }}>
          Scanned value: <code>{result.scannedValue}</code>
        </p>
      </div>
    );
  }

  const { batch, product, supplier, expiryStatus, daysLeft, coldChain, distributionTrail } = result;
  const s = STATUS_CONFIG[expiryStatus];

  return (
    <div className="batch-detail">

      {/* ── Recall Banner ─────────────────────────────────────────────── */}
      {result.isRecall && (
        <div className="recall-banner" style={{ background: s.bg, borderLeft: `6px solid ${s.border}` }}>
          <h2>{s.icon} Product Recalled — Do Not Consume</h2>
          <p><strong>Recall #:</strong> {batch.recall_info.recall_number}</p>
          <p><strong>Class:</strong> {batch.recall_info.class}</p>
          <p><strong>Reason:</strong> {batch.recall_info.reason}</p>
          <p><strong>Action:</strong> {batch.recall_info.action_required}</p>
          <p><strong>Hotline:</strong> {batch.recall_info.consumer_hotline}</p>
        </div>
      )}

      {/* ── Product Header ────────────────────────────────────────────── */}
      <section className="product-header">
        <h1>{product.name}</h1>
        <span className="status-badge" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
          {s.icon} {s.label}
          {expiryStatus === "EXPIRING_SOON" && ` — ${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining`}
          {expiryStatus === "EXPIRED" && ` — expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`}
        </span>
        <p className="country-origin">🌎 Country of Origin: {product.country_of_origin}</p>
      </section>

      {/* ── Supplier & Certifications ─────────────────────────────────── */}
      <section className="supplier-card">
        <h3>🏭 Producer</h3>
        <p>{supplier.name}</p>
        <p>📍 {supplier.location.address}</p>
        <div className="cert-badges">
          {supplier.certification.map(c => (
            <span key={c} className="cert-badge">{c}</span>
          ))}
        </div>
        <p className="audit-status">
          Last inspection: {supplier.last_audit} —{" "}
          <strong style={{ color: "#388E3C" }}>{supplier.audit_result}</strong>
        </p>
      </section>

      {/* ── Batch Info ────────────────────────────────────────────────── */}
      <section className="batch-card">
        <h3>📦 Batch Information</h3>
        <table className="info-table">
          <tbody>
            <tr><td>Batch ID</td><td><code>{batch.id}</code></td></tr>
            <tr><td>Pack / Production Date</td><td>{batch.production_date}</td></tr>
            {batch.harvest_date && <tr><td>Harvest Date</td><td>{batch.harvest_date}</td></tr>}
            <tr><td>Best By / Use By</td><td>{batch.expiry_date}</td></tr>
          </tbody>
        </table>
      </section>

      {/* ── Quality Control ───────────────────────────────────────────── */}
      {batch.qc_test && (
        <section className="qc-card">
          <h3>🔬 Quality Control</h3>
          <p>Tested by: {batch.qc_test.lab}</p>
          <p>Result: <strong style={{ color: batch.qc_test.result === "PASS" ? "#388E3C" : "#D32F2F" }}>
            {batch.qc_test.result}
          </strong></p>
          {batch.qc_test.certificate_no && (
            <p>Certificate: {batch.qc_test.certificate_no}</p>
          )}
        </section>
      )}

      {/* ── Cold Chain ────────────────────────────────────────────────── */}
      {coldChain && (
        <section className="coldchain-card">
          <h3>❄️ Cold Chain Integrity</h3>
          <p>Readings logged: {coldChain.totalReadings}</p>
          <p>Temperature violations: {coldChain.violationCount}</p>
          {coldChain.dangerZoneHours > 0 && (
            <p style={{ color: "#F57F17" }}>
              ⚠️ {coldChain.dangerZoneHours}h recorded in FDA Danger Zone (40–140°F)
            </p>
          )}
          <p className={`chain-status chain-${coldChain.status.toLowerCase()}`}>
            Status: <strong>{coldChain.status}</strong>
          </p>
          <p className="chain-rec">{coldChain.recommendation}</p>
        </section>
      )}

      {/* ── Allergens ─────────────────────────────────────────────────── */}
      {product.allergens?.length > 0 && (
        <section className="allergen-card" style={{ borderLeft: "4px solid #FF6F00" }}>
          <h3>⚠️ Contains Allergens</h3>
          <div className="allergen-tags">
            {product.allergens.map(a => (
              <span key={a} className="allergen-tag">{a.toUpperCase()}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

---

## 3. EDUCATION MODULE

```javascript
// src/services/educationService.js

let _content = null;

async function getContent() {
  if (_content) return _content;
  const res = await fetch("/data/education_content_EN.json");
  _content = await res.json();
  return _content;
}

export const getCategories  = async () => (await getContent()).categories;
export const getDailyTip    = async () => {
  const c = await getContent();
  return c.daily_tips[new Date().getDate() % c.daily_tips.length];
};

export const getArticlesByCategory = async (categoryId) => {
  const c = await getContent();
  return c.articles.filter(a => a.category_id === categoryId);
};

export const getArticleById = async (id) => {
  const c = await getContent();
  return c.articles.find(a => a.id === id) ?? null;
};

export const getQuiz = async (quizId) => {
  const c = await getContent();
  return c.quizzes.find(q => q.id === quizId) ?? null;
};

export const getAllQuizzes = async () => (await getContent()).quizzes;

/**
 * Grade a completed quiz.
 * @param {Object} quiz — the quiz object from getQuiz()
 * @param {Object} answers — { "Q001": "B", "Q002": "C", ... }
 */
export function gradeQuiz(quiz, answers) {
  let correct = 0;

  const results = quiz.questions.map(q => {
    const userAnswer = answers[q.id];
    const isCorrect  = userAnswer === q.correct_answer;
    if (isCorrect) correct++;
    return {
      questionId:    q.id,
      question:      q.question,
      userAnswer,
      correctAnswer: q.correct_answer,
      isCorrect,
      explanation:   q.explanation
    };
  });

  const score = Math.round((correct / quiz.questions.length) * 100);
  return {
    score,
    correct,
    total:      quiz.questions.length,
    passed:     score >= quiz.pass_score,
    grade:      score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F",
    results
  };
}
```

---

## 4. RECALL ALERTS MODULE

```javascript
// src/services/recallService.js

/**
 * Fetch recent FDA food recalls matching a keyword.
 * Wraps the openFDA food enforcement API.
 */
export async function fetchRecentRecalls({ keyword = "contamination", days = 30 } = {}) {
  const since = new Date(Date.now() - days * 86_400_000)
    .toISOString().slice(0, 10).replace(/-/g, "");

  const url = [
    "https://api.fda.gov/food/enforcement.json",
    `?search=recall_initiation_date:[${since}+TO+99991231]`,
    keyword ? `+AND+reason_for_recall:"${encodeURIComponent(keyword)}"` : "",
    "&limit=10"
  ].join("");

  try {
    const res = await fetch(url);
    if (!res.ok) return { recalls: [], error: `FDA API error: ${res.status}` };
    const data = await res.json();
    return { recalls: data.results ?? [], total: data.meta?.results?.total ?? 0 };
  } catch (err) {
    return { recalls: [], error: err.message };
  }
}

/**
 * Map FDA recall classification to UI severity.
 */
export function classifyRecallSeverity(fdaClass) {
  const map = {
    "Class I":   { level: "HIGH",   color: "#D32F2F", description: "Reasonable probability of serious adverse health consequences or death." },
    "Class II":  { level: "MEDIUM", color: "#F57F17", description: "May cause temporary adverse health consequences; probability of serious risk is remote." },
    "Class III": { level: "LOW",    color: "#388E3C", description: "Unlikely to cause any adverse health consequences." }
  };
  return map[fdaClass] ?? { level: "UNKNOWN", color: "#757575", description: "Severity not classified." };
}
```

---

## 5. CHATBOT MODULE (Claude API via Cloudflare Worker)

```javascript
// workers/food-safety-bot.js — deploy to Cloudflare Workers
// wrangler secret put ANTHROPIC_API_KEY

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { question, history = [] } = await request.json();
    if (!question?.trim()) {
      return new Response(JSON.stringify({ error: "Question is required" }), { status: 400 });
    }

    const SYSTEM_PROMPT = `You are a Food Safety Specialist AI. You have deep expertise in:
- FDA, USDA, EPA food safety regulations
- Foodborne pathogen biology (Salmonella, Listeria, E. coli O157:H7, Norovirus, Campylobacter)
- HACCP, ISO 22000, SQF food safety management systems
- Food labeling law (21 CFR 101, FALCPA, FASTER Act)
- Cold chain and temperature management
- Pesticide tolerances and residue assessment

Rules:
1. Be concise and accurate. Cite regulations or studies where relevant.
2. For active foodborne illness emergencies: recommend calling 911 or Poison Control (1-800-222-1222) IMMEDIATELY.
3. For recall information: direct users to foodsafety.gov.
4. Never provide personal medical diagnoses. Recommend healthcare providers when appropriate.
5. Acknowledge uncertainty clearly rather than guessing.`;

    try {
      const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...history.slice(-10),   // keep last 10 turns for context
            { role: "user", content: question }
          ]
        })
      });

      const data  = await apiRes.json();
      const answer = data.content?.[0]?.text ?? "No response received.";

      return new Response(JSON.stringify({ answer }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
        status: 503,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
```

---

## 6. TEST SCENARIOS — QR Codes

Encode these values into QR codes for demo and testing:

| QR Value | Scenario | Expected Result |
|----------|----------|-----------------|
| `BATCH-2026-LET-0601` | Normal fresh produce | ✅ Active — Organic Butter Lettuce, cert: VietGAP-equivalent (USDA Organic) |
| `BATCH-2026-SHR-0522` | Normal frozen seafood | ✅ Active — Frozen Shrimp, allergen: shellfish |
| `BATCH-2026-MLK-0530` | Normal dairy | ✅ Active — Whole Milk, allergen: milk |
| `BATCH-2026-STR-0605-RECALL` | Recall event | 🚨 RECALLED — Pesticide violation, Class II |
| `BATCH-2026-RIC-0601` | Dry goods | ✅ Active — Long-Grain Rice, 2-year shelf life |
| `0036800678901` | GS1 barcode lookup | ✅ Routes to Whole Milk batch |
| `NOT-IN-DB-0001` | Unknown scan | ❌ Not found error message |

---

## 7. INTEGRATION CHECKLIST

- [ ] Copy `mock_traceability_db_EN.json` and `education_content_EN.json` to `public/data/`
- [ ] Install QR scanner library for your target platform
- [ ] Wire `traceabilityService.lookupByQR()` to QR scanner callback
- [ ] Render `BatchDetail` component on scan result
- [ ] Test all 5 active batches + 1 recall + 1 unknown scan
- [ ] Implement `educationService.getCategories()` + article list screen
- [ ] Build quiz flow using `gradeQuiz()` with per-question explanations
- [ ] Implement `getDailyTip()` on home screen (date-rotated)
- [ ] Deploy Cloudflare Worker with `ANTHROPIC_API_KEY` secret (chatbot)
- [ ] Add recall severity badge using `classifyRecallSeverity()`
- [ ] Add cold chain status indicator on all batch detail screens
- [ ] Add allergen warning banner for products with declared allergens
- [ ] Handle network errors gracefully (offline fallback to cached JSON)
- [ ] Add loading skeleton states for all async operations
