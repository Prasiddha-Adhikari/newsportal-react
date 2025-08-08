<?php
header('Content-Type: application/json');
require_once '../config/db.php';  // Your PDO connection setup file

try {
    // Read the raw POST data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['user_id'], $input['product_id'])) {
        echo json_encode(['success' => false, 'message' => 'Missing parameters']);
        exit;
    }

    $user_id = (int)$input['user_id'];
    $product_id = $input['product_id'];

    // Prepare SQL to delete the cart item for this user and product
    $sql = "DELETE FROM cart_items WHERE user_id = :user_id AND product_id = :product_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':product_id', $product_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to remove item']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error', 'error' => $e->getMessage()]);
}
