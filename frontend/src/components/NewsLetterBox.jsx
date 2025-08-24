import { useState } from 'react';

const NewsLetterBox = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (!email) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setStatus('Subscribed successfully! 🎉');
    setEmail('');
  };

  return (
    <div className="mt-10 text-center">
      <p className="text-2xl font-medium text-gray-800">
        Unlock 20% Off | Subscribe Today!
      </p>
      <p className="mt-3 text-gray-500">
        Don't miss out—unlock your savings now by subscribing below!
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="flex items-center w-full gap-3 px-3 py-2 mt-6 border border-gray-300 rounded sm:w-1/2 mx-auto"
      >
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hello@gmail.com"
          required
          className="w-full px-2 py-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 text-sm font-medium text-white bg-black rounded hover:bg-gray-800 transition"
        >
          SUBSCRIBE
        </button>
      </form>

      {status && (
        <p className="mt-2 text-sm text-green-600">{status}</p>
      )}
    </div>
  );
};

export default NewsLetterBox;
