import  { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios';

const steps = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const stepColor = {
  Pending: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async () => {
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderStatus('');

    try {
      
      const res = await api.get(`/order/track/${orderId}`);
      setOrderStatus(res.data.status || 'Pending');
    } catch (err) {
      setError('Order not found. Please check the ID and try again.');
       toast.error('Order not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => (steps.includes(orderStatus) ? steps.indexOf(orderStatus) : -1);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-8">
          📦 Track Your Order
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <input
            type="text"
            placeholder="Enter your Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full sm:w-80 border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleTrackOrder}
            disabled={loading}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-base font-medium transition"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Track Order'}
          </button>
        </div>
        {error && (
          <div className="text-center text-red-600 font-semibold text-sm mb-6">{error}</div>
        )}
        {orderStatus && !error && (
          <>
            <div className="flex justify-between items-center mb-6">
              {steps.map((step, index) => {
                const isActive = index <= getCurrentStep();
                return (
                  <div key={step} className="flex flex-col items-center text-center w-1/4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm sm:text-base mb-2 transition ${
                        isActive ? stepColor[step] : 'bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isActive ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="relative h-3 rounded-full bg-gray-200 overflow-hidden mb-6">
              <div
                className="absolute h-full transition-all duration-500 bg-blue-600 rounded-full"
                style={{ width: `${((getCurrentStep() + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-center mt-4 text-lg sm:text-xl font-semibold text-gray-700">
              Current Status:{' '}
              <span
                className={`${
                  stepColor[orderStatus] ? stepColor[orderStatus].replace('bg-', 'text-') : ''
                }`}
              >
                {orderStatus}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
