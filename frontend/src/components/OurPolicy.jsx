import { assets } from '../assets/assets';

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: 'Easy Return & Exchange',
      description: 'Hassle-free returns and exchanges within 10 days.',
      alt: 'Exchange Policy',
    },
    {
      icon: assets.quality_icon,
      title: 'Top Quality Guaranteed',
      description: 'We deliver premium quality products you can trust.',
      alt: 'Quality Policy',
    },
    {
      icon: assets.support_img,
      title: '24/7 Customer Support',
      description: 'Chat, email, or call us — we’re always here to help.',
      alt: 'Customer Support',
    },
  ];

  return (
    <section className="max-w-6xl px-4 py-12 mx-auto">
      <h2 className="mb-10 text-2xl font-semibold text-center text-gray-800 sm:text-3xl">
        Why Shop with <span className="text-pink-600">YukiLux</span>?
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {policies.map((policy, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white border rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-pink-50 rounded-full">
              <img
                src={policy.icon}
                alt={policy.alt}
                className="w-8 h-8"
                loading="lazy"
              />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">{policy.title}</h3>
            <p className="text-sm text-gray-500">{policy.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPolicy;
