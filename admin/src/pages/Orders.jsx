import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/orders",{
          withCredentials:true
        });
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    }
    fetchData();
  }, []);

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">All Orders</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm text-left bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Qty</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => {
              const item = order.items[0];
              return (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <td className="py-2 px-4 flex items-center gap-3">
                    <img
                      src={item.images}
                      alt={item.name}
                      className="w-10 h-10 rounded object-cover border"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-2 px-4">
                    {order.user.firstName} {order.user.lastName}
                  </td>
                  <td className="py-2 px-4">{order.user.email}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">₹{order.amount}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {currentOrders.map((order) => {
          const item = order.items[0];
          return (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="bg-white p-4 rounded shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={item.images}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover border"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm">
                <strong>Customer:</strong> {order.user.firstName} {order.user.lastName}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {order.user.email}
              </p>
              <p className="text-sm">
                <strong>Amount:</strong> ₹{order.amount}
              </p>
              <p className="text-sm">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-100 text-blue-800 font-semibold"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrdersList;
