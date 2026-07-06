# AI Datasets & Models for Food Safety R&D
## Reference Guide — Food Safety System (English Edition)

---

## 1. PUBLIC DATASETS

### 1.1 Food Safety Incident & Inspection Data

| Dataset | Source | Size | Description | Access |
|---------|--------|------|-------------|--------|
| FDA Food Enforcement Reports | FDA (US) | ~50K records/year | Product recalls — reason, scope, classification, firm | https://open.fda.gov/food/enforcement/ |
| EU RASFF Notifications | EFSA (EU) | ~3,500 entries/year | Rapid Alert System — unsafe food & feed in Europe | https://webgate.ec.europa.eu/rasff-window/ |
| USDA FSIS Recall Archive | USDA FSIS | Archive from 2000 | Meat and poultry recall history with hazard type | https://www.fsis.usda.gov/recalls |
| CDC Foodborne Outbreak Data | CDC | Annual reports | Outbreak investigations by pathogen, food, setting | https://wwwn.cdc.gov/norsdashboard/ |
| WHO Surveillance Reports | WHO | Annual PDFs | Global foodborne disease burden by country and pathogen | https://www.who.int/teams/food-safety |
| EFSA Food Safety Data | EFSA | Structured XML/JSON | EU pesticide residue monitoring, zoonoses reports | https://www.efsa.europa.eu/en/data/data-report-tool |

### 1.2 Nutrition & Product Data

| Dataset | Source | Size | Description | Access |
|---------|--------|------|-------------|--------|
| USDA FoodData Central | USDA ARS | 600K+ foods | Authoritative US nutritional composition database | https://fdc.nal.usda.gov/download-foods.html |
| Open Food Facts | Community (CC-BY-SA) | 3M+ products worldwide | Labels, ingredients, allergens, Nutri-Score, additives. Free API. | https://world.openfoodfacts.org/data |
| CODEX MRL Database | FAO/WHO | Online database | International Maximum Residue Limits for pesticides | https://www.fao.org/fao-who-codexalimentarius |
| EPA Pesticide Tolerance Database | EPA | Online | US legal tolerances for pesticide residues in food | https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-180 |
| CFSAN Adverse Event Reporting | FDA | Structured data | Adverse events related to dietary supplements and cosmetics | https://open.fda.gov/food/event/ |

### 1.3 Computer Vision — Food Image Datasets

| Dataset | Task | Images | Format | Access |
|---------|------|--------|--------|--------|
| Food-101 | 101 food category classification | 101,000 | JPG + class labels | https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/ |
| Food-256 (ETHZ) | Expanded food classification | 256 classes | JPG | Kaggle: food-256 |
| UEC Food 256 | Japanese food detection | 31,651 | YOLO + bounding boxes | http://foodcam.mobi/dataset256.html |
| PlantVillage | Plant disease classification | 54,306 | JPG, 38 classes | https://plantvillage.psu.edu/ |
| PlantDoc | Real-world plant disease (in-field) | 2,598 | JPG, harder than PlantVillage | GitHub: pratikkayal/PlantDoc-Dataset |
| Fresh vs. Rotten | Produce freshness binary | ~13,000 | JPG | Kaggle: fresh-and-stale-classification |
| Garbage Classification | Waste sorting (food waste included) | 15,150 | JPG | Kaggle: garbage-classification |
| COCO (food subset) | Object detection in context | 330K+ images | COCO JSON | https://cocodataset.org |

### 1.4 Supply Chain & Traceability Data

| Dataset | Source | Content | Notes |
|---------|--------|---------|-------|
| GS1 US Data Hub | GS1 US | Product registry by GTIN (barcode) | Account required; commercial API |
| USDA AMS Organic Integrity | USDA | Organic farm certifications, locations | https://ams.usda.gov/organic-integrity |
| USDA NASS Agricultural Census | USDA | Farm locations, crops, acreage | https://www.nass.usda.gov/AgCensus/ |
| NOAA Fish Watch | NOAA | Wild-catch seafood species, sustainability | https://www.fishwatch.gov |
| EPA Envirofacts | EPA | Facility locations, emissions — useful for risk proximity | https://enviro.epa.gov |
| FERN Collaborative Data | USDA/FDA | Integrated food safety testing results | Partner access via FDA |

---

## 2. PRETRAINED MODELS & CODE

### 2.1 Computer Vision — Food Classification & Detection

