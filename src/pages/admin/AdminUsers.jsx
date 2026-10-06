// src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { api } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // uuid of user currently being acted on

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 200, offset: 0, search };
      if (filter === 'premium') params.is_premium = 'true';
      if (filter === 'free') params.is_premium = 'false';
      if (filter === 'verified') params.is_verified = 'true';
      if (filter === 'unverified') params.is_verified = 'false';
      if (filter === 'suspended') params.is_active = 'false';

      const res = await adminService.getUsers(params);
      if (res.success) setUsers(res.data);
      else setError(res.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') load();
  };

  const togglePremium = async (u) => {
    setActionLoading(u.uuid);
    try {
      await api.put(`/admin/users/${u.uuid}/premium`, {
        is_premium: !u.is_premium,
        days: 30,
      });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAdmin = async (u) => {
    if (!window.confirm(`Are you sure you want to ${u.is_admin ? 'revoke admin from' : 'make admin'} ${u.name}?`)) return;
    setActionLoading(u.uuid);
    try {
      await api.put(`/admin/users/${u.uuid}/admin`, { is_admin: !u.is_admin });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleVerify = async (u) => {
    setActionLoading(u.uuid);
    try {
      await api.put(`/admin/users/${u.uuid}/verify`, { is_verified: !u.is_verified });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (u) => {
    if (!window.confirm(`Are you sure you want to ${u.is_active === false ? 'restore' : 'suspend'} ${u.name}?`)) return;
    setActionLoading(u.uuid);
    try {
      await api.put(`/admin/users/${u.uuid}/active`, { is_active: u.is_active === false });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const totalUsers = users.length;
  const premiumCount = users.filter((u) => u.is_premium).length;
  const verifiedCount = users.filter((u) => u.is_verified).length;
  const suspendedCount = users.filter((u) => u.is_active === false).length;

  return (
    <div className="space-y-6">
      {/* ============ SUMMARY CARDS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Total Shown</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Verified</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{verifiedCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Premium</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{premiumCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Suspended</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{suspendedCount}</p>
        </div>
      </div>

      {/* ============ FILTERS ============ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, phone… (press Enter)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="flex-1 border border-slate-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <option value="">All Users</option>
          <option value="premium">Premium only</option>
          <option value="free">Free only</option>
          <option value="verified">Verified only</option>
          <option value="unverified">Unverified only</option>
          <option value="suspended">Suspended only</option>
        </select>
        <button
          onClick={load}
          className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition"
        >
          Search
        </button>
      </div>

      {/* ============ STATES ============ */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Loading users…
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* ============ TABLE ============ */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  <th className="px-4 py-3 text-center font-semibold">Verified</th>
                  <th className="px-4 py-3 text-center font-semibold">Premium</th>
                  <th className="px-4 py-3 text-center font-semibold">Admin</th>
                  <th className="px-4 py-3 text-center font-semibold">Active</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const busy = actionLoading === u.uuid;
                  return (
                    <tr
                      key={u.uuid}
                      className={`border-t border-slate-100 hover:bg-slate-50 transition ${
                        busy ? 'opacity-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3 text-slate-600">{u.phone}</td>

                      <td className="px-4 py-3 text-center">
                        {u.is_verified ? (
                          <span className="text-green-600 font-bold">✅</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.is_premium ? (
                          <span className="text-yellow-500 font-bold">⭐</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.is_admin ? (
                          <span className="text-indigo-600 font-bold">🛡️</span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {u.is_active === false ? (
                          <span className="text-red-600 font-bold">⛔</span>
                        ) : (
                          <span className="text-green-600 font-bold">✓</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          <button
                            disabled={busy}
                            onClick={() => toggleVerify(u)}
                            className={`px-2.5 py-1 rounded-md text-white text-xs font-medium transition ${
                              u.is_verified
                                ? 'bg-slate-500 hover:bg-slate-600'
                                : 'bg-green-600 hover:bg-green-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {u.is_verified ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => togglePremium(u)}
                            className={`px-2.5 py-1 rounded-md text-white text-xs font-medium transition ${
                              u.is_premium
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-emerald-600 hover:bg-emerald-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {u.is_premium ? 'Unpremium' : 'Premium'}
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => toggleAdmin(u)}
                            className={`px-2.5 py-1 rounded-md text-white text-xs font-medium transition ${
                              u.is_admin
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => toggleActive(u)}
                            className={`px-2.5 py-1 rounded-md text-white text-xs font-medium transition ${
                              u.is_active === false
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-500 hover:bg-red-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {u.is_active === false ? 'Restore' : 'Suspend'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-slate-500">
                      No users found. Try changing filters or search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;