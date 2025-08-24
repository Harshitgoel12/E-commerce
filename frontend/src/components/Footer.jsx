import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import yuki from "../assets/yuki.svg"
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f9f4ef] text-gray-800 border-t border-gray-200" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Logo & Description */}
        <div className="lg:col-span-2">
          <Link to="/" aria-label="Go to Home">
            <img
              src={yuki}
              className="w-60 h-40 font-bold mb-5"
              alt="YukiClothes Jewellery logo"
            />
          </Link>
          <p className="text-base text-gray-600 max-w-md leading-relaxed">
            Discover timeless elegance with <strong>YukiLux Jewellery</strong>. 
            From modern styles to classic traditions, our pieces shine with craftsmanship and love.
          </p>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Footer Navigation">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Explore</h3>
          <ul className="space-y-3 text-gray-600">
            <li>
              <Link to="/" className="hover:text-pink-600 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-pink-600 transition-colors duration-200">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-pink-600 transition-colors duration-200">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-pink-600 transition-colors duration-200">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-pink-600" />
              <a
                href="tel:+919876543210"
                className="hover:text-pink-600 transition-colors duration-200"
              >
                +91-98765-43210
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-pink-600" />
              <a
                href="mailto:support@trendifyjewels.com"
                className="hover:text-pink-600 transition-colors duration-200"
              >
                support@trendifyjewels.com
              </a>
            </li>
          </ul>

          <div className="flex gap-4 mt-6 text-xl text-gray-500">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-pink-600">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-600">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-pink-600">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#f0ebe5] border-t border-gray-300 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-700 gap-4">
          <p>
            © {new Date().getFullYear()} <strong>YukiLux Jewellery</strong>. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link to="/privacy-policy" className="hover:text-pink-600 transition">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-pink-600 transition">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:text-pink-600 transition">Return & Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
