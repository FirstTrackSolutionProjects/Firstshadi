import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Footer from '../../components/Footer';

const empty = { couple_names: '', image_url: '', story: '', location: '', married_on: '', is_published: true };

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stories/admin');
      if (res.success) setStories(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/stories/admin', form);
      setForm(empty);
      load();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete story?')) return;
    try { await api.delete(`/stories/admin/${id}`); load(); } catch (e) { alert(e.message); }
  };

  const togglePublish = async (s) => {
    try {
      await api.put(`/stories/admin/${s.id}`, { is_published: !s.is_published });
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Success Stories</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Couple Names" value={form.couple_names} onChange={(e) => setForm({ ...form, couple_names: e.target.value })} required className="border p-2 rounded" />
            <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="border p-2 rounded" />
            <input type="date" value={form.married_on} onChange={(e) => setForm({ ...form, married_on: e.target.value })} className="border p-2 rounded" />
            <textarea placeholder="Story" value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} required rows="3" className="border p-2 rounded md:col-span-2" />
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">{saving ? 'Saving...' : 'Add Story'}</button>
            </div>
          </form>

          {loading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((s) => (
                <div key={s.id} className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-bold text-lg">{s.couple_names}</h3>
                  <p className="text-xs text-slate-500">{s.location} · {s.married_on}</p>
                  <p className="text-sm mt-2 line-clamp-3">{s.story}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => togglePublish(s)} className={`px-3 py-1 rounded text-white text-xs ${s.is_published ? 'bg-green-600' : 'bg-slate-500'}`}>{s.is_published ? 'Unpublish' : 'Publish'}</button>
                    <button onClick={() => remove(s.id)} className="px-3 py-1 rounded text-white text-xs bg-red-600">Delete</button>
                  </div>
                </div>
              ))}
              {stories.length === 0 && <p className="text-slate-500">No stories yet.</p>}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminStories;