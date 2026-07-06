-- =============================================================================
-- FoodSafe App — SQLite Database Schema
-- Framework: Flutter + sqflite package
-- Covers: All 4 modules per the FoodSafe internship proposal
-- =============================================================================
-- Usage with sqflite:
--   await db.execute(CREATE_SCAN_HISTORY);
--   await db.execute(CREATE_PHOTO_REPORTS);
--   ... etc.
-- =============================================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;


-- =============================================================================
-- MODULE 2: Traceability — QR / Barcode Scan History
-- =============================================================================
CREATE TABLE IF NOT EXISTS scan_history (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    scanned_at      TEXT    NOT NULL,               -- ISO 8601 e.g. "2026-06-01T08:34:12+07:00"
    raw_value       TEXT    NOT NULL,               -- raw QR / barcode string
    lookup_key      TEXT,                           -- resolved key after URL-strip
    batch_id        TEXT,                           -- e.g. BATCH-2026-LET-0601 (nullable if not found)
    product_id      TEXT,                           -- e.g. VEG-LET-001
    product_name    TEXT,
    supplier_name   TEXT,
    expiry_date     TEXT,                           -- ISO date string
    expiry_status   TEXT CHECK(expiry_status IN    -- derived from lookup
                        ('VALID','EXPIRING_SOON','EXPIRED','RECALL','UNKNOWN')),
    is_recall       INTEGER NOT NULL DEFAULT 0,     -- 0 = false, 1 = true  (SQLite has no BOOL)
    recall_class    TEXT,                           -- "Class I" / "Class II" / "Class III"
    recall_reason   TEXT,
    cold_chain_status TEXT CHECK(cold_chain_status IN ('PASS','WARNING','FAIL')),
    allergens_json  TEXT,                           -- JSON array e.g. '["milk","gluten"]'
    full_response_json TEXT,                        -- full lookup result blob (for history detail view)
    store_location  TEXT,                           -- optional user-entered store name
    lat             REAL,
    lng             REAL,
    is_starred      INTEGER NOT NULL DEFAULT 0      -- user can star important scans
);

