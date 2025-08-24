import Title from "../components/Title";
import NewsLetterBox from "../components/NewsLetterBox";
import contact from "../assets/contact.png";

const Contact = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <div className="px-4 md:px-16 lg:px-32 pt-20 border-t border-gray-200 text-center">
        <Title text1="CONTACT" text2="US" />
        <p className="text-gray-500 mt-2 text-sm max-w-2xl mx-auto">
          Need help picking the perfect piece or tracking your order? We're always here for you.
        </p>
      </div>
      <div className="px-4 md:px-16 lg:px-32 mt-16 mb-28 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="w-full">
          <img
            src={contact}
            alt="Visit yukiLux Boutique"
            className="rounded-3xl w-full h-full object-cover shadow-xl"
          />
        </div>
        <div className="flex flex-col gap-8 text-[16px]">
          <section>
            <h3 className="text-2xl font-semibold text-pink-700 mb-2">Visit Our Boutique</h3>
            <address className="not-italic text-gray-600 leading-relaxed">
              yukiLux Boutique <br />
              354 Artisan Lane <br />
              Los Angeles, CA 90210, USA
            </address>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-pink-700 mb-2">Get in Touch</h3>
            <p className="text-gray-600">
              Phone:{" "}
              <a
                href="tel:+1558669447"
                className="text-pink-600 font-medium hover:underline"
              >
                (+1) 558-669-447
              </a>
              <br />
              Email:{" "}
              <a
                href="mailto:contact@yukilux.com"
                className="text-pink-600 font-medium hover:underline"
              >
                contact@yukilux.com
              </a>
            </p>
          </section>
          <section>
            <h3 className="text-2xl font-semibold text-pink-700 mb-2">Store Hours</h3>
            <p className="text-gray-600">
              Mon – Fri: 10:00 AM – 7:00 PM <br />
              Saturday: 11:00 AM – 5:00 PM <br />
              Sunday: Closed
            </p>
          </section>

         
        </div>
      </div>
      <div className="px-4 md:px-16 lg:px-32 mb-28">
        <h3 className="text-2xl font-semibold text-center mb-6 text-pink-700">
          Find Us on the Map
        </h3>
        <div className="w-full h-96 overflow-hidden rounded-2xl shadow-lg">
          <iframe
            title="yukiLux Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.912583728892!2d-118.411732!3d34.103003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bb91f8eb9b3d%3A0x6a741b8b45e4e881!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <div className="px-4 md:px-16 lg:px-32 mb-24">
        <NewsLetterBox />
      </div>
      <p className="text-center text-gray-400 text-sm pb-8">
        © {new Date().getFullYear()} yukiLux. All rights reserved.
      </p>
    </div>
  );
};

export default Contact;
