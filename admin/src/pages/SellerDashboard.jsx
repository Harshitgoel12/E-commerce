// SellerDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timeFilters = ["month", "year"];

const SellerDashboard = () => {
  const [selectedRange, setSelectedRange] = useState("month");
  const [stats, setStats] = useState({ totalSales: 0, orderCount: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/dashboard/sales?range=${selectedRange}`,
          { withCredentials: true }
        );

        const data = res?.data?.data;
        if (data) {
          setStats({
            totalSales: data.totalSales || 0,
            orderCount: data.orderCount || 0,
          });
          setChartData(data.sales || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setStats({ totalSales: 0, orderCount: 0 });
        setChartData([]);
      }
    };

    fetchData();
  }, [selectedRange]);

  const downloadCSV = () => {
    const csvContent = [
      ["Date", "Sales", "Orders"],
      ...chartData.map((item) => [item.label, item.totalSales, item.orderCount]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sales_${selectedRange}.csv`;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Seller Sales Dashboard</h2>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {timeFilters.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`px-4 py-2 rounded-full text-sm capitalize shadow-sm transition-all duration-200 ${
              selectedRange === range
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {range}
          </button>
        ))}
        <button
          onClick={downloadCSV}
          className="ml-auto px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-blue-100 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600">Total Sales</h3>
          <p className="text-2xl font-bold text-blue-700">
            ₹{Number(stats.totalSales).toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg text-center">
          <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
          <p className="text-2xl font-bold text-green-700">{stats.orderCount}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSales" fill="#8884d8" name="Sales (₹)" />
          <Bar dataKey="orderCount" fill="#82ca9d" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SellerDashboard;