```python
# ── MODEL 1: Food Category Classification (101 classes) ──────────────────────
# Source: EfficientNetV2 fine-tuned on Food-101
# HuggingFace: nateraw/food (CC-BY-SA 4.0)

from transformers import pipeline

food_classifier = pipeline(
    "image-classification",
    model="nateraw/food",
    top_k=5
)

result = food_classifier("images/plate.jpg")
# [{'label': 'caesar_salad', 'score': 0.912}, {'label': 'greek_salad', 'score': 0.043}, ...]

# ── MODEL 2: Plant Disease Detection ─────────────────────────────────────────
# Source: MobileNetV2 fine-tuned on PlantVillage (38 disease classes)
# HuggingFace: linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification

from transformers import pipeline

plant_model = pipeline(
    "image-classification",
    model="linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
)
result = plant_model("images/tomato_leaf.jpg")

# ── MODEL 3: Produce Freshness Detection (custom) ────────────────────────────
# Fine-tune YOLOv8 on Fresh vs. Rotten dataset
# pip install ultralytics

from ultralytics import YOLO

# Start from pretrained classification model, fine-tune on freshness data
model = YOLO("yolov8s-cls.pt")

model.train(
    data="datasets/freshness/",
    epochs=50,
    imgsz=224,
    batch=32,
    project="food_freshness",
    name="fresh_rotten_v1"
)

# Inference
results = model.predict("apple_test.jpg", save=True)
print(results[0].probs.top5)

# ── MODEL 4: General Object Detection (COCO pretrained) ──────────────────────
from ultralytics import YOLO

detector = YOLO("yolov8n.pt")  # nano — fast inference on mobile
results = detector("shelf_photo.jpg")
# Detect: persons, bottles, cups, etc. — useful for compliance checking
```

### 2.2 NLP — Text Analysis for Food Safety Reports

```python
# ── MODEL 1: Named Entity Recognition (food, org, location) ──────────────────
# Useful for parsing recall notices, inspection reports, news articles
# HuggingFace: dslim/bert-base-NER

from transformers import pipeline

ner = pipeline(
    "ner",
    model="dslim/bert-base-NER",
    aggregation_strategy="simple"
)

text = "FDA announced that Acme Foods of Springfield, IL is recalling 2,000 lbs of ground beef due to possible E. coli O157:H7 contamination."
entities = ner(text)
# [{'entity_group': 'ORG', 'word': 'FDA', ...}, {'entity_group': 'ORG', 'word': 'Acme Foods', ...}, ...]

# ── MODEL 2: Zero-shot Text Classification ───────────────────────────────────
# Classify recall severity, food category, or hazard type without training data
# HuggingFace: facebook/bart-large-mnli

from transformers import pipeline

classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

recall_text = "Product may contain undeclared tree nuts — risk to consumers with nut allergies."
result = classifier(
    recall_text,
    candidate_labels=["allergen", "microbial contamination", "physical hazard", "chemical contamination"]
)
# {'labels': ['allergen', 'chemical contamination', ...], 'scores': [0.89, ...]}

# ── MODEL 3: Sentence Embeddings for Semantic Search ─────────────────────────
# Build a semantic search over food safety knowledge base (RAG foundation)
# pip install sentence-transformers

from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")  # lightweight, fast

# Index your knowledge base
knowledge_base = [
    "Salmonella is commonly found in raw poultry and eggs.",
    "Store raw meat on the bottom shelf of the refrigerator.",
    "The FDA Danger Zone for food is 40°F to 140°F.",
    # ... more entries from education_content_EN.json
]
embeddings = model.encode(knowledge_base, normalize_embeddings=True)

# Query
query = "What temperature is safe for cooking chicken?"
query_emb = model.encode(query, normalize_embeddings=True)
scores = np.dot(embeddings, query_emb)
best_match = knowledge_base[scores.argmax()]
print(best_match)  # → "The FDA Danger Zone for food is 40°F to 140°F."
```

### 2.3 Predictive Models — Risk Assessment

