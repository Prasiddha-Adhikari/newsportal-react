import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductDetails from '../../components/ProductDetails';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/reactelnepal/backend/api';
const API_IMAGE = import.meta.env.VITE_API ?? 'http://localhost/reactelnepal/backend';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Product ID is missing');
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        const res = await fetch(`${API_URL}/get_product.php?id=${id}`);
        const data = await res.json();

        if (!res.ok || !data.success || !data.product) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(data.product);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    async function fetchRelatedProducts() {
      try {
        const res = await fetch(`${API_URL}/get_related_products.php?id=${id}`);
        const data = await res.json();

        if (res.ok && data.success && data.products) {
          setRelatedProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch related products:', err);
      }
    }

    fetchRelatedProducts();
  }, [id]);

  if (loading) return <p>Loading product...</p>;

  if (error) {
    return (
      <div>
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded"
          onClick={() => navigate('/')}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <ProductDetails product={product} apiImage={API_IMAGE} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <Link
                to={`/product/${related.id}`}
                key={related.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transform hover:scale-[1.02] transition duration-300"
              >
                <img
                  src={`${API_IMAGE}/uploads/${related.image}`}
                  alt={related.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-1 truncate">{related.name}</h3>
                  <p className="text-orange-600 font-bold text-sm">Rs. {related.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
