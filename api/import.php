<?php
/**
 * Importer: JSON → MySQL
 *
 * mode=append  — ONLY papers.append.json[.gz] (never falls back to full papers.json)
 * mode=replace — parts / full dump
 *
 * Search dirs (in order):
 *   public_html/data/private/
 *   public_html/deploy/db-update-append/   (append)
 *   public_html/deploy/db-update-full/     (replace)
 */
declare(strict_types=1);

require __DIR__ . '/lib/bootstrap.php';

$isCli = PHP_SAPI === 'cli';
if (!$isCli) {
    apply_cors();
    $token = trim((string) ($_GET['token'] ?? ''), " \t\n\r\0\x0B\"'");
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $admin = trim((string) (app_config()['admin_token'] ?? ''), " \t\n\r\0\x0B\"'");
    $ok = $admin !== '' && ($token === $admin || $hdr === 'Bearer ' . $admin);
    if (!$ok) {
        json_out([
            'error' => 'unauthorized',
            'hint' => 'token mismatch — check admin_token / config.cpanel.php',
            'got_token_len' => strlen($token),
        ], 401);
    }
}

$mode = strtolower(trim((string) ($_GET['mode'] ?? ($isCli ? (getenv('NEURON_IMPORT_MODE') ?: 'append') : 'append'))));
if ($mode !== 'replace' && $mode !== 'append') {
    $mode = 'append';
}

$root = dirname(__DIR__);
$pdo = null;

/**
 * @return list<mixed>|null
 */