```python
# ── MODEL 1: Cold Chain Violation Risk Classifier ─────────────────────────────
# Feature-engineered XGBoost model for cold chain integrity scoring
# pip install xgboost pandas scikit-learn

import xgboost as xgb
import pandas as pd
from sklearn.preprocessing import LabelEncoder

PRODUCT_CATEGORIES = {"vegetable": 0, "fruit": 1, "dairy": 2, "seafood": 3, "grain": 4}

def extract_cold_chain_features(cold_chain_log: list, product: dict) -> dict:
    """
    Extract predictive features from a cold chain log entry.
    Returns a feature dict suitable for model input.
    """
    temp_field = "temp_f"  # use temp_c for metric
    safe_min = product["storage_temp_f"]["min"]
    safe_max = product["storage_temp_f"]["max"]
    
    temps = [r[temp_field] for r in cold_chain_log]
    n = len(temps)
    
    violations = [t for t in temps if t < safe_min or t > safe_max]
    max_exceedance = max([max(safe_min - t, t - safe_max, 0) for t in temps]) if temps else 0
    
    # Time-at-temperature approximation (assuming 1 reading/hour)
    hours_in_danger_zone = sum(1 for t in temps if 40 <= t <= 140)  # FDA Danger Zone
    
    return {
        "avg_temp": sum(temps) / n if n else 0,
        "max_temp": max(temps) if temps else 0,
        "min_temp": min(temps) if temps else 0,
        "temp_std": pd.Series(temps).std() if n > 1 else 0,
        "violation_count": len(violations),
        "violation_rate": len(violations) / n if n else 0,
        "max_exceedance_deg": max_exceedance,
        "hours_in_danger_zone": hours_in_danger_zone,
        "total_readings": n,
        "shelf_life_days": product["shelf_life_days"],
        "product_category_code": PRODUCT_CATEGORIES.get(product["category"], -1)
    }

# Training (requires labeled cold chain data — simulate with mock database)
# Labels: 0 = SAFE, 1 = DEGRADED, 2 = UNSAFE
# model = xgb.XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.05)
# model.fit(X_train, y_train)

# Rule-based fallback (for demo without training data):
def rule_based_risk_score(features: dict) -> dict:
    score = 0
    if features["violation_count"] > 0: score += 30
    if features["violation_count"] > 3: score += 20
    if features["max_exceedance_deg"] > 10: score += 25
    if features["hours_in_danger_zone"] > 2: score += 25

    level = "LOW" if score < 30 else "MEDIUM" if score < 60 else "HIGH"
    return {"risk_score": min(score, 100), "risk_level": level}

# ── MODEL 2: Pesticide Residue Risk Classifier ───────────────────────────────
# Multi-class: PASS / WARNING / FAIL based on residue level vs. MRL
# Input: detected_level, compound, food_matrix, market (US/EU/Japan)

def classify_pesticide_result(detected_ppm: float, mrl_ppm: float) -> dict:
    ratio = detected_ppm / mrl_ppm if mrl_ppm > 0 else float("inf")
    if ratio <= 0.50:
        status, message = "PASS", "Well below MRL — no concern"
    elif ratio <= 0.80:
        status, message = "PASS", "Below MRL — acceptable"
    elif ratio <= 1.00:
        status, message = "WARNING", "Near MRL — increased monitoring recommended"
    else:
        status, message = "FAIL", f"Exceeds MRL by {round((ratio - 1) * 100, 1)}%"
    return {"status": status, "ratio_to_mrl": round(ratio, 3), "message": message}
```

### 2.4 LLM Integration — Food Safety AI Agent

```javascript
// ── Claude API — Food Safety Q&A Chatbot ─────────────────────────────────────
// Deploy via Cloudflare Worker to keep API key server-side

const FOOD_SAFETY_SYSTEM_PROMPT = `You are a Food Safety Specialist AI assistant with deep expertise in:
- US and international food safety regulations (FDA, USDA, EPA, Codex Alimentarius)
- Microbiology of foodborne pathogens (Salmonella, Listeria, E. coli, Norovirus, Campylobacter)
- Food labeling requirements (21 CFR 101, FALCPA, FASTER Act)
- HACCP principles and food safety management systems (ISO 22000, SQF)
- Cold chain management and temperature control
- Pesticide tolerances and residue management

