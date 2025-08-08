<?php
header("Content-Type: application/json");
require '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['orderId'], $data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$orderId = $data['orderId'];
$status = $data['status'];

// Validate status against allowed values
$allowedStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
if (!in_array($status, $allowedStatuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid status value']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$status, $orderId]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
