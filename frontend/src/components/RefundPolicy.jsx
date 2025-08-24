

const RefundPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-gray-800">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
        Return & Refund Policy
      </h1>

      <p className="mb-6 text-gray-600 text-base leading-relaxed text-center">
        Thank you for shopping at <span className="font-semibold">YukiLux Jewellery</span>. If you’re not
        completely satisfied with your purchase, we’re here to help.
      </p>

      <div className="space-y-10 mt-10">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Returns</h2>
          <p className="text-gray-600">
            You can return an item within <span className="font-medium">7 days</span> of delivery. The item
            must be unused, in its original packaging, and with a valid receipt or proof of purchase.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Refunds</h2>
          <p className="text-gray-600">
            Once we receive your return, we will inspect it and notify you. If approved, your refund will be
            processed to your original payment method within <span className="font-medium">5–7 business days</span>.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Non-Returnable Items</h2>
          <p className="text-gray-600">
            Personalized or custom-made items cannot be returned unless damaged or defective.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping</h2>
          <p className="text-gray-600">
            You are responsible for paying your own shipping costs for returning items. Shipping charges
            are <span className="font-medium">non-refundable</span>.
          </p>
        </div>
      </div>

      <p className="mt-16 text-sm text-gray-500 text-center italic">
        Last Updated: {new Date().toDateString()}
      </p>
    </div>
  );
};

export default RefundPolicy;
