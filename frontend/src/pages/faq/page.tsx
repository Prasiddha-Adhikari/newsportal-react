'use client';


export default function FAQPage() {
  const faqs = [
    {
      question: "What is your shipping policy?",
      answer: "We offer free shipping on all U.S orders over Rs. 50. International shipping rates apply separately."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you will receive a tracking number via email."
    },
    {
      question: "Can I return or exchange an item?",
      answer: "Yes, items can be returned or exchanged within 30 days of purchase, provided they are in original condition."
    },
  ];

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map(({ question, answer }, index) => (
            <div key={index} className="border rounded p-4 bg-white shadow">
              <h3 className="font-semibold mb-2">{question}</h3>
              <p className="text-gray-700">{answer}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
