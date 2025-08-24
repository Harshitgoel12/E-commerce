import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './store.js'
import ShopContextProvider from './context/ShopContext.jsx'

import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import About from './pages/About.jsx'
import Collection from './pages/Collection.jsx'
import Contact from './pages/Contact.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx'
import Orders from './pages/Orders.jsx'
import OtpVerification from './pages/OtpVerification.jsx'
import Home from './pages/Home.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsAndConditions from './components/TermsAndConditions.jsx'
import RefundPolicy from './components/RefundPolicy.jsx'
import TrackOrder from './components/TrackOrder.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "collection",
        element: <Collection />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "product/:productId",
        element: <Product />
      },
      {
        path: "cart",
        element: (
        <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      },
      {
        path: "place-order",
        element: (
          <ProtectedRoute>
            <PlaceOrder />
          </ProtectedRoute>
        )
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "signup",
    element: <Signup />
  },
  {
    path: "/otp-verfication",
    element: <OtpVerification />
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />
  },
  {
    path: "/refund-policy",
    element: <RefundPolicy />
  },
  {
    path: "/orders/trackorder",
    element: (
      <ProtectedRoute>
        <TrackOrder />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
   {/* // <ShopContextProvider>// </ShopContextProvider> */}
      <RouterProvider router={appRouter} />
   
  </Provider>
);
