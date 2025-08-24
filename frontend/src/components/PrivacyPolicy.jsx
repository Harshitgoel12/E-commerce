

const PrivacyPolicy = () => {
  return (
    <section className="max-w-5xl px-4 py-20 mx-auto text-gray-800 animate-fadeIn">
      <div className="space-y-10">
        <header>
          <h1 className="text-4xl font-bold text-pink-600 mb-4">Privacy Policy</h1>
          <p className="text-base text-gray-600 leading-relaxed">
            At Trendify Jewellery, your privacy is important to us. This policy outlines how we
            collect, use, and protect your personal information.
          </p>
        </header>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information Collection</h2>
          <p className="text-gray-600 leading-relaxed">
            We collect data when you place an order, subscribe to our newsletter, or contact us.
            This includes your name, email, address, phone number, and payment details.
          </p>
        </section>

        <hr className="border-t border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Use of Information</h2>
          <p className="text-gray-600 leading-relaxed">
            Your information is used to fulfill orders, send updates, improve our services, and
            provide relevant offers. We never sell or rent your personal data.
          </p>
        </section>

        <hr className="border-t border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Security</h2>
          <p className="text-gray-600 leading-relaxed">
            We implement standard industry practices to protect your personal data against
            unauthorized access, alteration, or disclosure.
          </p>
        </section>

        <hr className="border-t border-gray-200" />

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            Our site uses cookies to personalize content and enhance your browsing experience. You
            can control cookie preferences via your browser settings.
          </p>
        </section>

        <footer className="pt-8 text-sm text-gray-500 border-t border-gray-100">
          Last updated: {new Date().toDateString()}
        </footer>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
