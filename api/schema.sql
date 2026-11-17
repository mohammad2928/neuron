-- Neuron Learning — MySQL schema (cPanel / MariaDB)
-- Charset: utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS papers (
  id VARCHAR(191) NOT NULL,
  title TEXT NOT NULL,
  year SMALLINT UNSIGNED NULL,
  venue VARCHAR(255) NULL,
  url TEXT NULL,
  pdf_url TEXT NULL,
  html_url TEXT NULL,
  journal_url TEXT NULL,
  doi VARCHAR(255) NULL,
  journal TEXT NULL,
  authors_json JSON NOT NULL,
  abstract MEDIUMTEXT NULL,
  algorithm_json JSON NULL,
  tags_json JSON NULL,
  keywords_json JSON NULL,
  categories_json JSON NULL,
  track VARCHAR(64) NOT NULL DEFAULT 'ml-general',
  tier VARCHAR(32) NOT NULL DEFAULT 'recent',
  source VARCHAR(64) NULL,
  search_blob MEDIUMTEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_papers_track (track),
  KEY idx_papers_tier (tier),
  KEY idx_papers_year (year),
  FULLTEXT KEY ft_papers_search (search_blob)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS paper_keywords (
  paper_id VARCHAR(191) NOT NULL,
  keyword VARCHAR(128) NOT NULL,
  PRIMARY KEY (paper_id, keyword),
  KEY idx_pk_keyword (keyword),
  CONSTRAINT fk_pk_paper FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS paper_categories (
  paper_id VARCHAR(191) NOT NULL,
  category VARCHAR(128) NOT NULL,
  PRIMARY KEY (paper_id, category),
  KEY idx_pc_category (category),
  CONSTRAINT fk_pc_paper FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS venues (
  id VARCHAR(191) NOT NULL,
  kind ENUM('journal','conference') NOT NULL,
  name VARCHAR(255) NOT NULL,
  abbr VARCHAR(64) NOT NULL,
  publisher VARCHAR(255) NULL,
  impact_factor DOUBLE NOT NULL DEFAULT 0,
  h5_index INT NULL,
  metric_kind VARCHAR(32) NULL,
  metric_label VARCHAR(128) NULL,
  metric_year SMALLINT NULL,
  citation_note TEXT NULL,
  rigor TINYINT UNSIGNED NOT NULL DEFAULT 3,
  acceptance_hint VARCHAR(128) NULL,
  domains_json JSON NULL,
  keywords_json JSON NULL,
  specialty TEXT NULL,
  url TEXT NULL,
  issn VARCHAR(64) NULL,
  notes TEXT NULL,
  PRIMARY KEY (id),
  KEY idx_venues_kind (kind),
  KEY idx_venues_abbr (abbr),
  KEY idx_venues_rigor (rigor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
