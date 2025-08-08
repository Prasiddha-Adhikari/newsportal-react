'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with actual form submission logic
    setSubmitted(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10 text-orange-600 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {submitted ? (
            <p className="text-green-600 text-center text-lg font-semibold">
              Thank you for your message! We will get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-gray-800">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 font-semibold text-gray-800">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info + Map */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">Get in Touch</h2>
            <p className="mb-3">
              <strong>Phone:</strong> +977-9851155638
            </p>
            <p className="mb-3">
              <strong>Email:</strong> support@ELNepal.com
            </p>
            <p className="mb-3">
              <strong>Address:</strong> Chabahil, Kathmandu, Nepal
            </p>
          </div>

          {/* Google Map */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3532.0338377157473!2d85.3454365!3d27.7162415!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19acc8c20b1b%3A0x25730cdb87ec681c!2sEasylink%20Nepal%20Job%20Portal!5e0!3m2!1sen!2snp!4v1749807548900!5m2!1sen!2snp"
              width="100%"
              height="300"
              allowFullScreen
              loading="lazy"
              className="border-0"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}
