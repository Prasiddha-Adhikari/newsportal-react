import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface User {
  id: number;
  fullname: string;
  email: string;
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart() as { cartItems: CartItem[]; clearCart: () => void };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'esewa' | 'khalti'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  const eSewaNumber = '9801234567';
  const khaltiNumber = '9807654321';

  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsed: User = JSON.parse(userStr);
        setUserId(parsed.id);
        setName(parsed.fullname);
        setEmail(parsed.email);
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('User not logged in. Please log in before placing an order.');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVC)) {
      alert('Please fill all card details.');
      return;
    }

    const payment_reference =
      paymentMethod === 'esewa' ? eSewaNumber :
      paymentMethod === 'khalti' ? khaltiNumber :
      null;

    const orderData = {
      user_id: userId,
      name,
      email,
      address,
      phone,
      paymentMethod,
      payment_reference,
      cardDetails: paymentMethod === 'card' ? { cardNumber, cardExpiry, cardCVC } : null,
      cartItems,
      total,
    };

    const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/elnepal/backend/api';

    try {
      const res = await fetch(`${API_URL}/create_order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        alert(`Order placed successfully via ${paymentMethod}!`);
        clearCart();
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setPaymentMethod('card');
        setCardNumber('');
        setCardExpiry('');
        setCardCVC('');
      } else {
        const error = await res.text();
        alert(`Failed to place order: ${error}`);
      }
    } catch (error) {
      alert('Error placing order. Please try again.');
      console.error('Order submission error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-600">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-6">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-gray-300 p-2 rounded mb-3" />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 p-2 rounded mb-3" />
          <input type="text" placeholder="Shipping Address" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full border border-gray-300 p-2 rounded mb-3" />
          <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full border border-gray-300 p-2 rounded" />

          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {(['card', 'esewa', 'khalti'] as const).map((method) => (
                <label key={method} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="form-radio"
                  />
                  <span className="capitalize">{method}</span>
                </label>
              ))}
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-4">
                <input type="text" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={16} required className="w-full border border-gray-300 p-2 rounded" />
                <input type="text" placeholder="Expiry Date (MM/YY)" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} maxLength={5} required className="w-full border border-gray-300 p-2 rounded" />
                <input type="text" placeholder="CVC" value={cardCVC} onChange={(e) => setCardCVC(e.target.value)} maxLength={4} required className="w-full border border-gray-300 p-2 rounded" />
              </div>
            )}

            {paymentMethod === 'esewa' && (
              <div className="mt-4">
                <p className="font-semibold mb-2">eSewa Number:</p>
                <p className="text-lg font-bold text-orange-600 mb-4">{eSewaNumber}</p>
                <img src="/images/esewa-qr.png" alt="eSewa QR Code" width={160} height={160} className="object-contain" />
              </div>
            )}

            {paymentMethod === 'khalti' && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Khalti Number:</p>
                <p className="text-lg font-bold text-orange-600 mb-4">{khaltiNumber}</p>
                <img src="/images/khalti-qr.png" alt="Khalti QR Code" width={160} height={160} className="object-contain" />
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded hover:bg-orange-700">
            Place Order
          </button>
        </form>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × Rs. {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
              <li className="pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
