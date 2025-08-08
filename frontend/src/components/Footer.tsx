'use client';

import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">EL Nepal</h3>
          <p className="text-sm">
            Your one-stop shop for quality products with unbeatable deals. Shop with confidence and enjoy fast delivery.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-orange-500">Home</Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-orange-500">Shop</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-500">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-500">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-white font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/faq" className="hover:text-orange-500">FAQ</Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-orange-500">Returns</Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-orange-500">Shipping Info</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-orange-500">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <p className="text-sm mb-2">Chabahil,<br /> Kathmandu, Nepal</p>
          <p className="text-sm mb-2">Email: support@ELNepal.com</p>
          <p className="text-sm">Phone: +977-9851155638</p>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} EL Nepal. All rights reserved.
      </div>
    </footer>
  );
}
