<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ CORS HEADERS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
date_default_timezone_set('Asia/Kathmandu');

// ✅ Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}




include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$token = trim($data['token'] ?? '');
$password = trim($data['password'] ?? '');

if (!$token || !$password) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing token or password"]);
    exit();
}

// Find user by token and check if it's still valid
$stmt = $pdo->prepare("SELECT id FROM users WHERE reset_token = ? AND token_expiry > NOW()");
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid or expired token"]);
    exit();
}

// Hash and update password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("UPDATE users SET password = ?, reset_token = NULL, token_expiry = NULL WHERE id = ?");
$stmt->execute([$hashedPassword, $user['id']]);

echo json_encode(["success" => true, "message" => "Password reset successful"]);