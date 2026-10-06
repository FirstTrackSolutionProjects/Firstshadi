import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Footer from '../../components/Footer';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact/admin?status=new&limit=100');
      if (res.success) setContacts(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id) => {
    try {
      await api.put(`/contact/admin/${id}/resolve`);
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Contact Messages</h1>
          {loading ? <p>Loading...</p> : (
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c.id} className="bg-white rounded-lg shadow p-4 flex justify-between">
                  <div>
                    <p className="font-bold">{c.name} — <span className="text-slate-500">{c.email}</span></p>
                    <p className="text-sm mt-1">{c.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(c.created_at).toLocaleString()}</p>
                  </div>
                  <button onClick={() => resolve(c.id)} className="self-start px-3 py-1 bg-green-600 text-white rounded text-xs">Resolve</button>
                </div>
              ))}
              {contacts.length === 0 && <p className="text-slate-500">No new messages.</p>}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminContacts;