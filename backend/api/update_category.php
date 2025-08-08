<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$name = trim($data['name'] ?? '');

if (!$id || !$name) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE categories SET name = ? WHERE id = ?");
    $stmt->execute([$name, $id]);

    echo json_encode(["success" => true, "message" => "Category updated"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Update error"]);
}
