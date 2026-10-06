import React, { useState } from 'react';
import Footer from '../components/Footer';
import { api } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      const res = await api.post('/contact', formData);
      if (res.success) {
        setStatus('success');

        // Also offer WhatsApp
        const phone = '+919040170727';
        const message = encodeURIComponent(
          `Hello! I need help with FirstMarriage.com.\n\n` +
          `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Message: ${formData.message}`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');

        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
        <img src="/image/s16.png" alt="Customer Support" className="w-full max-w-sm h-auto rounded-xl mb-6" />
        <h1 className="text-3xl font-bold text-center mb-2 text-red-700">Contact Us</h1>
        <p className="text-center text-gray-800 mb-6">
          We're here to help! Feel free to reach out to us with any questions or concerns.
        </p>

        {status === 'success' && (
          <div className="w-full p-3 mb-4 rounded bg-green-100 text-green-700">
            Message sent successfully. We'll be in touch.
          </div>
        )}
        {status === 'error' && (
          <div className="w-full p-3 mb-4 rounded bg-red-100 text-red-700">
            Failed to send message. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Your Message</label>
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-900 text-white font-semibold py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'SENDING...' : 'SUBMIT'}
          </button>
        </form>

        <div className="bg-red-900 text-white p-6 rounded-lg mt-8 w-full max-w-md">
          <h2 className="text-lg font-bold mb-2 text-red-600">Contact Information</h2>
          <p><strong>Address:</strong> BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007</p>
          <p><strong>Phone:</strong> +91-9040170727</p>
          <p><strong>Email:</strong> support@firstmarriage.online</p>
          <p><strong>Working Hours:</strong> Mon-Fri: 9 AM - 6 PM</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;



// import React, { useState } from 'react';
// import Footer from '../components/Footer';

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Here you would typically send the form data to your backend
//     console.log('Form submitted:', formData);
    
//     // For now, we'll keep the WhatsApp functionality but include the form data
//     const phone = '+919040170727'; // Replace with your actual WhatsApp number
//     const message = encodeURIComponent(
//       `Hello! I need help with FirstMarriage.com.\n\n` +
//       `Name: ${formData.name}\n` +
//       `Email: ${formData.email}\n` +
//       `Message: ${formData.message}`
//     );
//     window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    
//     // Optionally reset the form after submission
//     setFormData({
//       name: '',
//       email: '',
//       message: ''
//     });
//   };

//   return (
//     <div>
//       <div className="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
//         <img
//           src="/image/s16.png"
//           alt="Customer Support"
//           className="w-full max-w-sm h-auto rounded-xl mb-6"
//         />
//         <h1 className="text-3xl font-bold text-center mb-2 text-red-700">Contact Us</h1>
//         <p className="text-center text-gray-800 mb-6">
//           We're here to help! Feel free to reach out to us with any questions or concerns.
//         </p>

//         <form onSubmit={handleSubmit} className="w-full bg-white shadow-md rounded-lg p-6 space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Your Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Your Name"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Your Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Your Email"
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Your Message</label>
//             <textarea
//               rows="4"
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Your Message"
//               required
//             ></textarea>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-red-900 text-white font-semibold py-2 rounded hover:bg-red-700 transition-colors"
//           >
//             SUBMIT
//           </button>
//         </form>

//         <div className="bg-red-900 text-white p-6 rounded-lg mt-8 w-full max-w-md">
//           <h2 className="text-lg font-bold mb-2 text-red-600">Contact Information</h2>
//           <p><strong>Address:</strong> BMC Bhawani Mall, Saheed Nagar Bhubaneswar, Odisha-751007</p>
//           <p><strong>Phone:</strong> +91-9040170727</p>
//           <p><strong>Email:</strong> support@firstmarriage.online</p>
//           <p><strong>Working Hours:</strong> Mon-Fri: 9 AM - 6 PM</p>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Contact;