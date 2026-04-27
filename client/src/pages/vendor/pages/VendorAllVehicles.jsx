
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconEdit, 
  IconTrash, 
  IconCircleCheck, 
  IconClock, 
  IconAlertCircle,
  IconPlus,
  IconGasStation,
  IconSteeringWheel,
  IconUsers,
  IconCar
} from "@tabler/icons-react";

import {
  setVendorDeleteSuccess,
  setVendorEditSuccess,
  setVendorError,
  setVenodrVehilces,
} from "../../../redux/vendor/vendorDashboardSlice";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";

const StatusBadge = ({ status, isRejected }) => {
  if (isRejected) return (
    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-100">
      <IconAlertCircle size={12} /> REJECTED
    </span>
  );
  if (status) return (
    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-100">
      <IconCircleCheck size={12} /> APPROVED
    </span>
  );
  return (
    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100">
      <IconClock size={12} /> PENDING
    </span>
  );
};

const VehicleCard = ({ vehicle, onEdit, onDelete }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -8 }}
    className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-2xl group"
  >
    {/* Image Container */}
    <div className="relative h-56 overflow-hidden">
      <img 
        src={vehicle.image[0]} 
        alt={vehicle.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4">
        <StatusBadge status={vehicle.isAdminApproved} isRejected={vehicle.isRejected} />
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
        <button 
          onClick={() => onEdit(vehicle._id)}
          className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center hover:bg-zoom-green hover:text-white transition-all shadow-lg"
        >
          <IconEdit size={20} />
        </button>
        <button 
          onClick={() => onDelete(vehicle._id)}
          className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg"
        >
          <IconTrash size={20} />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[10px] font-black text-zoom-green uppercase tracking-widest">{vehicle.company}</p>
          <h3 className="text-xl font-bold text-slate-900">{vehicle.name}</h3>
        </div>
        <p className="text-xl font-black text-slate-900">₹{vehicle.price}<span className="text-[10px] text-slate-400 font-normal">/day</span></p>
      </div>

      <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-1">{vehicle.car_title || "Premium Rental Vehicle"}</p>

      <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-50">
        <div className="flex flex-col items-center">
          <IconGasStation size={16} className="text-slate-400 mb-1" />
          <span className="text-[10px] font-bold text-slate-600 uppercase">{vehicle.fuel_type}</span>
        </div>
        <div className="flex flex-col items-center">
          <IconSteeringWheel size={16} className="text-slate-400 mb-1" />
          <span className="text-[10px] font-bold text-slate-600 uppercase">{vehicle.transmition}</span>
        </div>
        <div className="flex flex-col items-center">
          <IconUsers size={16} className="text-slate-400 mb-1" />
          <span className="text-[10px] font-bold text-slate-600 uppercase">{vehicle.seats} Seats</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const VendorAllVehicles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { vendorVehilces, vendorEditSuccess, vendorDeleteSuccess } = useSelector(
    (state) => state.vendorDashboardSlice
  );
  const { _id } = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/vendor/showVendorVehilces", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("refreshToken")},${localStorage.getItem("accessToken")}`
          },
          body: JSON.stringify({ _id }),
        });
        const data = await res.json();
        dispatch(setVenodrVehilces(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [_id, dispatch, isAddVehicleClicked]);

  const handleEditVehicle = (id) => navigate(`/vendorDashboard/vendorEditProductComponent?vehicle_id=${id}`);
  const handleDeleteVehicles = (id) => navigate(`/vendorDashboard/vendorDeleteVehicleModal?vehicle_id=${id}`);

  return (
    <div className="py-10 relative">
      <Toaster />
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Fleet</h1>
          <p className="text-slate-500 font-medium">Manage and track your listed vehicles.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(addVehicleClicked(true))}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200"
        >
          <IconPlus size={20} /> Add New Vehicle
        </motion.button>
      </div>

      {/* Grid Area */}
      <AnimatePresence mode="popLayout">
        {vendorVehilces?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-[40px] border border-slate-100 p-20 text-center"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
              <IconCar size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Vehicles Yet</h2>
            <p className="text-slate-500 max-w-xs mx-auto mb-8">Start earning by listing your first vehicle on our platform.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {vendorVehilces?.filter(v => !v.isDeleted).map((vehicle) => (
              <VehicleCard 
                key={vehicle._id} 
                vehicle={vehicle} 
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicles}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorAllVehicles;
