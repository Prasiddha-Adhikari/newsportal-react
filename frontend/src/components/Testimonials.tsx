'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
  { id: 1, name: 'Amit', feedback: 'Great products and fast delivery!' },
  { id: 2, name: 'Sita', feedback: 'Excellent customer service.' },
  { id: 3, name: 'Ram', feedback: 'Quality is top-notch, highly recommend.' },
];

export default function Testimonials() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 bg-white">
      <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="rounded-lg"
      >
        {testimonials.map(({ id, name, feedback }) => (
          <SwiperSlide key={id}>
            <div className="border p-6 rounded-lg shadow-sm bg-gray-50 text-center max-w-xl mx-auto">
              <p className="italic mb-4">&quot;{feedback}&quot;</p>
              <h5 className="font-semibold">{name}</h5>
              <a
                href={`/testimonial/${id}`}
                className="inline-block mt-2 text-sm text-orange-600 hover:underline font-medium"
              >
                Read More
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
