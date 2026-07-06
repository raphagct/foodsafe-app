# FoodSafe — Resource Package
**Project:** FoodSafe — Mobile Application for Food Safety Education, Food Traceability, and Unsafe Food Reporting  
**Institution:** Da Nang International Institute of Technology (DNIIT), University of Da Nang  
**Supervisor:** Dr. Nguyen Thanh Tuan, VKU — nttuan@vku.udn.vn  
**Package version:** 1.0.0 · Generated: 2026-06-09

---

## Overview

This package contains all mock data, education content, AI/dataset references, and integration code needed to build the FoodSafe MVP across its 4 modules. All files are in English as required for the internship deliverable.

---

## File Index

| # | File | Module | Type | Description |
|---|------|--------|------|-------------|
| 1 | [`education_content_EN.json`](#1-education_content_enjson) | Module 1 | Mock data | Articles, quizzes, daily tips |
| 2 | [`mock_traceability_db_EN.json`](#2-mock_traceability_db_enjson) | Module 2 | Mock data | Supply chain, batches, QR lookup |
| 3 | [`mock_photo_reports.json`](#3-mock_photo_reportsjson) | Module 3 | Mock data | Sample photo report records |
| 4 | [`sqlite_schema.sql`](#4-sqlite_schemasql) | Module 4 | Schema + code | Full SQLite schema + Flutter sqflite snippet |
| 5 | [`integration_guide_EN.md`](#5-integration_guide_enmd) | M1 + M2 + M3 | Guide | QR service, quiz engine, chatbot, integration checklist |
| 6 | [`ai_datasets_models_guide_EN.md`](#6-ai_datasets_models_guide_enmd) | All | Reference | Public datasets, pretrained models, APIs, dev roadmap |

---

## Module Coverage

```
Module 1 — Education          →  File 1 + File 5 (quiz engine)
Module 2 — Traceability       →  File 2 + File 5 (QR service, scanner component)
Module 3 — Photo Report       →  File 3 + File 4 (photo_reports table)
Module 4 — Local Storage      →  File 4 (full schema: scan_history, photo_reports,
                                          education_progress, app_settings, recall_cache)
```

---

## File Descriptions

### 1. `education_content_EN.json`
**Module 1 — Education Module**

Structured content ready to render directly as Flutter widgets.

| Element | Count | Details |
|---------|-------|---------|
| Categories | 5 | Fundamentals, Storage, Foodborne Illness, Smart Shopping, Safe Handling |
| Articles | 7 | Beginner to advanced, 4–7 min reads each |
| Quizzes | 3 | 5–6 questions each; timed, with pass scores and per-question explanations |
| Daily tips | 10 | Date-rotated, one tip per day |
| Regulations ref | 7 | US: FDA, USDA, EPA, FALCPA, FASTER Act |
| Emergency contacts | 5 | 911, Poison Control, FDA hotline, USDA hotline, foodsafety.gov |

**Key content blocks supported:**
- `paragraph`, `heading`, `list`, `card_list`, `stat_box`, `alert_box`
- `symptoms_table`, `steps`, `checklist`, `allergen_list`, `certification_cards`
- `infographic_data`, `date_label_explainer`, `faq`, `tip_box`, `warning_box`

**Usage in Flutter:**
```dart
final res  = await rootBundle.loadString('assets/data/education_content_EN.json');
final data = jsonDecode(res);
final articles = data['articles'] as List;
```

---

### 2. `mock_traceability_db_EN.json`
**Module 2 — Traceability Module**

Complete mock supply chain database. The `qr_scan_lookup` table provides O(1) resolution from any scan value to a batch record.

| Element | Count | Details |
|---------|-------|---------|
| Suppliers | 5 | Farms, processing plant, dairy factory — US locations, real cert names |
| Products | 7 | Vegetables, fruit, seafood, dairy, grain — FDA-format nutrition & allergens |
| Batches | 5 | Full cold chain logs, QC test results, distribution trail |
| Distributors | 6 | Supermarket, convenience, restaurant, DC, exporter, cold warehouse |
| QR lookup entries | 17 | Batch IDs + product IDs + GS1 barcodes all resolve correctly |

**Demo scenarios built in:**

| QR Value to Scan | Scenario |
|-----------------|----------|
| `BATCH-2026-LET-0601` | Normal fresh produce — VALID |
| `BATCH-2026-SHR-0522` | Frozen seafood — VALID, allergen: shellfish |
| `BATCH-2026-MLK-0530` | Dairy — VALID, allergen: milk |
| `BATCH-2026-STR-0605-RECALL` | **🚨 Class II FDA Recall** — pesticide violation |
| `BATCH-2026-RIC-0601` | Dry goods — VALID, 2-year shelf life |
| `NOT-IN-DB-0001` | **Error state** — not found |

**Usage in Flutter:**
```dart
Future<Map<String, dynamic>> lookupBatch(String qrValue) async {
  final res = await rootBundle.loadString('assets/data/mock_traceability_db_EN.json');
  final db  = jsonDecode(res);
  final key = qrValue.replaceAll('https://trace.foodsafe.io/scan/', '').trim();
  final batchId = db['qr_scan_lookup'][key];
  if (batchId == null) return {'found': false};
  return {
    'found':    true,
    'batch':    db['batches'][batchId],
    'product':  db['products'][db['batches'][batchId]['product_id']],
    'supplier': db['suppliers'][db['products'][db['batches'][batchId]['product_id']]['supplier_id']],
  };
}
```

---

### 3. `mock_photo_reports.json`
**Module 3 — Photo Report Module**

10 realistic photo report records covering all major unsafe-food scenarios. Use for UI development, history screen prototyping, and demo purposes.

| # | Status | Category | Key Teaching Point |
|---|--------|----------|--------------------|
| RPT-001 | UNSAFE | Mold/spoilage | Bread mold before best-by date |
| RPT-002 | SUSPECTED | Label discrepancy | Fake organic seal |
| RPT-003 | UNSAFE | Temperature abuse | Gray chicken + malfunctioning cold case |
| RPT-004 | SUSPECTED | Foreign object | Plastic fragment in peanut butter |
| RPT-005 | SAFE | Routine check | Verified milk via traceability scan |
| RPT-006 | UNSAFE | Recalled item on shelf | Strawberry recall still on shelf |
| RPT-007 | SUSPECTED | Packaging damage | Seam-dented can — botulinum risk |
| RPT-008 | UNSAFE | Expired on shelf | Yogurt 8 days past USE BY |
| RPT-009 | SUSPECTED | Allergen labeling | Peanuts not declared separately (FALCPA violation) |
| RPT-010 | SUSPECTED | Missing label info | Unlabeled farmers market honey |

**Status label options:** `SUSPECTED` · `UNSAFE` · `SAFE`

**Warning signs reference** included in file — maps sign keys to severity and recommended consumer action.

**Usage in Flutter (load from SQLite, seeded from this JSON during onboarding/demo):**
```dart
Future<void> seedDemoReports(Database db) async {
  final res     = await rootBundle.loadString('assets/data/mock_photo_reports.json');
  final reports = jsonDecode(res)['reports'] as List;
  final batch   = db.batch();
  for (final r in reports) {
    batch.insert('photo_reports', {
      'created_at':       r['created_at'],
      'updated_at':       r['created_at'],
      'status':           r['status'],
      'category':         r['category'],
      'food_name':        r['food_name'],
      'brand':            r['brand'],
      'barcode_scanned':  r['barcode_scanned'],
      'image_filename':   r['image']['filename'],
      'image_local_path': r['image']['local_path'],
      'user_notes':       r['user_notes'],
      'warning_signs_json': jsonEncode(r['warning_signs_detected']),
      'reported_to_store': r['reported_to_store'] == true ? 1 : 0,
      'store_name':       r['location']?['store'],
      'lat':              r['location']?['lat'],
      'lng':              r['location']?['lng'],
      'tags_json':        jsonEncode(r['tags']),
      'is_deleted':       0,
      'is_synced':        0,
    });
  }
  await batch.commit(noResult: true);
}
```

---

### 4. `sqlite_schema.sql`
**Module 4 — Local Storage & History Module**

Complete SQLite schema for all 5 tables. Includes a ready-to-paste Flutter `DatabaseHelper` class.

| Table | Module | Purpose |
|-------|--------|---------|
| `scan_history` | M2 | All QR/barcode scans with full result snapshot |
| `photo_reports` | M3 | User photo reports with status, notes, location |
| `education_progress` | M1 | Per-article/quiz read status, quiz scores, bookmarks |
| `app_settings` | M4 | Key-value user preferences (seeded with defaults) |
| `recall_cache` | M2/M4 | Locally cached FDA recall records for offline access |

**Dependencies:**
```yaml
# pubspec.yaml
dependencies:
  sqflite: ^2.3.0
  path: ^1.9.0
```

**Schema version:** 1 (migration framework included for future upgrades via `onUpgrade`)

---

### 5. `integration_guide_EN.md`
**Modules 1, 2, 3 — Integration Code**

End-to-end integration code from scanner to display. Contains:

- **Project folder structure** — recommended Flutter layout
- **`traceabilityService.js`** — full QR lookup logic with cold chain analysis, expiry calculation, distributor trail enrichment
- **`QRScanner.jsx`** + **`BatchDetail.jsx`** — complete React/PWA components (adaptable to Flutter)
- **`educationService.js`** — category listing, article fetch, quiz grading (`gradeQuiz()`)
- **`recallService.js`** — FDA openFDA API wrapper with severity classifier
- **Cloudflare Worker** — Claude API food safety chatbot with food-safety-specific system prompt
- **16-item integration checklist** — from file placement to error handling

---

### 6. `ai_datasets_models_guide_EN.md`
**All Modules — AI & Data Reference**

Research and development reference for AI features beyond the MVP.

**Datasets covered (20+):**
- FDA Food Enforcement, EU RASFF, USDA FoodData Central
- Open Food Facts (free API, 3M+ products)
- Food-101, PlantVillage, Fresh vs. Rotten (computer vision)
- USDA Organic Integrity, NOAA Fish Watch, EPA Pesticide Tolerances

**Models covered:**
- Food classification: EfficientNetV2 / `nateraw/food` (HuggingFace)
- Plant disease: MobileNetV2 / PlantVillage (HuggingFace)
- Freshness detection: YOLOv8 fine-tune recipe
- NER for recall text: `dslim/bert-base-NER`
- Zero-shot classification: `facebook/bart-large-mnli`
- Semantic search: `all-MiniLM-L6-v2` + ChromaDB (RAG foundation)

**AI development roadmap:** 8 phases from MVP (QR scan, barcode lookup) to P4 (NER from incident reports, real supply chain integration)

---

## Implementation Plan Alignment

| Phase (from proposal) | Description | Resources Used |
|----------------------|-------------|----------------|
| P1 | Setup, wireframe | — |
| P2 | Education screen | `education_content_EN.json` → `educationService` |
| P3 | QR scanner + traceability | `mock_traceability_db_EN.json` → `traceabilityService` · `QRScanner` |
| P4 | Photo capture + labeling | `mock_photo_reports.json` → `photo_reports` table |
| P5 | Local storage + history | `sqlite_schema.sql` → `DatabaseHelper` |
| P6 | Testing + demo | All 6 test QR scenarios · 10 photo report records |

---

## Technical Stack (from proposal)

| Component | Technology | Resource notes |
|-----------|------------|----------------|
| Mobile app | Flutter + Dart | Dart snippets in Files 2, 3, 4 |
| UI design | Figma | Wireframe from proposal |
| QR scanning | `mobile_scanner` or `qr_code_scanner` | Integration in File 5 |
| Local storage | SQLite via `sqflite` | File 4 — full schema + `DatabaseHelper` |
| Photo capture | `image_picker` + `camera` | Mock data in File 3 |
| Version control | GitHub | — |

---

## Quick Start

```bash
# 1. Copy data files to Flutter assets
cp education_content_EN.json     your_app/assets/data/
cp mock_traceability_db_EN.json  your_app/assets/data/
cp mock_photo_reports.json       your_app/assets/data/

# 2. Declare assets in pubspec.yaml
#    flutter:
#      assets:
#        - assets/data/

# 3. Run sqlite_schema.sql via DatabaseHelper.onCreate()
#    (paste the Dart class from the SQL file into lib/database/database_helper.dart)

# 4. Generate test QR codes (requires Node.js + qrcode package)
#    npm install -g qrcode
#    qr BATCH-2026-LET-0601          > qr_lettuce.png
#    qr BATCH-2026-STR-0605-RECALL   > qr_recall.png
```

---

## References

- WHO Five Keys to Safer Food: https://www.who.int/publications/i/item/9789241594547
- FDA FSMA Traceability Rule: https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods
- Open Food Facts API: https://wiki.openfoodfacts.org/API
- FDA openFDA Food Enforcement: https://open.fda.gov/food/enforcement/
- USDA FoodData Central: https://fdc.nal.usda.gov/
- sqflite Flutter package: https://pub.dev/packages/sqflite
- mobile_scanner Flutter package: https://pub.dev/packages/mobile_scanner
- image_picker Flutter package: https://pub.dev/packages/image_picker

---

*This resource package was prepared to support the FoodSafe internship project at DNIIT, University of Da Nang. All data is fictional and generated for R&D and demonstration purposes only.*
