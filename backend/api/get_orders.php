<?php
header("Content-Type: application/json");
require '../config/db.php';

try {
    // Select status column also from orders table
    $stmtOrders = $pdo->query("SELECT id, user_id, name, email, address, phone, total_amount, payment_method, status, payment_reference, created_at FROM orders ORDER BY created_at DESC");
    $orders = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

    $result = [];

    foreach ($orders as $order) {
        // Get order items for this order
        $stmtItems = $pdo->prepare("SELECT product_name, quantity, price FROM order_items WHERE order_id = ?");
        $stmtItems->execute([$order['id']]);
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        // Format products
        $products = array_map(function($item) {
            return [
                'name' => $item['product_name'],
                'qty' => (int)$item['quantity'],
                'price' => (float)$item['price'],
            ];
        }, $items);

        $result[] = [
            'id' => $order['id'],
            'user' => $order['name'], // or user table lookup if you want real username
            'products' => $products,
            'totalPrice' => (float)$order['total_amount'],
            'paymentMethod' => $order['payment_method'],  // payment method here
            'status' => $order['status'],                  // actual order status here
            'orderDate' => $order['created_at'],
        ];
    }

    echo json_encode($result);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
