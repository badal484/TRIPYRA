import React, { useEffect, useState } from 'react';
import { IconTrash, IconUser, IconMail, IconPhone, IconShieldCheck } from '@tabler/icons-react';
import Swal from 'sweetalert2';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/getAllUsers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
      borderRadius: '24px'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/deleteUser/${id}`, { 
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire('Deleted!', 'User has been removed.', 'success');
          fetchUsers();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to delete user', 'error');
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Scanning Platform Userbase...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Platform Users</h1>
        <p className="text-slate-500 font-medium">Overview of all registered customers on Tripyra.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user._id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-zoom-green group-hover:text-white transition-colors overflow-hidden">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <IconUser size={28} />
                )}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg leading-tight flex items-center gap-2">
                  {user.username}
                  {user.isAdmin && <IconShieldCheck size={16} className="text-zoom-green" />}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-500">
                <IconMail size={18} className="text-slate-300" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              {user.phoneNumber && (
                <div className="flex items-center gap-3 text-slate-500">
                  <IconPhone size={18} className="text-slate-300" />
                  <span className="text-sm font-medium">{user.phoneNumber}</span>
                </div>
              )}
            </div>

            {!user.isAdmin && (
              <button 
                onClick={() => handleDelete(user._id)}
                className="w-full py-3 rounded-2xl border-2 border-red-50 text-red-400 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2"
              >
                <IconTrash size={18} /> Remove Account
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;