Guidelines:
- Answer clearly and concisely in plain English.
- Always cite the regulatory standard or scientific basis for your answers.
- For suspected active foodborne illness emergencies: always recommend calling 911 or Poison Control (1-800-222-1222) FIRST.
- For recalls: direct users to foodsafety.gov or fda.gov/recalls.
- Never provide specific medical diagnoses — recommend consulting a healthcare provider.
- When uncertain, acknowledge the limitation and recommend authoritative sources.`;

async function askFoodSafetyAgent(userQuestion, conversationHistory = []) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: FOOD_SAFETY_SYSTEM_PROMPT,
      messages: [
        ...conversationHistory,
        { role: "user", content: userQuestion }
      ]
    })
  });
  const data = await response.json();
  return data.content[0].text;
}

// Example calls:
// askFoodSafetyAgent("What internal temp should I cook ground beef to?")
// → "Ground beef must reach a minimum internal temperature of 160°F (71°C)..."
// askFoodSafetyAgent("I found a can of tuna in my pantry — it's bulging. Is it safe?")
// → "Do not open or eat from that can. A bulging can is a sign of..."
```

---

## 3. APIS & EXTERNAL SERVICES

### 3.1 Open Food Facts API (Barcode Lookup — Free)

```javascript
/**
 * Look up a product by GS1 barcode using the Open Food Facts API.
 * Free, no authentication required. Coverage: 3M+ products globally.
 * Rate limit: be respectful — add delays for bulk requests.
 */
async function lookupByBarcode(barcode) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
  
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "FoodSafetyApp/1.0 (your@email.com)" }
    });
    const data = await res.json();
    
    if (data.status !== 1) return { found: false };
    
    const p = data.product;
    return {
      found: true,
      name: p.product_name || p.product_name_en,
      brand: p.brands,
      ingredients: p.ingredients_text,
      allergens: p.allergens_tags,           // ["en:milk", "en:gluten", ...]
      additives: p.additives_tags,           // ["en:e621", ...]
      nutriscore_grade: p.nutriscore_grade,  // a–e
      ecoscore_grade: p.ecoscore_grade,      // a–e
      nova_group: p.nova_group,              // 1 (whole) to 4 (ultra-processed)
      nutrition: p.nutriments,
      serving_size: p.serving_size,
      image_url: p.image_front_url,
      countries: p.countries
    };
  } catch (err) {
    console.error("Open Food Facts API error:", err);
    return { found: false, error: err.message };
  }
}
```

### 3.2 FDA openFDA API (Recall & Enforcement)

```javascript
/**
 * Query FDA food recall records.
 * Free public API — no key required for basic use.
 * Docs: https://open.fda.gov/food/enforcement/
 */
async function queryFDARecalls({ keyword, limit = 10, skip = 0 }) {
  const searchQuery = encodeURIComponent(`reason_for_recall:"${keyword}"`);
  const url = `https://api.fda.gov/food/enforcement.json?search=${searchQuery}&limit=${limit}&skip=${skip}`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  if (!data.results) return { total: 0, recalls: [] };
  
  return {
    total: data.meta?.results?.total,
    recalls: data.results.map(r => ({
      recall_number: r.recall_number,
      product_description: r.product_description,
      reason: r.reason_for_recall,
      classification: r.classification,        // Class I / II / III
      status: r.status,
      distribution_pattern: r.distribution_pattern,
      recalling_firm: r.recalling_firm,
      recall_initiation_date: r.recall_initiation_date,
      termination_date: r.termination_date
    }))
  };
}

// Example: queryFDARecalls({ keyword: "Salmonella", limit: 5 })
```

### 3.3 QR Code Generation

```javascript
// Generate QR codes for batch IDs — for testing and demo labels
// npm install qrcode

const QRCode = require("qrcode");
const path = require("path");

const TEST_BATCHES = [
  { id: "BATCH-2026-LET-0601",      label: "Lettuce — Active" },
  { id: "BATCH-2026-SHR-0522",      label: "Shrimp — Active" },
  { id: "BATCH-2026-MLK-0530",      label: "Milk — Active" },
  { id: "BATCH-2026-STR-0605-RECALL", label: "Strawberry — RECALL" },
  { id: "BATCH-2026-RIC-0601",      label: "Rice — Active" },
];

async function generateTestQRCodes(outputDir = "./qr-codes") {
  const fs = require("fs");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const batch of TEST_BATCHES) {
    const filepath = path.join(outputDir, `${batch.id}.png`);
    await QRCode.toFile(filepath, batch.id, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#000000", light: "#FFFFFF" }
    });
    console.log(`✓ Generated: ${filepath} — ${batch.label}`);
  }
}