function load_json_array(string $path): ?array
{
    if (!is_file($path)) {
        return null;
    }
    $raw = file_get_contents($path);
    if ($raw === false) {
        return null;
    }
    if (str_ends_with(strtolower($path), '.gz')) {
        $decoded = gzdecode($raw);
        if ($decoded === false) {
            return null;
        }
        $raw = $decoded;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : null;
}

/**
 * @param list<string> $dirs
 * @return array{papers: list<array<string,mixed>>, source: string}
 */
function load_papers_append(array $dirs): array
{
    $tried = [];
    foreach ($dirs as $dir) {
        foreach (['/papers.append.json.gz', '/papers.append.json'] as $name) {
            $path = $dir . $name;
            $tried[] = $path;
            $arr = load_json_array($path);
            if (is_array($arr)) {
                return ['papers' => $arr, 'source' => $path];
            }
        }
    }
    throw new RuntimeException(
        'mode=append needs papers.append.json.gz. Put it in public_html/data/private/ OR leave deploy/db-update-append/ uploaded. Tried: '
        . implode(' | ', $tried)
    );
}

/**
 * @param list<string> $dirs
 * @return array{papers: list<array<string,mixed>>, source: string}
 */
function load_papers_replace(array $dirs): array
{
    foreach ($dirs as $dir) {
        $parts = glob($dir . '/papers.part*.json.gz') ?: [];
        $partsPlain = glob($dir . '/papers.part*.json') ?: [];
        $parts = array_values(array_unique(array_merge($parts, $partsPlain)));
        natcasesort($parts);
        $parts = array_values($parts);
        if ($parts) {
            $all = [];
            $used = [];
            foreach ($parts as $part) {
                if (!str_ends_with(strtolower($part), '.gz') && is_file($part . '.gz')) {
                    continue;
                }
                $arr = load_json_array($part);
                if (!is_array($arr)) {
                    throw new RuntimeException('bad part: ' . $part);
                }
                foreach ($arr as $row) {
                    $all[] = $row;
                }
                $used[] = basename($part);
            }
            return ['papers' => $all, 'source' => $dir . ' [' . implode(',', $used) . ']'];
        }

        foreach (['/papers.json.gz', '/papers.json'] as $name) {
            $path = $dir . $name;
            $arr = load_json_array($path);
            if (is_array($arr)) {
                return ['papers' => $arr, 'source' => $path];
            }
        }
    }

    throw new RuntimeException(
        'mode=replace needs papers.part*.json.gz or papers.json under data/private/ or deploy/db-update-full/'
    );
}

/**
 * @param list<string> $dirs
 * @return array{venues: list<array<string,mixed>>, source: string}
 */
function load_venues_replace(array $dirs): array
{
    foreach ($dirs as $dir) {
        foreach (['/venues.json.gz', '/venues.json'] as $name) {
            $path = $dir . $name;
            $arr = load_json_array($path);
            if (is_array($arr)) {
                return ['venues' => $arr, 'source' => $path];
            }
        }
    }
    throw new RuntimeException('Missing venues.json[.gz] (required for mode=replace)');
}

function insert_paper(PDOStatement $insPaper, PDOStatement $insKw, PDOStatement $insCat, array $p): bool
{
    if (empty($p['id'])) {
        return false;
    }
    $authors = $p['authors'] ?? [];
    $tags = $p['tags'] ?? [];
    $keywords = $p['keywords'] ?? $tags;
    $categories = $p['categories'] ?? [];
    $algo = $p['algorithm'] ?? ['fa' => '', 'en' => '', 'ar' => '', 'ku' => ''];
    $search = implode(' ', [
        $p['title'] ?? '',
        $p['venue'] ?? '',
        $p['journal'] ?? '',
        $p['abstract'] ?? '',
        is_array($authors) ? implode(' ', $authors) : '',
        is_array($keywords) ? implode(' ', $keywords) : '',
        is_array($categories) ? implode(' ', $categories) : '',
        $p['track'] ?? '',
    ]);

    $insPaper->execute([
        'id' => (string) $p['id'],
        'title' => (string) ($p['title'] ?? ''),
        'year' => isset($p['year']) ? (int) $p['year'] : null,
        'venue' => (string) ($p['venue'] ?? ''),
        'url' => (string) ($p['url'] ?? ''),
        'pdf_url' => (string) ($p['pdfUrl'] ?? ''),
        'html_url' => (string) ($p['htmlUrl'] ?? ''),
        'journal_url' => (string) ($p['journalUrl'] ?? ''),
        'doi' => (string) ($p['doi'] ?? ''),
        'journal' => (string) ($p['journal'] ?? ''),
        'authors_json' => json_encode($authors, JSON_UNESCAPED_UNICODE),
        'abstract' => (string) ($p['abstract'] ?? ''),
        'algorithm_json' => json_encode($algo, JSON_UNESCAPED_UNICODE),
        'tags_json' => json_encode($tags, JSON_UNESCAPED_UNICODE),
        'keywords_json' => json_encode($keywords, JSON_UNESCAPED_UNICODE),
        'categories_json' => json_encode($categories, JSON_UNESCAPED_UNICODE),
        'track' => (string) ($p['track'] ?? 'ml-general'),
        'tier' => (string) ($p['tier'] ?? 'recent'),
        'source' => (string) ($p['source'] ?? ''),
        'search_blob' => $search,
    ]);

    $id = (string) $p['id'];
    foreach ((array) $keywords as $kw) {
        $kw = trim((string) $kw);
        if ($kw !== '') {
            $insKw->execute([$id, mb_substr($kw, 0, 128)]);
        }
    }
    foreach ((array) $categories as $cat) {
        $cat = trim((string) $cat);
        if ($cat !== '') {
            $insCat->execute([$id, mb_substr($cat, 0, 128)]);
        }
    }
    return true;
}

try {
    $dirsAppend = array_values(array_filter([
        $root . '/data/private',
        $root . '/deploy/db-update-append',
    ], 'is_dir'));
    $dirsReplace = array_values(array_filter([
        $root . '/data/private',
        $root . '/deploy/db-update-full',
    ], 'is_dir'));

    if ($mode === 'append') {
        if (!$dirsAppend) {
            throw new RuntimeException(
                'No append folder found. Upload deploy/db-update-append/ under public_html/deploy/ OR put papers.append.json.gz in public_html/data/private/'
            );
        }
        $loaded = load_papers_append($dirsAppend);
        $papers = $loaded['papers'];
        $papersSource = $loaded['source'];
        $venues = [];
        $venuesSource = '';
    } else {
        if (!$dirsReplace) {
            throw new RuntimeException('No replace data folder found (data/private or deploy/db-update-full)');
        }
        $loaded = load_papers_replace($dirsReplace);
        $papers = $loaded['papers'];
        $papersSource = $loaded['source'];
        $vloaded = load_venues_replace($dirsReplace);
        $venues = $vloaded['venues'];
        $venuesSource = $vloaded['source'];
    }

    $pdo = db();
    $beforeCount = (int) $pdo->query('SELECT COUNT(*) FROM papers')->fetchColumn();
    $pdo->beginTransaction();

    if ($mode === 'replace') {
        $pdo->exec('SET FOREIGN_KEY_CHECKS=0');
        $pdo->exec('TRUNCATE TABLE paper_keywords');
        $pdo->exec('TRUNCATE TABLE paper_categories');
        $pdo->exec('TRUNCATE TABLE papers');
        $pdo->exec('TRUNCATE TABLE venues');
        $pdo->exec('SET FOREIGN_KEY_CHECKS=1');
        $paperSql = 'INSERT INTO papers (
            id, title, year, venue, url, pdf_url, html_url, journal_url, doi, journal,
            authors_json, abstract, algorithm_json, tags_json, keywords_json, categories_json,
            track, tier, source, search_blob
        ) VALUES (
            :id, :title, :year, :venue, :url, :pdf_url, :html_url, :journal_url, :doi, :journal,
            :authors_json, :abstract, :algorithm_json, :tags_json, :keywords_json, :categories_json,
            :track, :tier, :source, :search_blob
        )';
    } else {
        $paperSql = 'INSERT INTO papers (
            id, title, year, venue, url, pdf_url, html_url, journal_url, doi, journal,
            authors_json, abstract, algorithm_json, tags_json, keywords_json, categories_json,
            track, tier, source, search_blob
        ) VALUES (
            :id, :title, :year, :venue, :url, :pdf_url, :html_url, :journal_url, :doi, :journal,
            :authors_json, :abstract, :algorithm_json, :tags_json, :keywords_json, :categories_json,
            :track, :tier, :source, :search_blob
        ) ON DUPLICATE KEY UPDATE
            title=VALUES(title), year=VALUES(year), venue=VALUES(venue), url=VALUES(url),
            pdf_url=VALUES(pdf_url), html_url=VALUES(html_url), journal_url=VALUES(journal_url),
            doi=VALUES(doi), journal=VALUES(journal), authors_json=VALUES(authors_json),
            abstract=VALUES(abstract), algorithm_json=VALUES(algorithm_json), tags_json=VALUES(tags_json),
            keywords_json=VALUES(keywords_json), categories_json=VALUES(categories_json),
            track=VALUES(track), tier=VALUES(tier), source=VALUES(source), search_blob=VALUES(search_blob)';
    }

    $insPaper = $pdo->prepare($paperSql);
    $insKw = $pdo->prepare('INSERT IGNORE INTO paper_keywords (paper_id, keyword) VALUES (?, ?)');
    $insCat = $pdo->prepare('INSERT IGNORE INTO paper_categories (paper_id, category) VALUES (?, ?)');
    $delKw = $mode === 'append' ? $pdo->prepare('DELETE FROM paper_keywords WHERE paper_id = ?') : null;
    $delCat = $mode === 'append' ? $pdo->prepare('DELETE FROM paper_categories WHERE paper_id = ?') : null;
    $existsStmt = $mode === 'append' ? $pdo->prepare('SELECT 1 FROM papers WHERE id = ? LIMIT 1') : null;

    $n = 0;
    $newCount = 0;
    $updatedCount = 0;
    foreach ($papers as $p) {
        if (!is_array($p)) {
            continue;
        }
        $id = (string) ($p['id'] ?? '');
        $wasNew = true;
        if ($mode === 'append' && $id !== '' && $existsStmt) {
            $existsStmt->execute([$id]);
            $wasNew = $existsStmt->fetchColumn() === false;
        }
        if ($mode === 'append' && $id !== '' && $delKw && $delCat) {
            $delKw->execute([$id]);
            $delCat->execute([$id]);
        }
        if (insert_paper($insPaper, $insKw, $insCat, $p)) {
            $n++;
            if ($mode === 'append') {
                if ($wasNew) {
                    $newCount++;
                } else {
                    $updatedCount++;
                }
            }
        }
        if ($isCli && $n % 500 === 0) {
            echo "papers $n\n";
        }
    }

    $vn = 0;
    if ($mode === 'replace') {
        $insVenue = $pdo->prepare(
            'INSERT INTO venues (
                id, kind, name, abbr, publisher, impact_factor, h5_index, metric_kind, metric_label, metric_year,
                citation_note, rigor, acceptance_hint, domains_json, keywords_json, specialty, url, issn, notes
            ) VALUES (
                :id, :kind, :name, :abbr, :publisher, :impact_factor, :h5_index, :metric_kind, :metric_label, :metric_year,
                :citation_note, :rigor, :acceptance_hint, :domains_json, :keywords_json, :specialty, :url, :issn, :notes
            )'
        );
        foreach ($venues as $v) {
            if (!is_array($v) || empty($v['id'])) {
                continue;
            }
            $insVenue->execute([
                'id' => (string) $v['id'],
                'kind' => ($v['kind'] ?? 'journal') === 'conference' ? 'conference' : 'journal',
                'name' => (string) ($v['name'] ?? ''),
                'abbr' => (string) ($v['abbr'] ?? ''),
                'publisher' => (string) ($v['publisher'] ?? ''),
                'impact_factor' => (float) ($v['impactFactor'] ?? 0),
                'h5_index' => isset($v['h5Index']) ? (int) $v['h5Index'] : null,
                'metric_kind' => (string) ($v['metricKind'] ?? ''),
                'metric_label' => (string) ($v['metricLabel'] ?? ''),
                'metric_year' => isset($v['metricYear']) ? (int) $v['metricYear'] : null,
                'citation_note' => (string) ($v['citationNote'] ?? ''),
                'rigor' => (int) ($v['rigor'] ?? 3),
                'acceptance_hint' => (string) ($v['acceptanceHint'] ?? ''),
                'domains_json' => json_encode($v['domains'] ?? [], JSON_UNESCAPED_UNICODE),
                'keywords_json' => json_encode($v['keywords'] ?? [], JSON_UNESCAPED_UNICODE),
                'specialty' => (string) ($v['specialty'] ?? ''),
                'url' => (string) ($v['url'] ?? ''),
                'issn' => (string) ($v['issn'] ?? ''),
                'notes' => (string) ($v['notes'] ?? ''),
            ]);
            $vn++;
        }
    }

    $pdo->commit();
    $totalPapers = (int) $pdo->query('SELECT COUNT(*) FROM papers')->fetchColumn();
    $result = [
        'ok' => true,
        'mode' => $mode,
        'papersSource' => $papersSource,
        'venuesSource' => $venuesSource,
        'rowsInFile' => count($papers),
        'importedPapers' => $n,
        'newPapers' => $mode === 'append' ? $newCount : $n,
        'updatedPapers' => $mode === 'append' ? $updatedCount : 0,
        'importedVenues' => $vn,
        'paperCountBefore' => $beforeCount,
        'paperCountInDb' => $totalPapers,
    ];
    if ($isCli) {
        echo json_encode($result, JSON_UNESCAPED_UNICODE) . PHP_EOL;
        exit(0);
    }
    json_out($result);
} catch (Throwable $e) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($isCli) {
        fwrite(STDERR, $e->getMessage() . PHP_EOL);
        exit(1);
    }
    json_out(['error' => 'import_failed', 'detail' => $e->getMessage()], 500);
}
