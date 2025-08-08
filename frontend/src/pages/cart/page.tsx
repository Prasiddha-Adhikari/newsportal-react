import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, loadCartItems } = useCart();
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/elnepal/backend/api';
  const API_IMAGE = import.meta.env.VITE_API ?? 'http://localhost/elnepal/backend';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.id) {
          setUserId(user.id);
        }
      } catch {
        console.error('Invalid user data in localStorage');
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchCart() {
      try {
        const res = await fetch(`${API_URL}/get_cart.php?user_id=${userId}`);
        const data = await res.json();
        if (data.success) {
          loadCartItems(data.cart_items);
        } else {
          console.error('Failed to load cart');
        }
      } catch (error) {
        console.error('Error loading cart', error);
      }
    }

    fetchCart();
  }, [userId, API_URL, loadCartItems]);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handleRemove = async (id: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_URL}/remove_cart_item.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: id }),
      });
      const data = await res.json();
      if (data.success) {
        removeFromCart(id);
      }
    } catch (error) {
      console.error('Server error removing item', error);
    }
  };

  const handleOrder = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.image?.startsWith('http')
                        ? item.image
                        : `${API_IMAGE}/uploads/${item.image}`
                    }
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded"
                  />

                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-orange-600 font-medium">
                      Rs. {Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <p className="font-medium">Quantity: {item.quantity}</p>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Subtotal: Rs. {subtotal.toFixed(2)}
            </h2>
            <button
              onClick={handleOrder}
              className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
