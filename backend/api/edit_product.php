<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$name = $data['name'] ?? '';
$price = $data['price'] ?? '';
$description = $data['description'] ?? '';

if (!$id || !$name || !$price || !$description) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?");
    $stmt->execute([$name, $price, $description, $id]);

    echo json_encode(["success" => true, "message" => "Product updated successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
