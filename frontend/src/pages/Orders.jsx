import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currency = '₹';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
       const token =  localStorage.getItem("Token")?JSON.parse(localStorage.getItem("Token")):null;
const res = await api.get("/myorders", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        toast.error("Failed To Load the Data",{
           position:"top-center"
        })
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="pt-16 border-t bg-white min-h-screen px-4 md:px-10">
      <div className="text-2xl mb-6">
        <Title text1="YOUR" text2="ORDERS" />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Amount:</strong> {currency}{order.amount?.toFixed(2)}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              {order.items?.map((item, itemIndex) => (
                <div
                  key={item._id || itemIndex}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t pt-4 mt-2"
                >
                  <div className="flex items-start gap-4 text-sm">
                    <img
                      src={item.images}
                      alt={item.name}
                      className="w-20 h-20 rounded-md object-cover border"
                    />
                    <div>
                      <p className="text-base font-semibold text-gray-800">{item.name}</p>
                      <div className="flex flex-wrap gap-4 text-gray-600">
                        <span>
                          Price:&nbsp;
                          <strong>{currency}{item.price?.toFixed(2)}</strong>
                        </span>
                        <span>Qty: {item.quantity}</span>
                        <span>
                          Delivery: <strong>{currency}{item.deliveryCharge?.toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex items-center gap-2 text-sm text-yellow-600 font-medium">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                      <span>{order.status}</span>
                    </div>
                    <button
                      onClick={() => navigate("/Orders/TrackOrder", { state: { orderId: order._id } })}
                      className="px-4 py-2 text-sm border border-gray-400 hover:border-black rounded-md transition"
                    >
                      TRACK ORDER
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
