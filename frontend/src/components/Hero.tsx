'use client';
import bg from '../assets/background.webp';

export default function Hero() {
  return (
    <section className="relative h-[100vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
        aria-hidden="true"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to EL Nepal</h1>
        <p className="text-lg md:text-xl mb-6">Discover the best products with unbeatable deals</p>
        <a
          href="/shop"
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full transition"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
}