generateTestQRCodes();
```

---

## 4. SYSTEM ARCHITECTURE

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FOOD SAFETY MOBILE APP                            │
│                    (PWA / React Native / Flutter)                    │
│                                                                      │
│   ┌─────────────────┐  ┌────────────────┐  ┌──────────────────────┐ │
│   │  QR / Barcode   │  │   Education    │  │     Dashboard        │ │
│   │  Scanner        │  │   Module       │  │     & Alerts         │ │
│   │  ─────────────  │  │  ────────────  │  │  ──────────────────  │ │
│   │  html5-qrcode   │  │  Articles      │  │  Recall alerts       │ │
│   │  expo-barcode   │  │  Quizzes       │  │  Cold chain stats    │ │
│   │  mobile_scanner │  │  Daily tips    │  │  My products         │ │
│   └────────┬────────┘  └───────┬────────┘  └──────────┬───────────┘ │
└────────────┼───────────────────┼──────────────────────┼─────────────┘
             │                   │                       │
             └─────────────────┬─┘                       │
                               ▼                         ▼
             ┌─────────────────────────────────────────────────────────┐
             │           API LAYER (Cloudflare Workers)                │
             │                                                         │
             │   POST /api/trace     GET /api/recalls                  │
             │   POST /api/ask       GET /api/nutrition/{barcode}      │
             └────────────────────┬────────────────────────────────────┘
                                  │
              ┌───────────────────┼───────────────────────┐
              ▼                   ▼                        ▼
  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────────────┐
  │  Mock Database  │  │   Claude API     │  │  External APIs        │
  │  (R&D / Dev)    │  │   (Food Safety   │  │                       │
  │  ─────────────  │  │    Q&A Agent)    │  │  - Open Food Facts    │
  │  JSON files     │  └──────────────────┘  │  - FDA openFDA        │
  └────────┬────────┘                        │  - USDA FoodData      │
           │                                 └───────────────────────┘
           │ (Production upgrade)
           ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  Production Data Layer                                      │
  │  ├── Relational DB (PostgreSQL / PlanetScale)               │
  │  ├── GS1 Product Registry                                   │
  │  ├── Blockchain/EPCIS traceability ledger                   │
  │  └── IoT cold chain sensor feed (MQTT / TimescaleDB)        │
  └─────────────────────────────────────────────────────────────┘
```

---

## 5. AI DEVELOPMENT ROADMAP

| Phase | Feature | Approach | Est. Effort |
|-------|---------|----------|-------------|
| **MVP** | QR scan → batch info display | JSON DB lookup | 3 days |
| **MVP** | Education articles + quizzes | Static JSON render | 2 days |
| **MVP** | Barcode lookup (Open Food Facts) | REST API integration | 1 day |
| **P2** | Food Safety Q&A Chatbot | Claude API + system prompt | 3 days |
| **P2** | FDA recall alerts (push notification) | FDA openFDA polling + FCM | 1 week |
| **P3** | Produce freshness detection (camera) | YOLOv8 fine-tuned on Fresh/Rotten | 2 weeks |
| **P3** | Cold chain anomaly prediction | XGBoost on historical log data | 2 weeks |
| **P4** | Semantic search over knowledge base | Sentence-transformers + Chroma | 1 week |
| **P4** | Recall NLP auto-classifier | BART zero-shot or fine-tuned | 2 weeks |
| **P4** | Real supply chain integration | GS1 EPCIS / IBM Food Trust API | 1 month |

---

## 6. REFERENCES & FURTHER READING

**Regulations**
- FDA Food Labeling: https://www.fda.gov/food/food-labeling-nutrition
- FSMA Full Text: https://www.fda.gov/food/food-safety-modernization-act-fsma
- USDA FSIS Regulations: https://www.fsis.usda.gov/policy
- Codex Alimentarius: https://www.fao.org/fao-who-codexalimentarius

**AI / ML References**
- Food-101 Dataset paper: Bossard et al. (2014) ECCV — "Food-101 – Mining Discriminative Components with Random Forests"
- PlantVillage: Hughes & Salathé (2015) "An open access repository of images on plant health" — arXiv:1511.08060
- all-MiniLM-L6-v2: Wang et al. (2020) — sentence-transformers.net
- BART: Lewis et al. (2019) "BART: Denoising Sequence-to-Sequence Pre-training" — arXiv:1910.13461

**Industry Standards**
- GFSI (Global Food Safety Initiative): https://mygfsi.com
- SQF Institute: https://www.sqfi.com
- GS1 Global Standards: https://www.gs1.org/standards/traceability
- ASC Standard: https://www.asc-aqua.org/what-we-do/our-standards/
- MSC Standard: https://www.msc.org/standards-and-certification
