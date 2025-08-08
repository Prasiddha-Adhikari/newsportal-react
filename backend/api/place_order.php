<?php
require '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$payment_method = $data['payment_method'];
$cart_items = $data['cart_items']; // array of {product_id, quantity, price}

// Calculate total
$total_amount = 0;
foreach ($cart_items as $item) {
  $total_amount += $item['quantity'] * $item['price'];
}

// Insert order
$orderStmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, payment_method) VALUES (?, ?, ?)");
$orderStmt->bind_param("ids", $user_id, $total_amount, $payment_method);
$orderStmt->execute();
$order_id = $orderStmt->insert_id;

// Insert order items
$itemStmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
foreach ($cart_items as $item) {
  $itemStmt->bind_param("iiid", $order_id, $item['product_id'], $item['quantity'], $item['price']);
  $itemStmt->execute();
}

echo json_encode([
  'success' => true,
  'message' => 'Order placed successfully!',
  'order_id' => $order_id
]);
?>
