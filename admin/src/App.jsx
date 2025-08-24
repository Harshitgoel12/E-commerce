import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderDetails from "./pages/OrderDetails";
import SellerDashboard from "./pages/SellerDashboard";
import ProtectedRoute from "./pages/ProtectedRoute"; // 👈 import

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const currency = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

const App = () => {
  return (
    <div className="min-w-screen min-h-screen w-full bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />

      <>
        <Navbar />
        <hr />
        <div className="flex w-full">
          <Sidebar />
          <div className="flex-1 p-4 md:p-8 overflow-auto">
            <Routes>
              {/* 🔐 Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <Add />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/list"
                element={
                  <ProtectedRoute>
                    <List />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />

              {/* Public */}
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </>
    </div>
  );
};

export default App;
