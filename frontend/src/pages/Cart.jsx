import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { updateQuantity, removeFromCart } from '../slices/cartSlice';

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    setCartData(cartItems || []);
  }, [cartItems]);

  const totalPages = Math.ceil(cartData.length / itemsPerPage);
  const paginatedData = cartData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleQuantityChange = (_id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ _id, quantity: newQty }));
  };

  const handleRemove = (_id) => {
    dispatch(removeFromCart(_id));
  };

  const isCartEmpty = cartData.length === 0;

  return (
    <div className="w-11/12 mx-auto pt-14 px-4 max-w-7xl">
      <div className="mb-6 text-3xl font-semibold">
        <Title text1="YOUR" text2="CART" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1 space-y-4">
          {isCartEmpty ? (
            <div className="text-center py-16 text-gray-500">
              <img
                src={assets.empty_cart}
                alt="Empty Cart"
                className="mx-auto w-24 mb-4"
              />
              <p>Your cart is empty. Start shopping!</p>
              <button
                onClick={() => navigate('/collection')}
                className="mt-4 px-5 py-2 border rounded bg-black text-white hover:bg-gray-800 transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            paginatedData.map((item, index) => (
              <div
                key={item._id || index}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition bg-white"
              >
                <img
                  className="w-24 h-24 object-cover rounded-lg border"
                  src={item.images?.[0]}
                  alt={item.name}
                />
                <div className="flex-1 w-full">
                  <div className="flex justify-between w-full items-start">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <img
                      onClick={() => handleRemove(item._id)}
                      src={assets.bin_icon}
                      alt="Remove"
                      title="Remove"
                      className="w-5 cursor-pointer opacity-70 hover:opacity-100 transition"
                    />
                  </div>

                  <div className="mt-2 text-sm text-gray-600 flex items-center gap-3 flex-wrap">
                    <span className="bg-gray-100 text-xs px-2 py-1 rounded border">
                      {item.size}
                    </span>
                    <span className="font-medium text-black">
                      ₹{parseFloat(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center border rounded overflow-hidden shadow-sm">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xl font-bold text-black"
                        title="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 text-sm font-semibold text-center bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xl font-bold text-black"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

         
          {!isCartEmpty && totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page ? 'bg-black text-white' : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

       
        <div className="w-full lg:w-[400px] lg:sticky top-20 h-fit bg-white border border-gray-200 shadow-md p-5 rounded-lg">
          <CartTotal />

          <button
            onClick={() => navigate('/place-order')}
            className={`px-8 py-3 mt-6 text-sm text-white bg-black hover:bg-gray-800 w-full rounded transition ${
              isCartEmpty ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isCartEmpty}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
