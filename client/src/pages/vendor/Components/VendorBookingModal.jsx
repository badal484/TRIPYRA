import { useDispatch, useSelector } from "react-redux";
import { setVendorOrderModalOpen } from "../../../redux/vendor/vendorBookingSlice";
import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconCircleCheck, IconClock, IconCalendar, IconMapPin, IconUser, IconReceipt } from "@tabler/icons-react";

const VendorBookingDetailModal = () => {
  const { isVendorOderModalOpen, vendorSingleOrderDetails: cur } = useSelector(
    (state) => state.vendorBookingSlice
  );

  const dispatch = useDispatch();

  const pickupDate = cur ? new Date(cur.pickupDate) : null;
  const dropOffDate = cur ? new Date(cur.dropOffDate) : null;

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
  };

  const closeModal = () => {
    dispatch(setVendorOrderModalOpen(false));
  };

  const DetailRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-none">
      <div className="flex items-center gap-3">
        {Icon && <Icon size={16} className="text-slate-300" />}
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900 capitalize">{value}</span>
    </div>
  );

  return (
    <AnimatePresence>
      {isVendorOderModalOpen && cur && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[560px] bg-white rounded-[40px] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-10 text-white relative">
              <button 
                onClick={closeModal}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >
                <IconX size={24} />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-zoom-green rounded-2xl flex items-center justify-center">
                    <IconReceipt size={24} />
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tight">Booking Record</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order ID: {cur._id.slice(-8)}</p>
                </div>
              </div>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Booking Sec */}
              <div className="mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-zoom-green mb-6 bg-zoom-green/5 inline-block px-4 py-1.5 rounded-full">Schedule & Payment</h3>
                <DetailRow label="Total Amount" value={`₹${cur.totalPrice}`} />
                <DetailRow label="Pickup Hub" value={cur.pickUpLocation} icon={IconMapPin} />
                <DetailRow label="Pickup Date" value={formatDate(pickupDate)} icon={IconCalendar} />
                <DetailRow label="Pickup Time" value={formatTime(pickupDate)} icon={IconClock} />
                <div className="h-4"></div>
                <DetailRow label="Dropoff Hub" value={cur.dropOffLocation} icon={IconMapPin} />
                <DetailRow label="Dropoff Date" value={formatDate(dropOffDate)} icon={IconCalendar} />
                <DetailRow label="Dropoff Time" value={formatTime(dropOffDate)} icon={IconClock} />
              </div>

              {/* Vehicle Sec */}
              <div className="mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-zoom-green mb-6 bg-zoom-green/5 inline-block px-4 py-1.5 rounded-full">Vehicle Technicals</h3>
                <DetailRow label="Registration" value={cur.vehicleDetails.registeration_number} />
                <DetailRow label="Model" value={cur.vehicleDetails.model} />
                <DetailRow label="Company" value={cur.vehicleDetails.company} />
                <DetailRow label="Type" value={cur.vehicleDetails.car_type} />
                <DetailRow label="Engine" value={cur.vehicleDetails.fuel_type} />
                <DetailRow label="Gearbox" value={cur.vehicleDetails.transmition} />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeModal}
                className="w-full h-16 bg-zoom-green text-white rounded-3xl font-black text-sm shadow-xl shadow-zoom-green/20 flex items-center justify-center gap-3 hover:bg-[#0e8a0e] transition-all"
              >
                Acknowledge Details <IconCircleCheck size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VendorBookingDetailModal;