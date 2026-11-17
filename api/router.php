<?php
// PHP built-in server router: php -S 127.0.0.1:8080 router.php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');
if ($uri !== '/' && file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false;
}
require __DIR__ . '/index.php';
