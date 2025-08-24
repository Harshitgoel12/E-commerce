import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef(Array(6).fill().map(() => React.createRef()));
  const navigate = useNavigate();

  const SignupData = useSelector((state) => state.singupData?.Data);

  useEffect(() => {
    if (!SignupData?.Email || !SignupData?.Name || !SignupData?.Password) {
      navigate('/signup');
    }
  }, [SignupData, navigate]);

  const handleInputChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError('');
      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
     const resp = await api.post("/Verify-OTP", {
  otp: fullOtp,
  Email: SignupData.Email,
  Name: SignupData.Name,
  Password: SignupData.Password,
});

      if (resp.data.success === false) {
        throw new Error(resp.data.message);
      }

      toast.success("OTP verified Successfully", {
        position: "top-center"
      });
      navigate('/login');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      toast.error("Invalid OTP", {
        position: "top-center"
      });
      setOtp(['', '', '', '', '', '']);
      inputRefs.current?.[0]?.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!SignupData?.Email) return;
    setResendDisabled(true);
    setResendTimer(30);
    setResendLoading(true);

    try {
      const res = await api.post(
        '/resend-otp',
        { email: SignupData.Email },
      );
      console.log(res)
toast.success('OTP resent successfully');
console.log(res)
      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      
    } catch (err) {
      setError('Failed to resend OTP. Please try again later.');
      toast.error("Failed To Resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (resendDisabled && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }

    return () => clearInterval(timer);
  }, [resendDisabled, resendTimer]);

  useEffect(() => {
    inputRefs.current?.[0]?.current?.focus();
  }, []);

  const maskEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    return `${user[0]}***@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ef] to-[#fdeae4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Your Identity
          </h2>
          <p className="text-gray-600">
            Enter the OTP sent to <strong>{maskEmail(SignupData?.Email)}</strong>
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-center md:space-x-2 space-x-1">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs.current[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-label={`OTP digit ${index + 1}`}
                className="md:w-12 w-10 md:h-14 h-10 text-2xl text-center font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                disabled={isLoading}
              />
            ))}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={isLoading}
          className={`w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              Verifying...
              <svg
                className="animate-spin h-5 w-5 ml-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </>
          ) : (
            <>
              Verify OTP
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </button>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOtp}
              disabled={resendDisabled || resendLoading}
              className={`text-pink-600 font-medium ${resendDisabled || resendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
            >
              {resendLoading ? (
                <>
                  Sending...
                  <svg
                    className="animate-spin h-4 w-4 ml-1 inline text-pink-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : resendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </p>

          <a
            href="/login"
            className="inline-flex items-center mt-2 text-pink-600 font-medium hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
