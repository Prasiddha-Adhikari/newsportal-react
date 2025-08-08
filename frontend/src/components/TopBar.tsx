'use client';

import { useEffect, useState, useRef } from 'react';
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';

type User = {
  fullname: string;
  role: string;
};

export default function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadUser = () => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    setHasMounted(true);
    loadUser();

    const handleUserChange = () => loadUser();
    window.addEventListener('userChanged', handleUserChange);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('userChanged', handleUserChange);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    setDropdownOpen(false);
    navigate('/');
  };

  const handleLinkClick = () => {
    setDropdownOpen(false);
  };

  if (!hasMounted) return null;

  return (
    <div className="bg-gray-900 relative z-50">
      <div className="max-w-7xl mx-auto text-white text-sm px-4 py-2 flex justify-between items-center">
        <span>Traditional Panchadhatu. Modern Convenience.</span>

        <div ref={dropdownRef} className="relative z-50">
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center space-x-1 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-controls="account-menu"
          >
            <UserIcon className="h-5 w-5" />
            <span>{user ? user.fullname.split(' ')[0] : 'Account'}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          {dropdownOpen && (
            <div
              id="account-menu"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="account-menu-button"
              className="absolute right-0 mt-2 w-44 bg-white text-black rounded-md shadow-lg z-50"
            >
              {user ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/my-orders'}
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                    onClick={handleLinkClick}
                    role="menuitem"
                  >
                    <HomeIcon className="h-4 w-4 mr-2" />
                    {user.role === 'admin' ? 'Dashboard' : 'My Orders'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 hover:bg-gray-100 text-left"
                    role="menuitem"
                  >
                    <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleLinkClick}
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center px-4 py-2 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleLinkClick}
                  >
                    <ArrowRightIcon className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
