<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "User ID required"]);
    exit;
}

try {
    // Set is_active = 1 to reactivate user
    $stmt = $pdo->prepare("UPDATE users SET is_active = 1 WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["success" => true, "message" => "User reactivated successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
