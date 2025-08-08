'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';


type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/elnepal/backend/api';
  const API_Image = import.meta.env.VITE_API ?? 'http://localhost/elnepal/backend/';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/get_random_products.php`);
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          toast.error('Failed to load products');
        }
      } catch {
        toast.error('Something went wrong');
      }
    };

    fetchProducts();
  }, [API_URL]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-center col-span-full">Loading products...</p>
        ) : (
          products.map((prod) => (
            <div
              key={prod.id}
              className="group relative border border-gray-200 hover:border-orange-600 rounded-lg p-4 hover:shadow-lg transition-all bg-white"
            >
              <img
                src={`${API_Image}/uploads/${prod.image}`} // Assuming images are in /uploads folder
                alt={prod.name}
                width={300}
                height={200}
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="font-semibold text-lg group-hover:text-orange-600 transition-colors">{prod.name}</h3>
              <p className="text-orange-600 font-bold mt-2">{prod.price}</p>
              <Link
                to={`/product/${prod.id}`}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-sm px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-700"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
