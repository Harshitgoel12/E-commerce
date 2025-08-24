import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 text-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">Terms & Conditions</h1>
        <p className="mb-6 text-gray-600 text-sm sm:text-base">
          These Terms & Conditions govern your use of our website and services. By accessing or using our site,
          you agree to these terms.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Products & Services</h2>
            <p className="text-gray-600">
              All products listed are subject to availability. We reserve the right to cancel orders in case of
              pricing errors or stock issues.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payments</h2>
            <p className="text-gray-600">
              All payments are processed securely. We accept major credit/debit cards, UPI, and net banking.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Use of Website</h2>
            <p className="text-gray-600">
              You may not use our website for unlawful or unauthorized purposes. Any misuse may result in access
              termination.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to update these terms at any time without prior notice. Changes become
              effective immediately upon posting.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-gray-400 text-right">
          Updated: {new Date().toDateString()}
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
