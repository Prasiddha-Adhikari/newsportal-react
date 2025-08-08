<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");
include '../config/db.php'; // your DB connection

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
$name = trim($data['name'] ?? '');

if (empty($name)) {
    echo json_encode(["success" => false, "message" => "Category name is required"]);
    exit;
}

try {
    // Check if category already exists
    $stmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
    $stmt->execute([$name]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Category already exists"]);
        exit;
    }

    // Insert new category
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->execute([$name]);

    echo json_encode(["success" => true, "message" => "Category added successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
