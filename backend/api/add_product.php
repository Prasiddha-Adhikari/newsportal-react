<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';
$category_id = $_POST['category_id'] ?? '';
$images = $_FILES['images'] ?? null;

if (!$name || !$price || !$category_id || !$images) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

$uploadDir = '../uploads/';
$imageNames = [];

foreach ($images['tmp_name'] as $key => $tmpName) {
    if ($tmpName) {
        $originalName = basename($images['name'][$key]);
        $uniqueName = time() . '_' . uniqid() . '_' . $originalName;
        $uploadPath = $uploadDir . $uniqueName;

        if (move_uploaded_file($tmpName, $uploadPath)) {
            $imageNames[] = $uniqueName;
        } else {
            echo json_encode(["success" => false, "message" => "Failed to upload image: $originalName"]);
            exit;
        }
    }
}

try {
    $firstImage = $imageNames[0] ?? null;
    if (!$firstImage) throw new Exception("No images uploaded");

    $stmt = $pdo->prepare("INSERT INTO products (name, description, price, image, category_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $description, $price, $firstImage, $category_id]);

    echo json_encode(["success" => true, "message" => "Product added successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error"]);
}
