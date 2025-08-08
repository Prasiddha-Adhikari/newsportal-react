'use client';

import { useEffect, useState } from 'react';

type Product = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  products: Product[];
  totalPrice: number;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed.id);
    }
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL ?? 'http://localhost/elnepal/backend/api'}/get_user_orders.php?user_id=${userId}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error('Invalid orders format:', data);
        }
      } catch (error) {
        console.error('Failed to fetch user orders:', error);
      }
    };

    if (userId) fetchUserOrders();
  }, [userId]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left">Order ID</th>
                  <th className="border px-4 py-2 text-left">Products</th>
                  <th className="border px-4 py-2 text-left">Qty</th>
                  <th className="border px-4 py-2 text-left">Total (Rs)</th>
                  <th className="border px-4 py-2 text-left">Payment Method</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="border px-4 py-2">{order.id}</td>
                    <td className="border px-4 py-2">{order.products.map((p) => p.name).join(', ')}</td>
                    <td className="border px-4 py-2">{order.products.reduce((acc, p) => acc + p.qty, 0)}</td>
                    <td className="border px-4 py-2">{order.totalPrice.toFixed(2)}</td>
                    <td className="border px-4 py-2">{order.paymentMethod}</td>
                    <td className="border px-4 py-2">{order.status}</td>
                    <td className="border px-4 py-2">{order.orderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for order details */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Order Details - {selectedOrder.id}</h2>
              <p className="mb-2">
                <strong>Date:</strong> {selectedOrder.orderDate}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {selectedOrder.status}
              </p>

              <h3 className="font-semibold mt-4 mb-2">Products:</h3>
              <ul className="list-disc list-inside mb-4">
                {selectedOrder.products.map((p, i) => (
                  <li key={i}>
                    {p.name} — Qty: {p.qty} — Price: Rs. {p.price.toFixed(2)}
                  </li>
                ))}
              </ul>

              <p className="mb-6 font-semibold">Total: Rs. {selectedOrder.totalPrice.toFixed(2)}</p>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}