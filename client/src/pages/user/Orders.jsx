import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  IconCurrencyRupee, 
  IconClock, 
  IconCalendar, 
  IconMapPin, 
  IconCircleCheck, 
  IconX,
  IconReceipt2
} from "@tabler/icons-react";
import UserOrderDetailsModal from "../../components/UserOrderDetailsModal";
import {
  setIsOrderModalOpen,
  setSingleOrderDetails,
} from "../../redux/user/userSlice";

export default function Orders() {
  const { _id } = useSelector((state) => state.user.currentUser);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/user/findBookingsOfUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: _id }),
      });
      const data = await res.json();
      if (data) setBookings(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(new Date(dateString));
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).format(new Date(dateString));
  };

  const handleDetailsModal = (booking) => {
    dispatch(setIsOrderModalOpen(true));
    dispatch(setSingleOrderDetails(booking));
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-6 min-h-screen">
      <UserOrderDetailsModal />
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-zoom-green"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Portal</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
             My <span className="text-zoom-green">Bookings</span>
          </h1>
        </div>
        <p className="text-slate-400 font-medium text-sm">
           {bookings.length} active records found in your account
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {bookings && bookings.length > 0 ? (
          bookings.map((cur, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Vehicle Preview */}
                <div className="lg:w-1/3 bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-zoom-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    alt={cur.vehicleDetails.model}
                    className="w-full h-48 object-contain relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                    src={cur.vehicleDetails.image[0]}
                  />
                  <div className="absolute bottom-6 left-6 z-10">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                      cur.bookingDetails.status === 'booked' ? 'bg-zoom-green text-white' :
                      cur.bookingDetails.status === 'canceled' ? 'bg-red-500 text-white' :
                      'bg-slate-400 text-white'
                    }`}>
                      {cur.bookingDetails.status}
                    </span>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="flex-1 p-8 lg:p-12">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-1">{cur.vehicleDetails.company} {cur.vehicleDetails.model}</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">REFERENCE: {cur.bookingDetails._id.slice(-8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                      <p className="text-2xl font-bold text-slate-900 flex items-center justify-end">
                        <IconCurrencyRupee size={20} className="text-zoom-green" />{cur.bookingDetails.totalPrice}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <IconMapPin size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup Hub</p>
                             <p className="text-sm font-bold text-slate-700 capitalize">{cur.bookingDetails.pickUpLocation}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <IconCalendar size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrival Date</p>
                             <p className="text-sm font-bold text-slate-700">{formatDate(cur.bookingDetails.pickupDate)}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <IconClock size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arrival Time</p>
                             <p className="text-sm font-bold text-slate-700">{formatTime(cur.bookingDetails.pickupDate)}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <IconMapPin size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Return Hub</p>
                             <p className="text-sm font-bold text-slate-700 capitalize">{cur.bookingDetails.dropOffLocation}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <IconCalendar size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure Date</p>
                             <p className="text-sm font-bold text-slate-700">{formatDate(cur.bookingDetails.dropOffDate)}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <IconClock size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure Time</p>
                             <p className="text-sm font-bold text-slate-700">{formatTime(cur.bookingDetails.dropOffDate)}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group/btn"
                      onClick={() => handleDetailsModal(cur)}
                    >
                      View Invoice <IconReceipt2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                    </button>
                    {cur.bookingDetails.status !== "canceled" && (
                      <button
                        className="px-8 h-14 bg-red-50 text-red-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all"
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to cancel this booking?")) {
                            try {
                              const res = await fetch("/api/user/cancelBooking", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ bookingId: cur.bookingDetails._id }),
                              });
                              const data = await res.json();
                              if (data.success) {
                                fetchBookings();
                              }
                            } catch (error) {
                              console.error(error);
                            }
                          }
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-300 mb-6">
                <IconCalendar size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No active bookings found</h3>
             <p className="text-slate-500 font-medium">Ready for your next adventure? Start searching now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
