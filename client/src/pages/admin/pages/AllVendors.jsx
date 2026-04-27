import React, { useEffect, useState } from 'react';
import { IconTrash, IconBuildingStore, IconMail, IconPhone, IconCertificate } from '@tabler/icons-react';
import Swal from 'sweetalert2';

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/admin/getAllVendors', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      setVendors(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Revoke Vendor Status?',
      text: "This will remove the vendor from the platform.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, remove them!',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/deleteUser/${id}`, { 
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire('Removed!', 'Vendor has been revoked.', 'success');
          fetchVendors();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to remove vendor', 'error');
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Scanning Platform Hosts...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Verified Hosts</h1>
        <p className="text-slate-500 font-medium">Manage all registered vendors and fleet contributors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map(vendor => (
          <div key={vendor._id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-zoom-green group-hover:text-white transition-colors overflow-hidden">
                {vendor.profilePicture ? (
                  <img src={vendor.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <IconBuildingStore size={28} />
                )}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg leading-tight flex items-center gap-2">
                  {vendor.username}
                  <IconCertificate size={16} className="text-zoom-green" />
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Vendor since {new Date(vendor.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-500">
                <IconMail size={18} className="text-slate-300" />
                <span className="text-sm font-medium">{vendor.email}</span>
              </div>
              {vendor.phoneNumber && (
                <div className="flex items-center gap-3 text-slate-500">
                  <IconPhone size={18} className="text-slate-300" />
                  <span className="text-sm font-medium">{vendor.phoneNumber}</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleDelete(vendor._id)}
              className="w-full py-3 rounded-2xl border-2 border-red-50 text-red-400 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2"
            >
              <IconTrash size={18} /> Revoke Host Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVendors;