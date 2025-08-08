'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../sidebar';
import toast from 'react-hot-toast';

type Category = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchCategories();
  }, );

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
      toast.error("Something went wrong");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const res = await fetch(`${API_URL}/category.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: categoryName }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success(result.message);
      setCategoryName('');
      fetchCategories();
    } else {
      toast.error(result.message || 'Failed to add category');
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async () => {
    const res = await fetch(`${API_URL}/update_category.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, name: editingName }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Category updated");
      setEditingId(null);
      fetchCategories();
    } else {
      toast.error(result.message || 'Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    const res = await fetch(`${API_URL}/delete_category.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (result.success) {
      toast.success("Category deleted");
      fetchCategories();
    } else {
      toast.error(result.message || 'Delete failed');
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Categories</h1>

        <form className="bg-white p-6 rounded-xl shadow space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g. Electronics"
              required
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Add Category
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Existing Categories</h2>
          <div className="bg-white p-4 rounded-md shadow border border-gray-200">
            {categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat.id} className="flex justify-between items-center">
                    {editingId === cat.id ? (
                      <>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                        <div className="space-x-2">
                          <button onClick={handleUpdate} className="bg-blue-500 text-white px-3 py-1 rounded">
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>{cat.name}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(cat.id, cat.name)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
