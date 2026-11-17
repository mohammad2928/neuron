<?php
/**
 * Copy to config.php for local use, or use config.cpanel.php on the host.
 * Never commit a real production config.php.
 */
return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'YOUR_DB_NAME',
        'user' => 'YOUR_DB_USER',
        'pass' => 'YOUR_DB_PASSWORD',
        'charset' => 'utf8mb4',
    ],
    'read_token' => '',
    'admin_token' => 'CHANGE_ME_LONG_RANDOM',
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://neuron.monyar.ir',
    ],
];
