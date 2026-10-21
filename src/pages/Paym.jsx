import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  BanknotesIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  UserIcon,
  CalendarDaysIcon,
  LockClosedIcon,
  AtSymbolIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const inputBase =
  "w-full border border-yellow-600 rounded-xl bg-white text-black placeholder-yellow-600 " +
  "py-3.5 pl-11 pr-4 shadow-sm transition duration-200 hover:shadow-md " +
  "focus:outline-none focus:ring-4 focus:ring-yellow-600/20";
const labelCls = "block mb-2 text-sm font-semibold text-gray-800";
const stepBadge =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-900 text-white text-sm font-bold shadow";
const planDays = { '7days': 7, '15days': 15, '30days': 30, '3months': 90, '5months': 150, '1year': 365 };
const iconCls = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-600";

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

  // UI-only state for the live card preview
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

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

  const handleCardNumber = (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(d.replace(/(.{4})/g, '$1 ').trim());
  };
  const handleCardExpiry = (e) => {
    let d = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (d.length > 2) d = d.slice(0, 2) + '/' + d.slice(2);
    setCardExpiry(d);
  };
  const handleCardCvv = (e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));

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

  /* ---------- UI-only helpers ---------- */
  const methods = [
    { value: 'credit', label: 'Credit Card', icon: CreditCardIcon },
    { value: 'debit', label: 'Debit Card', icon: BanknotesIcon },
    { value: 'paypal', label: 'PayPal', icon: GlobeAltIcon },
    { value: 'upi', label: 'UPI', icon: DevicePhoneMobileIcon },
  ];
  const validTill = (() => {
    const d = new Date();
    d.setDate(d.getDate() + planDays[plan]);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  })();
  const methodLabel = methods.find(m => m.value === paymentMethod)?.label;
  const disabled = processing || paymentSuccess;

  return (
    <div>
      <style>{`
        @keyframes pmRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        .pm-rise { animation: pmRise .6s ease-out both; }
        .pm-rise-2 { animation: pmRise .6s .12s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .pm-rise, .pm-rise-2 { animation: none; } }
      `}</style>

      <div className="relative overflow-hidden min-h-screen bg-gray-50 px-4 py-10">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-600/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-red-900/10 blur-3xl" />

        {/* Success toast */}
        {paymentSuccess && (
          <div
            role="status"
            className="fixed top-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm bg-white rounded-2xl shadow-2xl border-l-4 border-red-900 p-5"
          >
            <div className="flex items-center gap-2 text-red-800 font-bold text-lg">
              <CheckCircleIcon className="h-6 w-6" />
              Payment Successful
            </div>
            <dl className="mt-3 space-y-1.5 text-sm text-gray-700">
              <div className="flex justify-between gap-4"><dt className="font-semibold">Plan</dt><dd>{selectedPlan.label}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-semibold">Order ID</dt><dd className="break-all text-right">{orderId}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-semibold">Payment ID</dt><dd>{paymentId}</dd></div>
              <div className="flex justify-between gap-4 border-t border-gray-200 pt-2 mt-2"><dt className="font-semibold">Total Paid</dt><dd className="font-bold text-red-800">₹{total}</dd></div>
            </dl>
          </div>
        )}

        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-800 bg-white px-4 py-2 rounded-full shadow hover:shadow-md hover:bg-gray-50 transition focus:outline-none focus:ring-4 focus:ring-yellow-600/20"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          {/* Heading */}
          <div className="pm-rise text-center max-w-2xl mx-auto mt-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-red-700">Pay Membership</h1>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-red-900" />
            <p className="mt-5 text-lg text-gray-700">
              Choose a plan and a payment method to unlock your membership.
            </p>
          </div>

          <div className="pm-rise-2 grid lg:grid-cols-5 gap-8 items-start">

            {/* ---------- Left: choices + details ---------- */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border-t-4 border-red-900 p-8 md:p-10 space-y-10">

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3 rounded-xl bg-red-100 text-red-700 text-sm border border-red-200"
                >
                  <ExclamationCircleIcon className="h-5 w-5 shrink-0 mt-px" />
                  <span>{error}</span>
                </div>
              )}

              {/* Payment method */}
              <section>
                <div className="flex items-start gap-3 mb-5">
                  <span className={stepBadge}>1</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Choose a payment method</h2>
                    <p className="mt-0.5 text-gray-600">Select how you would like to pay.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {methods.map(({ value, label, icon: Icon }) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value)}
                        className="peer sr-only"
                      />
                      <div className="flex flex-col items-center gap-2 rounded-xl border border-yellow-600 bg-white p-4 text-center text-gray-800 shadow-sm transition
                                      hover:shadow-md
                                      peer-focus-visible:ring-4 peer-focus-visible:ring-yellow-600/30
                                      peer-checked:bg-red-900 peer-checked:text-white peer-checked:border-red-900 peer-checked:shadow-lg">
                        <Icon className="h-7 w-7" />
                        <span className="text-sm font-semibold">{label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Membership plan */}
              <section>
                <div className="flex items-start gap-3 mb-5">
                  <span className={stepBadge}>2</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Membership plan</h2>
                    <p className="mt-0.5 text-gray-600">Pick how long you want your membership to last.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(plans).map(([key, val]) => (
                    <label key={key} className="cursor-pointer">
                      <input
                        type="radio"
                        name="plan"
                        value={key}
                        checked={plan === key}
                        onChange={() => setPlan(key)}
                        className="peer sr-only"
                      />
                      <div className="relative rounded-xl border border-yellow-600 bg-white p-4 shadow-sm transition
                                      hover:shadow-md
                                      peer-focus-visible:ring-4 peer-focus-visible:ring-yellow-600/30
                                      peer-checked:border-red-900 peer-checked:ring-2 peer-checked:ring-red-900 peer-checked:bg-red-900/5">
                        {key === '1year' && (
                          <span className="absolute -top-2.5 right-3 rounded-full bg-red-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                            Best value
                          </span>
                        )}
                        {plan === key && (
                          <CheckCircleIcon className="absolute top-3 right-3 h-5 w-5 text-red-900" />
                        )}
                        <p className="text-sm text-gray-600">{val.label}</p>
                        <p className="mt-1 text-2xl font-bold text-red-800">₹{val.price}</p>
                        <p className="mt-1 text-xs text-gray-500">about ₹{Math.round(val.price / planDays[key])} / day</p>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Card details */}
              {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                <section>
                  <div className="flex items-start gap-3 mb-6">
                    <span className={stepBadge}>3</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {paymentMethod === 'credit' ? 'Credit' : 'Debit'} card information
                      </h2>
                      <p className="mt-0.5 text-gray-600">Enter the details exactly as shown on your card.</p>
                    </div>
                  </div>

                  {/* Live card preview */}
                  <div
                    className="relative mx-auto mb-8 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-red-900 to-red-700 p-6 text-white shadow-xl"
                    style={{ aspectRatio: '1.586 / 1' }}
                    aria-hidden="true"
                  >
                    <div className="pointer-events-none absolute -top-14 -right-10 h-44 w-44 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-yellow-600/20" />

                    <div className="relative flex items-center justify-between">
                      <div className="h-9 w-12 rounded-md bg-yellow-600/90 shadow-inner" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                        {paymentMethod === 'credit' ? 'Credit' : 'Debit'}
                      </span>
                    </div>

                    <p className="relative mt-8 text-xl sm:text-2xl font-semibold tracking-[0.16em]">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>

                    <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-white/70">Card holder</p>
                        <p className="truncate text-sm font-semibold uppercase">{cardName || 'Your name'}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] uppercase tracking-widest text-white/70">Expires</p>
                        <p className="text-sm font-semibold">{cardExpiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label htmlFor="cardNumber" className={labelCls}>Card Number</label>
                      <div className="relative">
                        <CreditCardIcon className={iconCls} />
                        <input
                          id="cardNumber"
                          type="text"
                          placeholder="Card Number"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          maxLength={19}
                          value={cardNumber}
                          onChange={handleCardNumber}
                          className={inputBase}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="cardName" className={labelCls}>Name on Card</label>
                      <div className="relative">
                        <UserIcon className={iconCls} />
                        <input
                          id="cardName"
                          type="text"
                          placeholder="Name on Card"
                          autoComplete="cc-name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className={inputBase}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardExpiry" className={labelCls}>Expiry Date</label>
                      <div className="relative">
                        <CalendarDaysIcon className={iconCls} />
                        <input
                          id="cardExpiry"
                          type="text"
                          placeholder="MM/YY"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={handleCardExpiry}
                          className={inputBase}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cardCvv" className={labelCls}>CVV</label>
                      <div className="relative">
                        <LockClosedIcon className={iconCls} />
                        <input
                          id="cardCvv"
                          type="password"
                          placeholder="CVV"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          maxLength={4}
                          value={cardCvv}
                          onChange={handleCardCvv}
                          className={inputBase}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <section>
                  <div className="flex items-start gap-3 mb-5">
                    <span className={stepBadge}>3</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">UPI payment</h2>
                      <p className="mt-0.5 text-gray-600">Enter the UPI ID you want to pay from.</p>
                    </div>
                  </div>
                  <label htmlFor="upiId" className={labelCls}>UPI ID</label>
                  <div className="relative">
                    <AtSymbolIcon className={iconCls} />
                    <input
                      id="upiId"
                      type="text"
                      placeholder="Enter UPI ID (e.g., name@upi)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                </section>
              )}

              {/* PayPal */}
              {paymentMethod === 'paypal' && (
                <section>
                  <div className="flex items-start gap-3">
                    <span className={stepBadge}>3</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">PayPal</h2>
                      <p className="mt-0.5 text-gray-600">PayPal is selected. Review your order and press Pay to continue.</p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* ---------- Right: order summary ---------- */}
            <div className="lg:col-span-2 lg:sticky lg:top-28">
              <div className="relative overflow-hidden bg-red-900 text-white rounded-2xl shadow-xl p-8">
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/5" />
                <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-yellow-600/10" />

                <h3 className="relative text-xl font-bold mb-6">Order summary</h3>

                <dl className="relative space-y-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70">Plan</dt>
                    <dd className="font-semibold">{selectedPlan.label}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70">Valid till</dt>
                    <dd className="font-semibold">{validTill}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70">Pay with</dt>
                    <dd className="font-semibold">{methodLabel}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70">Price</dt>
                    <dd className="font-semibold">₹{selectedPlan.price.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/70">GST (18%)</dt>
                    <dd className="font-semibold">₹{gst}</dd>
                  </div>
                </dl>

                <div className="relative my-6 h-px bg-white/20" />

                <div className="relative flex items-end justify-between">
                  <span className="text-white/70">Total</span>
                  <span className="text-4xl font-extrabold">₹{total}</span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={disabled}
                  className="relative mt-8 w-full flex items-center justify-center gap-2 bg-white text-red-900 font-bold tracking-wide py-4 rounded-xl shadow-lg
                             hover:bg-gray-100 hover:shadow-xl active:scale-[0.99] transition duration-200
                             focus:outline-none focus:ring-4 focus:ring-white/40
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LockClosedIcon className="h-5 w-5" />
                  {processing ? 'Processing...' : paymentSuccess ? 'Paid' : `Pay ₹${total}`}
                </button>
              </div>
            </div>
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