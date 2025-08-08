<?php
header('Content-Type: application/json');
require '../config/db.php';

if (!isset($_GET['user_id'])) {
  echo json_encode(['error' => 'Missing user_id']);
  exit;
}

$userId = $_GET['user_id'];

try {
    $stmtOrders = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmtOrders->execute([$userId]);
    $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

    $result = [];

    foreach ($orders as $order) {
        $stmtItems = $pdo->prepare("SELECT product_name, quantity, price FROM order_items WHERE order_id = ?");
        $stmtItems->execute([$order['id']]);
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        $products = array_map(function($item) {
            return [
                'name' => $item['product_name'],
                'qty' => (int)$item['quantity'],
                'price' => (float)$item['price'],
            ];
        }, $items);

        $result[] = [
            'id' => $order['id'],
            'products' => $products,
            'totalPrice' => (float)$order['total_amount'],
            'paymentMethod' => $order['payment_method'],
            'status' => $order['status'],
            'orderDate' => $order['created_at'],
        ];
    }

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