CREATE INDEX IF NOT EXISTS idx_scan_scanned_at  ON scan_history(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_product_id  ON scan_history(product_id);
CREATE INDEX IF NOT EXISTS idx_scan_is_recall   ON scan_history(is_recall);


-- =============================================================================
-- MODULE 3: Photo Report — Suspicious Food Photo Records
-- =============================================================================
CREATE TABLE IF NOT EXISTS photo_reports (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at      TEXT    NOT NULL,               -- ISO 8601
    updated_at      TEXT    NOT NULL,

    -- Status & classification
    status          TEXT    NOT NULL CHECK(status IN ('SUSPECTED','UNSAFE','SAFE')),
    category        TEXT,                           -- e.g. "mold_spoilage", "expired_on_shelf"

    -- Product info (optionally auto-filled from scan)
    food_name       TEXT,
    brand           TEXT,
    barcode_scanned TEXT,
    linked_batch_id TEXT,                           -- FK-like reference into scan_history
    linked_scan_id  INTEGER REFERENCES scan_history(id) ON DELETE SET NULL,

    -- Photo file
    image_filename  TEXT    NOT NULL,               -- e.g. "rpt_001.jpg"
    image_local_path TEXT   NOT NULL,               -- absolute path in app storage
    image_width_px  INTEGER,
    image_height_px INTEGER,
    image_size_kb   INTEGER,

    -- Location
    store_name      TEXT,
    store_aisle     TEXT,
    lat             REAL,
    lng             REAL,

    -- User input
    user_notes      TEXT,
    warning_signs_json TEXT,                        -- JSON array of warning sign keys
    reported_to_store  INTEGER NOT NULL DEFAULT 0,
    store_response  TEXT,
    fda_report_submitted INTEGER NOT NULL DEFAULT 0,
    fda_report_number TEXT,

    -- Metadata
    tags_json       TEXT,                           -- JSON array of tag strings
    is_synced       INTEGER NOT NULL DEFAULT 0,     -- for future cloud sync
    is_deleted      INTEGER NOT NULL DEFAULT 0      -- soft delete
);

CREATE INDEX IF NOT EXISTS idx_report_created_at ON photo_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_status     ON photo_reports(status);
CREATE INDEX IF NOT EXISTS idx_report_barcode    ON photo_reports(barcode_scanned);
CREATE INDEX IF NOT EXISTS idx_report_deleted    ON photo_reports(is_deleted);


-- =============================================================================
-- MODULE 1: Education — User Progress Tracking
-- =============================================================================
CREATE TABLE IF NOT EXISTS education_progress (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id      TEXT    NOT NULL,               -- article ID or quiz ID from JSON
    content_type    TEXT    NOT NULL CHECK(content_type IN ('article','quiz','tip')),
    first_viewed_at TEXT,                           -- ISO 8601
    last_viewed_at  TEXT,
    view_count      INTEGER NOT NULL DEFAULT 0,
    is_completed    INTEGER NOT NULL DEFAULT 0,
    is_bookmarked   INTEGER NOT NULL DEFAULT 0,

    -- Quiz-specific
    last_quiz_score  INTEGER,                       -- 0–100
    last_quiz_passed INTEGER,                       -- 0 or 1
    best_quiz_score  INTEGER,
    quiz_attempts    INTEGER NOT NULL DEFAULT 0,

    UNIQUE(content_id, content_type)
);

CREATE INDEX IF NOT EXISTS idx_edu_content_type ON education_progress(content_type);
CREATE INDEX IF NOT EXISTS idx_edu_bookmarked   ON education_progress(is_bookmarked);


-- =============================================================================
-- MODULE 4: Local Storage — App Settings & User Preferences
-- =============================================================================
CREATE TABLE IF NOT EXISTS app_settings (
    key             TEXT    PRIMARY KEY,
    value           TEXT    NOT NULL,
    updated_at      TEXT    NOT NULL
);

-- Seed default settings
INSERT OR IGNORE INTO app_settings (key, value, updated_at) VALUES
    ('notifications_enabled',   'true',  '2026-01-01T00:00:00Z'),
    ('recall_alerts_enabled',   'true',  '2026-01-01T00:00:00Z'),
    ('language',                'en',    '2026-01-01T00:00:00Z'),
    ('temperature_unit',        'F',     '2026-01-01T00:00:00Z'),
    ('auto_save_scans',         'true',  '2026-01-01T00:00:00Z'),
    ('daily_tip_shown_date',    '',      '2026-01-01T00:00:00Z'),
    ('onboarding_complete',     'false', '2026-01-01T00:00:00Z'),
    ('last_recall_sync',        '',      '2026-01-01T00:00:00Z'),
    ('db_schema_version',       '1',     '2026-01-01T00:00:00Z');


-- =============================================================================
-- MODULE 4: Recall Alerts — Locally Cached FDA Recall Records
-- =============================================================================
CREATE TABLE IF NOT EXISTS recall_cache (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    recall_number   TEXT    UNIQUE NOT NULL,        -- e.g. "FDA-2026-R-0247"
    product_description TEXT,
    reason          TEXT,
    classification  TEXT,                           -- "Class I" / "Class II" / "Class III"
    severity        TEXT CHECK(severity IN ('HIGH','MEDIUM','LOW','UNKNOWN')),
    status          TEXT,                           -- "Ongoing" / "Terminated"
    recalling_firm  TEXT,
    distribution_states_json TEXT,                  -- JSON array of US state codes
    recall_date     TEXT,
    termination_date TEXT,
    fetched_at      TEXT    NOT NULL,               -- when this record was cached locally
    is_dismissed    INTEGER NOT NULL DEFAULT 0      -- user dismissed the alert
);

CREATE INDEX IF NOT EXISTS idx_recall_date      ON recall_cache(recall_date DESC);
CREATE INDEX IF NOT EXISTS idx_recall_class     ON recall_cache(classification);
CREATE INDEX IF NOT EXISTS idx_recall_dismissed ON recall_cache(is_dismissed);


-- =============================================================================
-- FLUTTER / sqflite INTEGRATION SNIPPET
-- Copy into your DatabaseHelper class
-- =============================================================================
/*
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class DatabaseHelper {
  static const int _dbVersion = 1;
  static const String _dbName  = 'foodsafe.db';
  static Database? _database;

  static Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  static Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path   = join(dbPath, _dbName);

    return await openDatabase(
      path,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
      onConfigure: (db) async => await db.execute('PRAGMA foreign_keys = ON'),
    );
  }

  static Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS scan_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scanned_at TEXT NOT NULL,
        raw_value TEXT NOT NULL,
        lookup_key TEXT,
        batch_id TEXT,
        product_id TEXT,
        product_name TEXT,
        supplier_name TEXT,
        expiry_date TEXT,
        expiry_status TEXT,
        is_recall INTEGER NOT NULL DEFAULT 0,
        recall_class TEXT,
        recall_reason TEXT,
        cold_chain_status TEXT,
        allergens_json TEXT,
        full_response_json TEXT,
        store_location TEXT,
        lat REAL,
        lng REAL,
        is_starred INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS photo_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        status TEXT NOT NULL,
        category TEXT,
        food_name TEXT,
        brand TEXT,
        barcode_scanned TEXT,
        linked_batch_id TEXT,
        linked_scan_id INTEGER,
        image_filename TEXT NOT NULL,
        image_local_path TEXT NOT NULL,
        image_width_px INTEGER,
        image_height_px INTEGER,
        image_size_kb INTEGER,
        store_name TEXT,
        store_aisle TEXT,
        lat REAL,
        lng REAL,
        user_notes TEXT,
        warning_signs_json TEXT,
        reported_to_store INTEGER NOT NULL DEFAULT 0,
        store_response TEXT,
        fda_report_submitted INTEGER NOT NULL DEFAULT 0,
        fda_report_number TEXT,
        tags_json TEXT,
        is_synced INTEGER NOT NULL DEFAULT 0,
        is_deleted INTEGER NOT NULL DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS education_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content_id TEXT NOT NULL,
        content_type TEXT NOT NULL,
        first_viewed_at TEXT,
        last_viewed_at TEXT,
        view_count INTEGER NOT NULL DEFAULT 0,
        is_completed INTEGER NOT NULL DEFAULT 0,
        is_bookmarked INTEGER NOT NULL DEFAULT 0,
        last_quiz_score INTEGER,
        last_quiz_passed INTEGER,
        best_quiz_score INTEGER,
        quiz_attempts INTEGER NOT NULL DEFAULT 0,
        UNIQUE(content_id, content_type)
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS recall_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recall_number TEXT UNIQUE NOT NULL,
        product_description TEXT,
        reason TEXT,
        classification TEXT,
        severity TEXT,
        status TEXT,
        recalling_firm TEXT,
        distribution_states_json TEXT,
        recall_date TEXT,
        termination_date TEXT,
        fetched_at TEXT NOT NULL,
        is_dismissed INTEGER NOT NULL DEFAULT 0
      )
    ''');

    // Seed default settings
    final now = DateTime.now().toIso8601String();
    final defaults = {
      'notifications_enabled': 'true',
      'recall_alerts_enabled': 'true',
      'language': 'en',
      'temperature_unit': 'F',
      'auto_save_scans': 'true',
      'daily_tip_shown_date': '',
      'onboarding_complete': 'false',
      'last_recall_sync': '',
      'db_schema_version': '1',
    };
    for (final entry in defaults.entries) {
      await db.insert('app_settings', {
        'key': entry.key,
        'value': entry.value,
        'updated_at': now,
      }, conflictAlgorithm: ConflictAlgorithm.ignore);
    }
  }

  static Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Add migration steps here for future schema versions
    // if (oldVersion < 2) { await db.execute('ALTER TABLE ...'); }
  }

  // ── CRUD helpers ──────────────────────────────────────────────────────────

  static Future<int> insertScan(Map<String, dynamic> scan) async {
    final db = await database;
    return await db.insert('scan_history', scan);
  }

  static Future<List<Map<String, dynamic>>> getRecentScans({int limit = 50}) async {
    final db = await database;
    return await db.query('scan_history',
        orderBy: 'scanned_at DESC', limit: limit);
  }

  static Future<int> insertPhotoReport(Map<String, dynamic> report) async {
    final db = await database;
    return await db.insert('photo_reports', report);
  }

  static Future<List<Map<String, dynamic>>> getPhotoReports({
    String? statusFilter,
    int limit = 50,
  }) async {
    final db = await database;
    return await db.query(
      'photo_reports',
      where: statusFilter != null
          ? 'status = ? AND is_deleted = 0'
          : 'is_deleted = 0',
      whereArgs: statusFilter != null ? [statusFilter] : null,
      orderBy: 'created_at DESC',
      limit: limit,
    );
  }

  static Future<void> upsertEducationProgress(
      String contentId, String contentType, Map<String, dynamic> fields) async {
    final db = await database;
    await db.insert(
      'education_progress',
      {'content_id': contentId, 'content_type': contentType, ...fields},
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  static Future<String?> getSetting(String key) async {
    final db = await database;
    final rows = await db.query('app_settings',
        columns: ['value'], where: 'key = ?', whereArgs: [key], limit: 1);
    return rows.isNotEmpty ? rows.first['value'] as String? : null;
  }

  static Future<void> setSetting(String key, String value) async {
    final db = await database;
    await db.insert(
      'app_settings',
      {'key': key, 'value': value, 'updated_at': DateTime.now().toIso8601String()},
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }
}
*/
