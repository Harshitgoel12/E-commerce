import { useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import yukiLux from "../assets/yuki.svg"
import { toast } from 'react-toastify';
import api from '../api/axios';

const PlaceOrder = () => { 
   const RAZORPAY_KEY_ID= import.meta.env.VITE_RAZORPAY_KEY_ID;
   console.log(RAZORPAY_KEY_ID)
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const subTotal = useSelector((state) => state.cart.subTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    mobile: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const validateInputs = () => {
    const { email, mobile } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

    if (!emailRegex.test(email)) return 'Invalid email address';
    if (!mobileRegex.test(mobile)) return 'Invalid mobile number';
    return ''
  };

  const handlePlaceOrder = async () => {
    setError('');
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    for (const key in form) {
      if (!form[key]) {
        setError('Please fill all required fields.');
        return;
      }
    }

    setLoading(true);

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      setError('Failed to load Razorpay SDK.');
      setLoading(false);
      return;
    }

    try {
      const token=localStorage.getItem("Token")?JSON.parse(localStorage.getItem("Token")):null;
      const { data } = await api.post("/payment/create-order", {
  amount: subTotal * 100,
  user: form,
  token
});
      const options = {
        key: RAZORPAY_KEY_ID,
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        name: 'YukiLux',
        description: 'Order Payment',
        image: yukiLux,
        handler: async function (response) {
          try {
           await api.post("/payment/verify", {
  ...response,
  user: form,
  amount: data.amount / 100,
  token,
  items: cartItems,
});
            toast.success("Payment Verified Successfully",{
              position:"top-center"
            });
            navigate('/orders');
          } catch (err) {
            console.error('Verification Error:', err);
            setError('Payment verification failed.');
            toast.error("Payment Verification Failed",{
              position:"top-center"
            })
          }
        },
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.mobile,
        },
        notes: {
          address: `${form.address}, ${form.city}, ${form.state}, ${form.zip}, ${form.country}`,
        },
        theme: {
          color: '#000',
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled.');
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Order Error:', err);
      setError('Order initiation failed.');
      toast.error("Order initialtion failed",{
        position:"top-center"
      })
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] border-t px-4 sm:px-10 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6 sm:p-10 space-y-8">
          <div>
            <Title text1="DELIVERY" text2="INFORMATION" />
            <p className="text-base text-gray-500 mt-1">
              Please fill in your details to receive your order.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <LabeledInput label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
            <LabeledInput label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>

          <LabeledInput label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} required />
          <LabeledInput label="Street Address" name="address" value={form.address} onChange={handleChange} required />

          <div className="grid grid-cols-2 gap-6">
            <LabeledInput label="City" name="city" value={form.city} onChange={handleChange} required />
            <LabeledInput label="State" name="state" value={form.state} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <LabeledInput label="Zip Code" name="zip" type="number" value={form.zip} onChange={handleChange} required />
            <LabeledInput label="Country" name="country" value={form.country} onChange={handleChange} required />
          </div>

          <LabeledInput label="Mobile Number" name="mobile" type="tel" value={form.mobile} onChange={handleChange} required />

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <CartTotal />
          </div>

          <div className="text-right">
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              aria-busy={loading}
              aria-disabled={loading}
              className={`bg-black text-white w-full py-4 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all shadow-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LabeledInput = ({ label, name, type = 'text', value, onChange, required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm lg:text-base font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      required={required}
      onChange={onChange}
      maxLength={name === 'zip' ? 6 : undefined}
      onInput={name === 'zip' ? (e) => {
        if (e.target.value.length > 6) {
          e.target.value = e.target.value.slice(0, 6);
        }
      } : undefined}
      className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-black transition bg-white shadow-sm"
    />
  </div>
);

export default PlaceOrder;
