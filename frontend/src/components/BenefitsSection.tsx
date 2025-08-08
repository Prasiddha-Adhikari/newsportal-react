import { TruckIcon, ArrowPathIcon, LifebuoyIcon } from '@heroicons/react/24/outline';

const benefits = [
  { icon: TruckIcon, title: 'Free Shipping', description: 'On orders over Rs. 50' },
  { icon: ArrowPathIcon, title: 'Easy Returns', description: '30-day hassle-free returns' },
  { icon: LifebuoyIcon, title: '24/7 Support', description: 'We’re here to help anytime' },
];


export default function BenefitsSection() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-8">
        {benefits.map(({ icon: Icon, title, description }, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Icon className="h-10 w-10 text-orange-600" />
            <div>
              <h4 className="font-semibold text-lg">{title}</h4>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
