import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const OrderDetails = () => {
   const API_URL=import.meta.env.VITE_API_URL
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const res = await axios.get(`${API_URL}/order/${id}`,{
          withCredentials:true
        });
        setOrder(res.data.order);
        setOrderStatus(res.data.order.status);
      } catch (err) {
        console.error('Failed to fetch order:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderData();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);

    try {
      console.log("yha tk to aa gye",id)
      await axios.put(`${API_URL}/order/status/${id}`, {
        status: newStatus,
      },{
        withCredentials:true
      });
      
    } catch (err) {
      console.error('Failed to update order status:', err.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500 text-lg">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-6 text-center text-red-500 text-lg">Failed to load order.</div>;
  }

  const { user = {}, items = [] } = order;

  const calculateTotal = () =>
    items.reduce((total, item) => total + item.price * item.quantity + item.deliveryCharge, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">Order Summary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Information</h2>
          <div className="text-sm sm:text-base space-y-2 text-gray-600">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.mobile}</p>
            <p>
              <strong>Address:</strong><br />
              {user.address}, {user.city}, {user.state} - {user.zip}, {user.country}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment & Order Status</h2>
          <div className="text-sm sm:text-base space-y-2 text-gray-600">
            <p><strong>Order ID:</strong> {order.razorpay_order_id}</p>
            <p><strong>Payment ID:</strong> {order.razorpay_payment_id}</p>
            <p><strong>Paid:</strong> {order.isPaid ? '✅ Yes' : '❌ No'}</p>

            <div className="mt-4">
              <p className="font-semibold mb-2">Order Status:</p>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${statusColor[orderStatus] || 'bg-gray-200 text-gray-700'}`}
              >
                {orderStatus}
              </span>

              <select
                value={orderStatus}
                onChange={handleStatusChange}
                className="block mt-2 w-full sm:w-2/3 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">Ordered Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">No items in this order.</p>
        ) : (
          <div className="space-y-6">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-4">
                <img
                  src={item.images}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md border"
                />
                <div className="flex-1 space-y-1 text-gray-700">
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                  <p className="text-sm">Price: ₹{item.price}</p>
                  <p className="text-sm">Delivery: ₹{item.deliveryCharge}</p>
                </div>
                <div className="text-right font-semibold text-lg text-gray-800 sm:min-w-[80px]">
                  ₹{item.price * item.quantity + item.deliveryCharge}
                </div>
              </div>
            ))}
            <div className="text-right text-xl font-bold text-gray-900 pt-4 border-t">
              Total: ₹{calculateTotal()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
