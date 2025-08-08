'use client';

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cartItems } = useCart();

  return (
    <nav className="sticky top-0 z-40 bg-white shadow px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-orange-600">
          EL Nepal
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-orange-600">Home</Link>
          <Link to="/shop" className="text-gray-700 hover:text-orange-600">Shop</Link>
          <Link to="/about" className="text-gray-700 hover:text-orange-600">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-orange-600">Contact</Link>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-orange-600" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
