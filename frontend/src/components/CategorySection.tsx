'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

type Category = {
  id: number;
  name: string;
};

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/elnepal/backend/api';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/get_categories.php`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          toast.error('Failed to load categories');
        }
      } catch  {
        toast.error('Something went wrong');
      }
    };

    fetchCategories();
  }, [API_URL]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative p-6 rounded-lg border border-gray-200 hover:border-orange-600 shadow-md transition-all bg-white text-center cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-600 transition-colors">
              {cat.name}
            </h3>
            <Link
              to={`/category/${cat.name.toLowerCase()}`}
              className="inline-block text-sm text-white bg-orange-600 px-4 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-700"
            >
              View Products
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
