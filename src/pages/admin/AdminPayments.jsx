// src/pages/admin/AdminPayments.jsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Footer from '../../components/Footer';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.getPayments({ limit: 100, offset: 0 });
        if (res.success) setPayments(res.data);
        else setError(res.message);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Payments</h1>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs">{p.order_id}</td>
                      <td className="px-4 py-3">{p.user_name}<br /><span className="text-xs text-slate-500">{p.user_email}</span></td>
                      <td className="px-4 py-3">{p.plan}</td>
                      <td className="px-4 py-3 text-right">₹{Number(p.amount).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold">₹{Number(p.total_amount).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          p.status === 'completed' ? 'bg-green-100 text-green-700' :
                          p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          p.status === 'refunded' ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3">{p.payment_method}</td>
                      <td className="px-4 py-3">{new Date(p.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan="8" className="text-center py-6 text-slate-500">No payments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPayments;