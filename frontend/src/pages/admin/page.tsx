import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, Users, Package, PlusSquare, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/admin' },
  { name: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
  { name: 'Products', icon: <Package className="w-5 h-5" />, path: '/admin/products' },
  { name: 'Add Product', icon: <PlusSquare className="w-5 h-5" />, path: '/admin/products/add' },
  { name: 'Orders', icon: <PlusSquare className="w-5 h-5" />, path: '/admin/orders' },
  { name: 'Categories', icon: <Settings className="w-5 h-5" />, path: '/admin/categories' },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast.error('Not logged in');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== 'admin') {
        toast.error('Not authorized');
        setTimeout(() => {
          navigate('/not-authorized');
        }, 1500);
        return;
      }
      setAdminName(user.fullname || 'Admin');
    } catch {
      toast.error('Session error');
      localStorage.removeItem('user');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition ${
                location.pathname === item.path ? 'bg-gray-800' : ''
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome, {adminName}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="text-gray-600 mt-2">Manage all registered users</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold">Total Products</h2>
            <p className="text-gray-600 mt-2">View and edit all products</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold">Add New Category</h2>
            <p className="text-gray-600 mt-2">Organize your products</p>
          </div>
        </div>
      </main>
    </div>
  );
}
