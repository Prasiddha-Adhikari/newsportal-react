import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category_id: number | string;
  category_name: string;
};

type Category = {
  id: number | string;
  name: string;
};

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/elnepal/backend/api';
  const API_IMAGE = import.meta.env.VITE_API ?? 'http://localhost/elnepal/backend';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
      } catch {
        console.error('Invalid user data in localStorage');
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/get_categories.php`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/get_products.php`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [API_URL]);

  const handleAddToCart = async (product: Product) => {
    if (!userId) {
      toast.error('Please log in or sign up first.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/add_to_cart.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: product.id,
          quantity: 1,
        }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Invalid JSON:', err);
        toast.error('Server returned invalid response.');
        return;
      }

      if (data.success) {
        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
        toast.success('Item added to cart!');
      } else {
        toast.error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Server error, please try again later.');
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === '' || String(p.category_id) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Shop</h1>

      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border px-4 py-2 rounded mb-4 md:mb-0"
          placeholder="Search for a product..."
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <p className="text-center col-span-full">No products found.</p>
        ) : (
          filtered.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow bg-white">
              <img
                src={`${API_IMAGE}/uploads/${product.image}`}
                alt={product.name}
                width={300}
                height={200}
                className="mb-4 object-cover"
              />
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category_name}</p>
              <p className="text-orange-600 font-bold">
                Rs. {(Number(product.price) || 0).toFixed(2)}
              </p>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-2 w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
              >
                Add to Cart
              </button>

              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="mt-2 w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
              >
                View Detail
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
