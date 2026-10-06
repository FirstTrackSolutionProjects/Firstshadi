import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { api } from '../../services/api';
import Footer from '../../components/Footer';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports?status=pending&limit=100');
      if (res.success) setReports(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id, action) => {
    try {
      await api.put(`/admin/reports/${id}/resolve`, { status: action === 'dismiss' ? 'dismissed' : 'action_taken', action });
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Reports</h1>

          {loading ? <p>Loading...</p> : (
            <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Reporter</th>
                    <th className="px-4 py-3 text-left">Reported</th>
                    <th className="px-4 py-3 text-left">Reason</th>
                    <th className="px-4 py-3 text-left">Details</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-slate-50">
                      <td className="px-4 py-3">{r.reporter_name}<br /><span className="text-xs text-slate-500">{r.reporter_email}</span></td>
                      <td className="px-4 py-3">{r.reported_name}<br /><span className="text-xs text-slate-500">{r.reported_email}</span></td>
                      <td className="px-4 py-3">{r.reason}</td>
                      <td className="px-4 py-3 max-w-xs truncate">{r.details}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => resolve(r.id, 'dismiss')} className="px-3 py-1 rounded text-white text-xs bg-slate-500">Dismiss</button>
                          <button onClick={() => resolve(r.id, 'suspend')} className="px-3 py-1 rounded text-white text-xs bg-yellow-600">Suspend</button>
                          <button onClick={() => resolve(r.id, 'delete')} className="px-3 py-1 rounded text-white text-xs bg-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-slate-500">No pending reports.</td></tr>}
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

export default AdminReports;