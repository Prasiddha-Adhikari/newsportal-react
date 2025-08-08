'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface ProductDetailsProps {
  product: Product;
  apiImage: string;
}

export default function ProductDetails({ product, apiImage }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setIsLoggedIn(!!userId);
  }, []);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error('Please login or signup first');
      navigate('/login');
      return;
    }

    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1,
    });
    setAdded(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={`${apiImage}/uploads/${product.image}`}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-lg object-cover w-full"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-orange-600 font-semibold text-2xl mb-6">
            Rs. {product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className={`px-6 py-3 rounded-md text-white font-semibold transition-colors ${
              added ? 'bg-green-600 cursor-default' : 'bg-orange-600 hover:bg-orange-700'
            }`}
            disabled={added}
          >
            {added ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
