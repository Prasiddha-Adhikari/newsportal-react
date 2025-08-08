'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../sidebar';

type Product = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  user: string;
  products: Product[];
  totalPrice: number;
  paymentMethod: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
};

const STATUSES = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<typeof STATUSES[number]>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/elnepal/backend/api'}/get_orders.php`
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
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === 'All' ? orders : orders.filter((o) => o.status === filterStatus);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Updated changeStatus to call API and update DB
  const changeStatus = async (newStatus: Order['status']) => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost/elnepal/backend/api'}/update_order_status.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: selectedOrder.id,
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update state only if backend update successful
        const updatedOrders = orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        );
        setOrders(updatedOrders);
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      } else {
        alert('Failed to update status: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error updating status: ' + error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">User Orders</h1>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="statusFilter" className="font-medium text-gray-700">
            Filter by status:
          </label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as typeof STATUSES[number]);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md p-2"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Order ID</th>
                <th className="border px-4 py-2 text-left">User</th>
                <th className="border px-4 py-2 text-left">Products</th>
                <th className="border px-4 py-2 text-left">Qty</th>
                <th className="border px-4 py-2 text-left">Total (Rs)</th>
                <th className="border px-4 py-2 text-left">Payment Method</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.user}</td>
                  <td className="border px-4 py-2">{order.products.map((p) => p.name).join(', ')}</td>
                  <td className="border px-4 py-2">{order.products.reduce((acc, p) => acc + p.qty, 0)}</td>
                  <td className="border px-4 py-2">{order.totalPrice.toFixed(2)}</td>
                  <td className="border px-4 py-2">{order.paymentMethod}</td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">{order.orderDate}</td>
                </tr>
              ))}

              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-600">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Modal */}
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
                <strong>User:</strong> {selectedOrder.user}
              </p>
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

              <div className="flex gap-3 flex-wrap">
                {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => changeStatus(status as Order['status'])}
                    disabled={selectedOrder.status === status}
                    className={`px-4 py-2 rounded ${
                      selectedOrder.status === status
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Mark as {status}
                  </button>
                ))}
              </div>

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
