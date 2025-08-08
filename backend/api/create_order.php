<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

require_once '../config/db.php'; // Adjust path if needed

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$requiredFields = ['name', 'email', 'address', 'phone', 'paymentMethod', 'cartItems', 'total', 'user_id'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || (empty($data[$field]) && $data[$field] !== 0 && $data[$field] !== '0')) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

try {
    $sqlOrder = "INSERT INTO orders 
        (user_id, name, email, address, phone, payment_method, payment_reference, card_number, card_expiry, card_cvc, total_amount)
        VALUES (:user_id, :name, :email, :address, :phone, :payment_method, :payment_reference, :card_number, :card_expiry, :card_cvc, :total_amount)";

    $stmt = $pdo->prepare($sqlOrder);

    $paymentReference = $data['payment_reference'] ?? null;
    $cardNumber = null;
    $cardExpiry = null;
    $cardCVC = null;

    if ($data['paymentMethod'] === 'card' && isset($data['cardDetails'])) {
        $cardNumber = $data['cardDetails']['cardNumber'] ?? null;
        $cardExpiry = $data['cardDetails']['cardExpiry'] ?? null;
        $cardCVC = $data['cardDetails']['cardCVC'] ?? null;
    }

    $stmt->execute([
        ':user_id' => $data['user_id'],
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':address' => $data['address'],
        ':phone' => $data['phone'],
        ':payment_method' => $data['paymentMethod'],
        ':payment_reference' => $paymentReference,
        ':card_number' => $cardNumber,
        ':card_expiry' => $cardExpiry,
        ':card_cvc' => $cardCVC,
        ':total_amount' => $data['total'],
    ]);

    $orderId = $pdo->lastInsertId();

    $sqlItem = "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (:order_id, :product_id, :product_name, :quantity, :price)";
    $stmtItem = $pdo->prepare($sqlItem);

    foreach ($data['cartItems'] as $item) {
        $stmtItem->execute([
            ':order_id' => $orderId,
            ':product_id' => $item['id'],
            ':product_name' => $item['name'],
            ':quantity' => $item['quantity'],
            ':price' => $item['price'],
        ]);
    }

    echo json_encode(['success' => true, 'orderId' => $orderId]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}
