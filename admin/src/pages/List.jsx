import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

const List = () => {
    const API_URL=import.meta.env.VITE_API_URL
  const [listProducts, setListProducts] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", description: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const fetchListProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setListProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/product/${id}`,
       {withCredentials:true}
      );
      if (response.data.success) {
        toast.success("Product removed");
        fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while removing");
    }
  };

  const openEdit = (item) => {
    setEditItem(item._id);
    setEditData({
      name: item.name,
      price: item.price,
      description: item.description,
    });
  };

  const cancelEdit = () => {
    setEditItem(null);
  };

  const handleUpdate = async () => {
    try {
      console.log(editItem)
      const response = await axios.put(
        `${API_URL}/product/${editItem}`,
        {  ...editData },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Product updated");
        setEditItem(null);
        fetchListProducts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating");
    }
  };

  useEffect(() => {
    fetchListProducts();
  }, []);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = listProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(listProducts.length / productsPerPage);

  return (
    <div className="w-full bg-blue-100 overflow-x-auto">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-[100px_1.2fr_2.2fr_1fr_1.2fr_1fr_120px] bg-[#fdf7ed] border border-[#e7dac5] rounded-t-md py-3 px-4 text-[#6d4c41] font-semibold text-sm uppercase">
          <span>Image</span>
          <span>Name</span>
          <span>Description</span>
          <span>Category</span>
          <span>Subcategory</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>
        {currentProducts.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[100px_1.2fr_2.2fr_1fr_1.2fr_1fr_120px] items-center gap-2 py-4 px-4 text-sm border-b border-gray-200 hover:bg-[#fff9f2] transition-all duration-150"
          >
            <img
              className="w-12 h-12 object-cover rounded-md border"
              src={item.images[0]}
              alt={item.name}
            />

            {editItem === item._id ? (
              <>
                <input
                  type="text"
                  className="px-2 py-1 border rounded text-sm"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
                <input
                  type="text"
                  className="px-2 py-1 border rounded text-sm"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
                <p className="capitalize text-center">{item.category}</p>
                <p className="capitalize text-center">{item.subCategory}</p>
                <input
                  type="number"
                  className="w-20 px-2 py-1 border rounded text-sm text-center"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                />
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-md transition"
                    title="Save"
                  >
                    <IoCheckmarkOutline className="text-xl" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition"
                    title="Cancel"
                  >
                    <IoCloseOutline className="text-xl" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-gray-600 line-clamp-2 max-h-[3.2rem] overflow-hidden">
                  {item.description}
                </p>
                <p className="capitalize text-center">{item.category}</p>
                <p className="capitalize text-center">{item.subCategory}</p>
                <p className="text-center me-12 font-semibold text-[#9c6b30]">
                  {currency(item.price)}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <MdModeEdit className="text-2xl" />
                  </button>
                  <button
                    onClick={() => removeProduct(item._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <MdDelete className="text-2xl" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        <div className="flex justify-center items-center gap-2 py-4">
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
                  ? "bg-[#fdf7ed] text-[#6d4c41] font-bold"
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
    </div>
  );
};

export default List;
