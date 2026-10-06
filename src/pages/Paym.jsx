import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';

const Paym = () => {
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [plan, setPlan] = useState('7days');
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const plans = {
    '7days': { label: '7 Days', price: 199 },
    '15days': { label: '15 Days', price: 399 },
    '30days': { label: '30 Days', price: 599 },
    '3months': { label: '3 Months', price: 1499 },
    '5months': { label: '5 Months', price: 2499 },
    '1year': { label: '1 Year', price: 4499 },
  };

  const selectedPlan = plans[plan];
  const gst = (selectedPlan.price * 0.18).toFixed(2);
  const total = (selectedPlan.price + parseFloat(gst)).toFixed(2);

  const handlePayment = async () => {
    setError('');
    if (paymentMethod === 'upi' && upiId.trim() === '') {
      setError('Please enter UPI ID.');
      return;
    }
    setProcessing(true);
    try {
      // 1. Create payment on server
      const createRes = await paymentService.createPayment({
        plan,
        paymentMethod,
        upiId: paymentMethod === 'upi' ? upiId : null,
      });
      if (!createRes.success) throw new Error(createRes.message);

      const createdOrderId = createRes.data.order_id;

      // 2. In a real app: call your payment gateway here (Razorpay/Stripe).
      // For now, we simulate a successful gateway response.
      const fakePaymentId = 'PAY' + Date.now().toString().slice(-8);
      const fakeTxnId = 'TXN' + Date.now().toString().slice(-6);

      const completeRes = await paymentService.completePayment({
        orderId: createdOrderId,
        paymentId: fakePaymentId,
        transactionId: fakeTxnId,
      });

      if (!completeRes.success) throw new Error(completeRes.message);

      setOrderId(createdOrderId);
      setPaymentId(fakePaymentId);
      setPaymentSuccess(true);

      // Refresh user so premium status updates globally
      try { await fetchCurrentUser(); } catch (_) {}

      setTimeout(() => setPaymentSuccess(false), 6000);
    } catch (e) {
      setError(e.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-6 relative">
        {paymentSuccess && (
          <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded shadow-lg z-50">
            <div className="font-bold text-lg">✅ Payment Successful</div>
            <div>📦 <b>Plan:</b> {selectedPlan.label}</div>
            <div>🧾 <b>Order ID:</b> {orderId}</div>
            <div>💳 <b>Payment ID:</b> {paymentId}</div>
            <div>💰 <b>Total Paid:</b> ₹{total}</div>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-black bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
        >
          ← Back
        </button>

        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md mt-10">
          <div className="bg-black text-white text-center py-2 text-lg font-semibold">
            Pay Membership
          </div>

          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            <h2 className="text-xl font-semibold mb-4">CHOOSE A PAYMENT METHOD *</h2>
            <div className="flex gap-6 mb-6 flex-col md:flex-row">
              <label className="flex-1 border rounded-md p-4 cursor-pointer">
                <input type="radio" name="paymentMethod" value="credit" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} className="mr-2" />
                <span className="font-medium">Credit Card</span>
              </label>
              <label className="flex-1 border rounded-md p-4 cursor-pointer">
                <input type="radio" name="paymentMethod" value="debit" checked={paymentMethod === 'debit'} onChange={() => setPaymentMethod('debit')} className="mr-2" />
                <span className="font-medium">Debit Card</span>
              </label>
              <label className="flex-1 border rounded-md p-4 cursor-pointer">
                <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="mr-2" />
                <span className="font-medium">PayPal</span>
              </label>
              <label className="flex-1 border rounded-md p-4 cursor-pointer">
                <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-2" />
                <span className="font-medium">UPI</span>
              </label>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">MEMBERSHIP PLAN</h3>
              <label className="block font-medium mb-1">Select Plan</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="border rounded-md p-2 w-full mb-2">
                {Object.entries(plans).map(([key, val]) => (
                  <option key={key} value={key}>{val.label} - ₹{val.price}</option>
                ))}
              </select>
              <div className="border rounded-md p-2 mb-1">
                ₹{selectedPlan.price.toFixed(2)} + 18% GST (₹{gst})
              </div>
              <div className="font-bold mt-1">
                Total <span className="float-right">₹{total}</span>
              </div>
            </div>

            {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  {paymentMethod === 'credit' ? 'CREDIT' : 'DEBIT'} CARD INFORMATION
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Card Number" className="border p-2 rounded w-full" />
                  <input type="text" placeholder="Name on Card" className="border p-2 rounded w-full" />
                  <input type="text" placeholder="Expiry Date (MM/YY)" className="border p-2 rounded w-full" />
                  <input type="text" placeholder="CVV" className="border p-2 rounded w-full" />
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">UPI PAYMENT</h3>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g., name@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={processing || paymentSuccess}
              className={`bg-black text-white px-6 py-2 rounded transition ${
                (processing || paymentSuccess) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
            >
              {processing ? 'Processing...' : paymentSuccess ? 'Paid' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Paym;










// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Footer from '../components/Footer';

// const Paym = () => {
//   const navigate = useNavigate();

//   const [paymentMethod, setPaymentMethod] = useState('credit');
//   const [plan, setPlan] = useState('7days');
//   const [upiId, setUpiId] = useState('');
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [orderId, setOrderId] = useState('');
//   const [paymentId, setPaymentId] = useState('');

//   const plans = {
//     '7days': { label: '7 Days', price: 199 },
//     '15days': { label: '15 Days', price: 399 },
//     '30days': { label: '30 Days', price: 599 },
//     '3months': { label: '3 Months', price: 1499 },
//     '5months': { label: '5 Months', price: 2499 },
//     '1year': { label: '1 Year', price: 4499 },
//   };

//   const selectedPlan = plans[plan];
//   const gst = (selectedPlan.price * 0.18).toFixed(2);
//   const total = (selectedPlan.price + parseFloat(gst)).toFixed(2);

//   const generateOrderId = () => {
//     const datePart = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 12);
//     const randomPart = Math.floor(1000 + Math.random() * 9000);
//     return `ORD${datePart}${randomPart}`;
//   };

//   const generatePaymentId = () => {
//     return 'PAY' + Date.now().toString().slice(-8);
//   };

//   const handlePayment = () => {
//     if (paymentMethod === 'upi' && upiId.trim() === '') {
//       alert("Please enter UPI ID.");
//       return;
//     }

//     const newOrderId = generateOrderId();
//     const newPaymentId = generatePaymentId();

//     setOrderId(newOrderId);
//     setPaymentId(newPaymentId);
//     setPaymentSuccess(true);
//   };

//   useEffect(() => {
//     if (paymentSuccess) {
//       const timer = setTimeout(() => setPaymentSuccess(false), 6000);
//       return () => clearTimeout(timer);
//     }
//   }, [paymentSuccess]);

//   return (
//     <div>
//       <div className="min-h-screen bg-gray-100 p-6 relative">
//         {paymentSuccess && (
//           <div className="fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded shadow-lg z-50">
//             <div className="font-bold text-lg">✅ Payment Successful</div>
//             <div>📦 <b>Plan:</b> {selectedPlan.label}</div>
//             <div>🧾 <b>Order ID:</b> {orderId}</div>
//             <div>💳 <b>Payment ID:</b> {paymentId}</div>
//             <div>💰 <b>Total Paid:</b> ₹{total}</div>
//           </div>
//         )}

//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-4 left-4 text-black bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100"
//         >
//           ← Back
//         </button>

//         <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md mt-10">
//           <div className="bg-black text-white text-center py-2 text-lg font-semibold">
//             Pay Membership
//           </div>

//           <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4">CHOOSE A PAYMENT METHOD *</h2>
//             <div className="flex gap-6 mb-6 flex-col md:flex-row">
//               {/* Credit Card */}
//               <label className="flex-1 border rounded-md p-4 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="credit"
//                   checked={paymentMethod === 'credit'}
//                   onChange={() => setPaymentMethod('credit')}
//                   className="mr-2"
//                 />
//                 <span className="font-medium">Credit Card</span>
//                 <div className="flex gap-2 mt-2">
//                   <img src="https://img.icons8.com/color/48/000000/visa.png" alt="visa" className="h-6" />
//                   <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="mastercard" className="h-6" />
//                   <img src="https://img.icons8.com/color/48/000000/amex.png" alt="amex" className="h-6" />
//                 </div>
//               </label>

//               {/* Debit Card */}
//               <label className="flex-1 border rounded-md p-4 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="debit"
//                   checked={paymentMethod === 'debit'}
//                   onChange={() => setPaymentMethod('debit')}
//                   className="mr-2"
//                 />
//                 <span className="font-medium">Debit Card</span>
//                 <div className="mt-2 flex gap-2">
//                   <img src="https://img.icons8.com/color/48/000000/rupay.png" alt="rupay" className="h-6" />
//                   <img src="https://img.icons8.com/color/48/000000/maestro.png" alt="maestro" className="h-6" />
//                 </div>
//               </label>

//               {/* PayPal */}
//               <label className="flex-1 border rounded-md p-4 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="paypal"
//                   checked={paymentMethod === 'paypal'}
//                   onChange={() => setPaymentMethod('paypal')}
//                   className="mr-2"
//                 />
//                 <span className="font-medium">PayPal</span>
//                 <div className="mt-2">
//                   <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="paypal" className="h-6" />
//                 </div>
//               </label>

//               {/* UPI */}
//               <label className="flex-1 border rounded-md p-4 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="paymentMethod"
//                   value="upi"
//                   checked={paymentMethod === 'upi'}
//                   onChange={() => setPaymentMethod('upi')}
//                   className="mr-2"
//                 />
//                 <span className="font-medium">UPI</span>
//                 <div className="mt-2 flex gap-4 items-center">
//                   {/* Google Pay SVG */}
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28">
//                     <path fill="#4285F4" d="M24 9.5c3.35 0 6.38 1.29 8.72 3.39l6.54-6.54C34.68 2.42 29.63 0 24 0 14.79 0 6.98 5.48 3.25 13.42l7.6 5.9C12.8 12.22 17.89 9.5 24 9.5z" />
//                     <path fill="#3ea834ff" d="M46.73 24.57c0-1.6-.14-3.13-.4-4.57H24v9.2h12.73c-.55 2.93-2.26 5.42-4.73 7.08l7.2 5.59c4.2-3.88 6.63-9.6 6.63-16.3z" />
//                     <path fill="#FBBC05" d="M10.85 28.5c-.7-2.08-1.08-4.3-1.08-6.5 0-2.2.38-4.42 1.08-6.5l-7.6-5.9C1.18 13.78 0 18.75 0 24s1.18 10.22 3.25 14.4l7.6-5.9z" />
//                     <path fill="#EA4335" d="M24 48c6.4 0 11.76-2.1 15.68-5.7l-7.2-5.59c-2.02 1.36-4.63 2.09-8.48 2.09-6.11 0-11.2-2.72-13.15-9.82l-7.6 5.9C6.98 42.52 14.79 48 24 48z" />
//                   </svg>
//                   {/* PhonePe */}
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88" width="28" height="28">
//                     <circle cx="61.44" cy="61.44" r="61.44" fill="#60269E"/>
//                     <path d="M39.62 26.66h16.97v10.57h10.89v11.68h-10.89v2.53c2.77-.3 5.22-.45 7.34-.45 7.41 0 13.04 1.76 16.91 5.27 3.87 3.51 5.81 8.47 5.81 14.88 0 6.64-2.27 11.79-6.81 15.43-4.54 3.64-11.48 5.46-20.81 5.46-3.05 0-6.02-.2-8.91-.6v-10.36c2.84.38 5.43.57 7.77.57 8.71 0 13.06-2.86 13.06-8.57 0-2.52-.8-4.52-2.39-5.99-1.59-1.48-4.39-2.21-8.4-2.21-1.63 0-3.48.12-5.54.37v26.57H39.62V26.66zm20.03 12.93v6.84h-7.06V39.6h-3.41v-6.84h10.47z" fill="#fff"/>
//                   </svg>
//                 </div>
//               </label>
//             </div>

//             {/* Membership Plan Info */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">MEMBERSHIP PLAN</h3>
//               <label className="block font-medium mb-1">Select Plan</label>
//               <select
//                 value={plan}
//                 onChange={(e) => setPlan(e.target.value)}
//                 className="border rounded-md p-2 w-full mb-2"
//               >
//                 {Object.entries(plans).map(([key, val]) => (
//                   <option key={key} value={key}>
//                     {val.label} - ₹{val.price}
//                   </option>
//                 ))}
//               </select>
//               <div className="border rounded-md p-2 mb-1">
//                 ₹{selectedPlan.price.toFixed(2)} + 18% GST (₹{gst})
//               </div>
//               <div className="font-bold mt-1">
//                 Total <span className="float-right">₹{total}</span>
//               </div>
//             </div>

//             {/* Card Fields */}
//             {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">
//                   {paymentMethod === 'credit' ? 'CREDIT' : 'DEBIT'} CARD INFORMATION
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <input type="text" placeholder="Card Number" className="border p-2 rounded w-full" />
//                   <input type="text" placeholder="Name on Card" className="border p-2 rounded w-full" />
//                   <input type="text" placeholder="Expiry Date (MM/YY)" className="border p-2 rounded w-full" />
//                   <input type="text" placeholder="CVV" className="border p-2 rounded w-full" />
//                 </div>
//               </div>
//             )}

//             {/* UPI Input */}
//             {paymentMethod === 'upi' && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-2">UPI PAYMENT</h3>
//                 <input
//                   type="text"
//                   placeholder="Enter UPI ID (e.g., name@upi)"
//                   value={upiId}
//                   onChange={(e) => setUpiId(e.target.value)}
//                   className="border p-2 rounded w-full"
//                 />
//               </div>
//             )}

//             {/* Pay Button */}
//             <button
//               onClick={handlePayment}
//               disabled={paymentSuccess}
//               className={`bg-black text-white px-6 py-2 rounded transition ${
//                 paymentSuccess ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
//               }`}
//             >
//               {paymentSuccess ? 'Paid' : 'Pay Now'}
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Paym;
