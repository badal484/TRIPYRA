import { motion } from "framer-motion";
import { IconHeart, IconCompass, IconArrowRight } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VehicleCard from "../../components/VehicleCard";

const Favorites = () => {
  const navigate = useNavigate();
  const { favoriteIds } = useSelector((state) => state.favorites);
  const { userAllVehicles } = useSelector((state) => state.userListVehicles);
  
  const favoriteVehicles = userAllVehicles.filter(v => favoriteIds.includes(v._id));

  if (favoriteVehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="w-32 h-32 bg-red-50 rounded-[40px] flex items-center justify-center text-red-400 shadow-inner">
             <IconHeart size={56} stroke={1.5} className="animate-pulse" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-zoom-green"
          >
             <IconCompass size={24} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Your Wishlist is <span className="text-red-400">Daydreaming</span></h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed mb-10">
            Looks like you haven't found your "one" yet. Save the cars that catch your eye and we'll keep them safe here for your next big trip.
          </p>

          <Link to="/vehicles">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-3xl font-bold text-sm transition-all hover:bg-zoom-green shadow-xl shadow-slate-200"
            >
              Start Exploring <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 text-red-500 mb-4">
            <IconHeartFilled size={24} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Curated Wishlist</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
            The cars you <br/> <span className="text-red-500">love most.</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Your personal archive of premium mobility. These verified listings are ready for your next adventure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8">
        {favoriteVehicles.map((vehicle) => (
          <VehicleCard 
            key={vehicle._id} 
            vehicle={vehicle} 
            onDetail={(id) => navigate(`/vehicles`)} 
          />
        ))}
      </div>
    </div>
  );
};

// Simple IconHeartFilled since tabler might not match exactly or to be safe
const IconHeartFilled = ({ size = 20 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="icon icon-tabler icons-tabler-filled icon-tabler-heart"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.033 .033l.034 -.033a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.119 .118l-8.273 8.273a1 1 0 0 1 -1.332 .075l-.082 -.075l-8.273 -8.273a6 6 0 0 1 3.535 -10.038l.245 -.036z" />
  </svg>
);

export default Favorites;