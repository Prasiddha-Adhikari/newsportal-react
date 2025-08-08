'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import Sidebar from '../../sidebar';
import toast from 'react-hot-toast';

type Category = {
  id: number;
  name: string;
};

export default function AddProductPage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/get_categories.php`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          toast.error("Failed to load categories");
        }
      } catch {
        toast.error("Something went wrong while loading categories");
      }
    };

    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
    const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!name || !price || !description || !categoryId || images.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('description', description);
    formData.append('category_id', categoryId);
    images.forEach((image) => {
      formData.append('images[]', image);
    });

    try {
      const res = await fetch(`${API_URL}/add_product.php`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setName('');
        setPrice('');
        setDescription('');
        setCategoryId('');
        setImages([]);
        setPreviews([]);
      } else {
        toast.error(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload failed: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              required
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              required
              disabled={loading || categories.length === 0}
            >
              <option value="">
                {categories.length === 0 ? 'Loading categories...' : 'Select category'}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
              disabled={loading}
            />
          </div>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {previews.map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt={`Preview ${index + 1}`}
                  width={96}
                  height={96}
                  className="rounded border object-cover"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md mt-6 hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </main>
    </div>
  );
}
