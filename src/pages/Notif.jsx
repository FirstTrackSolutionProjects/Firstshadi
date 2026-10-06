// import React, { useEffect, useState } from 'react';

// const Notif = () => {
//   const [notifications, setNotifications] = useState([]);

//   // Load and set notifications from localStorage
//   const loadNotifications = () => {
//     const stored = JSON.parse(localStorage.getItem('notifications')) || [];
//     setNotifications(stored);
//   };

//   useEffect(() => {
//     loadNotifications(); // initial load

//     // Listen for updates
//     const updateHandler = () => {
//       loadNotifications();
//     };

//     window.addEventListener('connections-updated', updateHandler);

//     // Cleanup listener on unmount
//     return () => {
//       window.removeEventListener('connections-updated', updateHandler);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 font-sans">
//       <h2 className="text-3xl font-bold text-slate-800 mb-6">Live Notifications</h2>

//       {notifications.length === 0 ? (
//         <p className="text-slate-500">No notifications yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {notifications.map((notif, idx) => (
//             <li
//               key={idx}
//               className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
//             >
//               <div className="text-slate-800 font-medium">{notif.message}</div>
//               <div className="text-xs text-slate-500 mt-1">
//                 {new Date(notif.timestamp).toLocaleString()}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Notif;



import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Footer from '../components/Footer';

const Notif = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-50 p-8 font-sans">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Notifications</h2>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-slate-500">No notifications yet.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                    notif.is_read ? 'border-slate-300' : 'border-blue-500'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-slate-800 font-medium">{notif.title || notif.message}</div>
                      <div className="text-sm text-slate-600">{notif.message}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!notif.is_read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-blue-600 text-xs hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notif;
