<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');

if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool
    {
        return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}
if (!function_exists('str_ends_with')) {
    function str_ends_with(string $haystack, string $needle): bool
    {
        if ($needle === '') {
            return true;
        }
        $len = strlen($needle);
        return $len <= strlen($haystack) && substr($haystack, -$len) === $needle;
    }
}

$dir = dirname(__DIR__);
$cpanelPath = $dir . '/config.cpanel.php';
$localPath = $dir . '/config.php';

// Local PHP built-in server / CLI → prefer config.php (local MySQL).
// Production host → prefer config.cpanel.php when present.
$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$isLocal = PHP_SAPI === 'cli-server'
    || PHP_SAPI === 'cli'
    || str_starts_with($host, '127.0.0.1')
    || str_starts_with($host, 'localhost');

if ($isLocal && is_file($localPath)) {
    $configPath = $localPath;
} elseif (is_file($cpanelPath)) {
    $configPath = $cpanelPath;
} else {
    $configPath = $localPath;
}

if (!is_file($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error' => 'missing_config',
        'message' => 'Missing api/config.php (local) or api/config.cpanel.php (server)',
    ]);
    exit;
}

/** @var array $CONFIG */
$CONFIG = require $configPath;

function app_config(): array
{
    global $CONFIG;
    return $CONFIG;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $c = app_config()['db'];
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $c['host'],
        (int) ($c['port'] ?? 3306),
        $c['name'],
        $c['charset'] ?? 'utf8mb4'
    );
    $pdo = new PDO($dsn, $c['user'], $c['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function json_out($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function apply_cors(): void
{
    $origins = app_config()['allowed_origins'] ?? [];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, $origins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    } elseif (!$origin && PHP_SAPI === 'cli-server') {
        header('Access-Control-Allow-Origin: *');
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: content-type, authorization');
}

function require_read_auth(): void
{
    $token = (string) (app_config()['read_token'] ?? '');
    if ($token === '') {
        return;
    }
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($hdr !== 'Bearer ' . $token) {
        json_out(['error' => 'unauthorized'], 401);
    }
}

function request_json(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function json_decode_array(?string $s): array
{
    if ($s === null || $s === '') {
        return [];
    }
    $d = json_decode($s, true);
    return is_array($d) ? $d : [];
}
