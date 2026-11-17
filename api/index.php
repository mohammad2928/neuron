<?php
declare(strict_types=1);

require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/papers.php';

apply_cors();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_read_auth();

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?: '/';
// Support both /api/... and /index.php/api/... and cPanel /api/index.php/...
$path = preg_replace('#^/api/index\\.php#', '', $path) ?: $path;
$path = preg_replace('#^/index\\.php#', '', $path) ?: $path;
if (str_starts_with($path, '/api')) {
    $path = substr($path, 4) ?: '/';
}
$path = rtrim($path, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = db();

    if ($path === '/health' && $method === 'GET') {
        json_out(['ok' => true, 'service' => 'neuron-php-api']);
    }

    if ($path === '/meta' && $method === 'GET') {
        $paperCount = (int) $pdo->query('SELECT COUNT(*) FROM papers')->fetchColumn();
        $venueCount = (int) $pdo->query('SELECT COUNT(*) FROM venues')->fetchColumn();
        $journalCount = (int) $pdo->query("SELECT COUNT(*) FROM venues WHERE kind='journal'")->fetchColumn();
        $conferenceCount = (int) $pdo->query("SELECT COUNT(*) FROM venues WHERE kind='conference'")->fetchColumn();

        $tracks = $pdo->query('SELECT track AS `key`, COUNT(*) AS `count` FROM papers GROUP BY track ORDER BY `count` DESC')->fetchAll();
        $keywords = $pdo->query('SELECT keyword AS `key`, COUNT(*) AS `count` FROM paper_keywords GROUP BY keyword ORDER BY `count` DESC LIMIT 40')->fetchAll();
        $categories = $pdo->query('SELECT category AS `key`, COUNT(*) AS `count` FROM paper_categories GROUP BY category ORDER BY `count` DESC LIMIT 30')->fetchAll();

        foreach ([$tracks, $keywords, $categories] as &$rows) {
            foreach ($rows as &$r) {
                $r['count'] = (int) $r['count'];
            }
        }
        unset($rows, $r);

        json_out([
            'paperCount' => $paperCount,
            'venueCount' => $venueCount,
            'journalCount' => $journalCount,
            'conferenceCount' => $conferenceCount,
            'keywords' => $keywords,
            'tracks' => $tracks,
            'categories' => $categories,
        ]);
    }

    if ($path === '/papers' && $method === 'GET') {
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $pageSize = min(50, max(1, (int) ($_GET['pageSize'] ?? 20)));
        $q = trim((string) ($_GET['q'] ?? ''));
        $track = (string) ($_GET['track'] ?? 'all');
        $keyword = (string) ($_GET['keyword'] ?? 'all');
        $category = (string) ($_GET['category'] ?? 'all');

        $where = ['1=1'];
        $params = [];

        if ($track === 'award') {
            $where[] = "p.tier = 'award'";
        } elseif ($track !== '' && $track !== 'all') {
            $where[] = 'p.track = :track';
            $params['track'] = $track;
        }
        if ($keyword !== '' && $keyword !== 'all') {
            $where[] = 'EXISTS (SELECT 1 FROM paper_keywords pk WHERE pk.paper_id = p.id AND pk.keyword = :kw)';
            $params['kw'] = $keyword;
        }
        if ($category !== '' && $category !== 'all') {
            $where[] = 'EXISTS (SELECT 1 FROM paper_categories pc WHERE pc.paper_id = p.id AND pc.category = :cat)';
            $params['cat'] = $category;
        }
        if ($q !== '') {
            $where[] = '(p.search_blob LIKE :q OR p.title LIKE :q OR p.abstract LIKE :q)';
            $params['q'] = '%' . $q . '%';
        }

        $sqlWhere = implode(' AND ', $where);
        $st = $pdo->prepare("SELECT COUNT(*) FROM papers p WHERE $sqlWhere");
        $st->execute($params);
        $total = (int) $st->fetchColumn();

        $offset = ($page - 1) * $pageSize;
        $st = $pdo->prepare(
            "SELECT p.* FROM papers p WHERE $sqlWhere ORDER BY p.year DESC, p.id ASC LIMIT :lim OFFSET :off"
        );
        foreach ($params as $k => $v) {
            $st->bindValue(':' . $k, $v);
        }
        $st->bindValue(':lim', $pageSize, PDO::PARAM_INT);
        $st->bindValue(':off', $offset, PDO::PARAM_INT);
        $st->execute();
        $rows = $st->fetchAll();
        $items = array_map('paper_list_item', $rows);
        json_out(['total' => $total, 'page' => $page, 'pageSize' => $pageSize, 'items' => $items]);
    }

    if ($path === '/papers/compare' && $method === 'POST') {
        $body = request_json();
        $ids = array_values(array_filter(array_map('strval', $body['ids'] ?? [])));
        $ids = array_slice($ids, 0, 3);
        if (count($ids) < 1) {
            json_out(['items' => []]);
        }
        $in = implode(',', array_fill(0, count($ids), '?'));
        $st = $pdo->prepare("SELECT * FROM papers WHERE id IN ($in)");
        $st->execute($ids);
        $byId = [];
        foreach ($st->fetchAll() as $row) {
            $byId[$row['id']] = paper_full($row);
        }
        $items = [];
        foreach ($ids as $id) {
            if (isset($byId[$id])) {
                $items[] = $byId[$id];
            }
        }
        json_out(['items' => $items]);
    }

    if (preg_match('#^/papers/([^/]+)$#', $path, $m) && $method === 'GET') {
        $id = rawurldecode($m[1]);
        $st = $pdo->prepare('SELECT * FROM papers WHERE id = ? LIMIT 1');
        $st->execute([$id]);
        $row = $st->fetch();
        if (!$row) {
            json_out(['error' => 'not found'], 404);
        }
        json_out(paper_full($row));
    }

    if ($path === '/venues' && $method === 'GET') {
        $kind = (string) ($_GET['kind'] ?? 'all');
        $q = trim((string) ($_GET['q'] ?? ''));
        $where = ['1=1'];
        $params = [];
        if ($kind === 'journal' || $kind === 'conference') {
            $where[] = 'kind = :kind';
            $params['kind'] = $kind;
        }
        if ($q !== '') {
            $where[] = '(name LIKE :q OR abbr LIKE :q OR specialty LIKE :q)';
            $params['q'] = '%' . $q . '%';
        }
        $sqlWhere = implode(' AND ', $where);
        $st = $pdo->prepare("SELECT * FROM venues WHERE $sqlWhere ORDER BY impact_factor DESC, name ASC");
        $st->execute($params);
        $items = array_map('venue_item', $st->fetchAll());
        json_out(['total' => count($items), 'items' => $items]);
    }

    if ($path === '/venues/match' && $method === 'POST') {
        $body = request_json();
        $blob = mb_strtolower(($body['title'] ?? '') . ' ' . ($body['abstract'] ?? ''));
        $kind = (string) ($body['kind'] ?? 'all');
        $rules = [
            'machine-translation' => ['machine translation', 'nmt'],
            'large-language-models' => ['large language model', ' llm', 'llms'],
            'transformers' => ['transformer', 'self-attention'],
            'diffusion' => ['diffusion model', 'ddpm'],
            'reinforcement-learning' => ['reinforcement learning'],
            'computer-vision' => ['computer vision', 'object detection'],
            'nlp' => ['natural language', 'nlp'],
            'security' => ['security', 'privacy'],
            'robotics' => ['robot'],
            'machine-learning' => ['machine learning', 'deep learning'],
        ];
        $keywords = [];
        foreach ($rules as $key => $needles) {
            foreach ($needles as $n) {
                if (str_contains($blob, $n)) {
                    $keywords[] = $key;
                    break;
                }
            }
        }
        $keywords = array_values(array_unique($keywords));

        $sql = 'SELECT * FROM venues';
        $params = [];
        if ($kind === 'journal' || $kind === 'conference') {
            $sql .= ' WHERE kind = ?';
            $params[] = $kind;
        }
        $st = $pdo->prepare($sql);
        $st->execute($params);
        $matches = [];
        foreach ($st->fetchAll() as $row) {
            $v = venue_item($row);
            $vk = $v['keywords'] ?? [];
            $vd = $v['domains'] ?? [];
            $matched = [];
            foreach ($keywords as $k) {
                if (in_array($k, $vk, true) || in_array($k, $vd, true)) {
                    $matched[] = $k;
                }
            }
            $score = count($matched) * 20 + min((float) $v['impactFactor'], 30) * 0.2;
            $v['score'] = $score;
            $v['matchedKeywords'] = $matched;
            $matches[] = $v;
        }
        usort($matches, static fn($a, $b) => $b['score'] <=> $a['score']);
        $matches = array_slice($matches, 0, 15);
        json_out(['keywords' => $keywords, 'matches' => $matches]);
    }

    json_out(['error' => 'not found'], 404);
} catch (Throwable $e) {
    json_out(['error' => 'server_error', 'detail' => $e->getMessage()], 500);
}
