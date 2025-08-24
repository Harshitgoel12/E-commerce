import React from 'react';
import Title from '../components/Title';
import { FaShieldAlt, FaGem, FaHeadset } from 'react-icons/fa';
import NewsLetterBox from '../components/NewsLetterBox';
import aboutImage from "../assets/aboutImage.jpg";

const About = () => {
  const cards = [
    {
      icon: <FaShieldAlt className="text-xl text-rose-500" />,
      title: "Certified Quality",
      text: "Our jewellery is made with hallmarked gold, certified diamonds, and ethically sourced stones. Every piece is authenticity guaranteed.",
    },
    {
      icon: <FaGem className="text-xl text-rose-500" />,
      title: "Elegant Craftsmanship",
      text: "We blend modern design with age-old techniques. Each piece tells a story — handcrafted by skilled artisans who cherish perfection.",
    },
    {
      icon: <FaHeadset className="text-xl text-rose-500" />,
      title: "Trustworthy Support",
      text: "From guidance to after-sales service, we stand beside you at every step. Your trust is our most valued gem.",
    },
  ];

  return (
    <div className="px-4 md:px-16 lg:px-32">
      <div className="pt-12 text-center border-t">
        <Title text1="ABOUT" text2="US" />
      </div>
      <div className="grid md:grid-cols-2 gap-8 items-start my-20">
        <img
          src={aboutImage}
          alt="About YukiLux"
          className="w-full max-h-[640px] rounded-3xl object-cover shadow-xl hover:scale-105 transition-transform duration-500"
        />

        <div className="flex flex-col justify-start gap-6 text-base text-gray-700 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-gray-900">YukiLux Jewellery</span>, where timeless elegance meets modern artistry. Each piece is crafted with passion and precision, designed to elevate your beauty and confidence.
          </p>
          <p>
            We believe jewellery is more than an accessory — it's a symbol of love, legacy, and identity. From daily elegance to milestone moments, YukiLux is here to make your story unforgettable.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Our Mission</h3>
            <p>
              To celebrate individuality and heritage through exquisite craftsmanship and unique designs. We strive to deliver jewellery that inspires and empowers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Our Vision</h3>
            <p>
              To become a globally trusted brand known for beauty, craftsmanship, and customer delight — enriching lives through meaningful jewellery.
            </p>
          </div>
        </div>
      </div>
      <div className="py-10 text-center">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="grid gap-6 mb-20 md:grid-cols-3">
        {cards.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-start gap-4 px-6 py-10 bg-[#fdf8f3] border rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-3 bg-white border rounded-full shadow-sm">{item.icon}</div>
            <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
      <NewsLetterBox />
    </div>
  );
};

export default About;
