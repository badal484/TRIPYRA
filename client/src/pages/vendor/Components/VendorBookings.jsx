import { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { IconCalendar, IconClock, IconMapPin, IconChevronDown, IconChecklist } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import VendorBookingDetailModal from "./VendorBookingModal";
import { setVendorOrderModalOpen, setVendorSingleOrderDetails } from "../../../redux/vendor/vendorBookingSlice";
import { motion, AnimatePresence } from "framer-motion";

const VendorBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [vendorVehicles, setVendorVehicles] = useState([]);
  const [filtered, setFilteredBookings] = useState([]);
  const { _id } = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const optionsValue = [
    "booked",
    "onTrip",
    "canceled",
    "tripCompleted",
  ];

  const fetchData = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");
      const res = await fetch("/api/vendor/showVendorVehilces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${refreshToken},${accessToken}`
        },
        body: JSON.stringify({ _id }),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  async function getVendorAllVehicles() {
    try {
      const data = await fetchData();
      setVendorVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setVendorVehicles([]);
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/allBookings", { method: "GET" });
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setBookings([]);
    }
  };

  const handleStatusChange = async (e, bookingId) => {
    const newStatus = e.target.value;
    try {
      const res = await fetch("/api/admin/changeStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVendorAllVehicles();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (vendorVehicles.length > 0 && bookings.length > 0) {
      const availableVehicleIds = vendorVehicles.map((v) => v._id);
      const filteredResult = bookings.filter((b) => availableVehicleIds.includes(b.vehicleId));
      setFilteredBookings(filteredResult);
    } else {
      setFilteredBookings([]);
    }
  }, [vendorVehicles, bookings]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
  };

  return (
    <div className="max-w-[1000px] mx-auto pb-20 px-4">
      <VendorBookingDetailModal />

      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Booking Requests</h2>
          <p className="text-slate-500 font-medium text-sm">Manage your vehicle rentals and status updates</p>
        </div>
        <div className="w-12 h-12 bg-zoom-green/10 rounded-2xl flex items-center justify-center text-zoom-green">
            <IconChecklist size={24} />
        </div>
      </div>

      <AnimatePresence>
        {filtered.length > 0 ? (
          <div className="space-y-6">
            {filtered.map((cur, idx) => {
              const pickupDate = new Date(cur.pickupDate);
              const dropoffDate = new Date(cur.dropOffDate);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={cur._id}
                  className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden group"
                >
                  <div className="p-8 flex flex-col md:flex-row gap-10">
                    {/* Vehicle Preview */}
                    <div className="md:w-64">
                      <div className="aspect-[4/3] bg-slate-50 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
                        <img
                          alt="Vehicle"
                          src={cur.vehicleDetails?.image?.[0] || ""}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Booking Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight capitalize leading-none mb-2">
                             {cur.vehicleDetails?.name || cur.vehicleDetails?.model}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zoom-green">
                              <span className="w-1.5 h-1.5 rounded-full bg-zoom-green animate-pulse"></span>
                               {cur.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 leading-none">₹{cur.totalPrice}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Paid Total</span>
                        </div>
                      </div>

                      {/* Schedule Summary */}
                      <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-50">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Pickup</p>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2 truncate max-w-[200px]">
                            <IconMapPin size={14} className="text-zoom-green" /> {cur.pickUpLocation}
                          </p>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <IconCalendar size={14} /> {formatDate(pickupDate)}
                            </p>
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <IconClock size={14} /> {formatTime(pickupDate)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Dropoff</p>
                          <p className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-2 truncate max-w-[200px]">
                            <IconMapPin size={14} className="text-zoom-green" /> {cur.dropOffLocation}
                          </p>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <IconCalendar size={14} /> {formatDate(dropoffDate)}
                            </p>
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                              <IconClock size={14} /> {formatTime(dropoffDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <button
                          className="h-12 px-8 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                          onClick={() => {
                            dispatch(setVendorOrderModalOpen(true));
                            dispatch(setVendorSingleOrderDetails(cur));
                          }}
                        >
                          View Details
                        </button>
                        
                        <div className="relative group">
                          <select
                            className="h-12 pl-6 pr-12 appearance-none bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-2 focus:ring-zoom-green/20 transition-all cursor-pointer"
                            value={cur.status}
                            onChange={(e) => handleStatusChange(e, cur._id)}
                          >
                            {optionsValue.map((opt) => (
                              <option key={opt} value={opt}>{opt.replace(/([A-Z])/g, ' $1')}</option>
                            ))}
                          </select>
                          <IconChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-zoom-green transition-colors" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 italic font-medium text-slate-300">
             Waiting for your first booking...
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorBookingsTable;
