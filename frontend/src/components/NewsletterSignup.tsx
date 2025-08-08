'use client'
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Add your subscription logic here
    setSubmitted(true);
  }

  return (
    <section className="bg-orange-600 py-12 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
      <p className="mb-6">Get updates on new products and exclusive offers.</p>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex justify-center max-w-md mx-auto gap-2">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="rounded-l-md px-4 py-2 text-gray-900 w-full"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="submit" className="bg-white text-orange-600 font-semibold px-6 rounded-r-md hover:bg-gray-100 transition">
            Subscribe
          </button>
        </form>
      ) : (
        <p className="text-lg font-semibold">Thank you for subscribing!</p>
      )}
    </section>
  );
}
