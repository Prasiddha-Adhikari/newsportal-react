'use client';

import { useEffect, useState } from 'react';
import TopBar from './TopBar';
import Navbar from './Navbar';

export default function Header() {
  const [showTopBar, setShowTopBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY <= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full z-50">
      {showTopBar && <TopBar />}
      <Navbar />
    </header>
  );
}
