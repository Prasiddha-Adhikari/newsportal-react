<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Kathmandu');

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../config/db.php';
require 'mail.php'; // make sure this handles PHPMailer safely

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

if (!$email) {
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit();
}

try {
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // Always return a generic success message to prevent user enumeration
    $genericResponse = ["success" => true, "message" => "If this email exists, a reset link has been sent."];

    if (!$user) {
        echo json_encode($genericResponse);
        exit();
    }

    // Generate token + expiry
    $resetToken = bin2hex(random_bytes(16));
    $expireDate = date('Y-m-d H:i:s', time() + 3600); // 1 hour

    $stmt = $pdo->prepare("UPDATE users SET reset_token = ?, token_expiry = ? WHERE id = ?");
    $stmt->execute([$resetToken, $expireDate, $user['id']]);

    // Create reset link
    $resetLink = "http://localhost:3000/reset-password?token=$resetToken";

    $subject = "Password Reset Request";
    $body = "
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href='$resetLink'>$resetLink</a></p>
        <p>This link will expire in 1 hour. If you didn't request it, please ignore this email.</p>
    ";

    // Call your custom sendMail() safely
    $emailSent = sendMail($email, $subject, $body);

    if (!$emailSent) {
        echo json_encode(["success" => false, "message" => "Failed to send email. Please try again later."]);
    } else {
        echo json_encode($genericResponse);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error. Please try again later."]);
    error_log("Password reset error: " . $e->getMessage());
}
exit();
