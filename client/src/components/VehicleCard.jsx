import React from 'react';
import { motion } from 'framer-motion';
import { IconSteeringWheel, IconUsers, IconGasStation, IconChevronRight, IconStarFilled, IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../redux/user/favoritesSlice';

import Swal from 'sweetalert2';

const VehicleCard = React.forwardRef(({ vehicle, onDetail }, ref) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { favoriteIds } = useSelector((state) => state.favorites);
  const isFavorite = favoriteIds.includes(vehicle._id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      Swal.fire({
        title: 'Join Tripyra',
        text: 'Save your favorite cars by creating an account or signing in!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Sign In Now',
        background: '#ffffff',
        borderRadius: '32px'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/signin';
        }
      });
      return;
    }
    dispatch(toggleFavorite(vehicle._id));
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all border border-slate-100 group relative"
    >
      <div className="relative p-6 pt-8">
        {/* Wishlist Heart */}
        <button 
          onClick={handleWishlist}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-100 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all text-red-500"
        >
          {isFavorite ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
        </button>

        {/* Top Info */}
        <div className="flex justify-between items-start mb-6 gap-2">
          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight capitalize">
              {vehicle.name || "Premium Sedan"}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-zoom-green">
              <IconStarFilled size={12} />
              <span className="text-[10px] font-black uppercase tracking-wider">Top Rated</span>
            </div>
          </div>
          <div className="text-right min-w-fit pr-10">
            <p className="text-xl font-black text-slate-900 leading-none">
              ₹{vehicle.price}
            </p>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Per day</span>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-48 mb-8 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center p-4">
          <img 
            src={vehicle.image && vehicle.image[0] ? vehicle.image[0] : "https://via.placeholder.com/400x300"} 
            alt={vehicle.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <IconSteeringWheel size={18} className="mx-auto mb-2 text-slate-400" />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate leading-none">
              {vehicle.transmition || "Manual"}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <IconUsers size={18} className="mx-auto mb-2 text-slate-400" />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate leading-none">
              {vehicle.seats} Seater
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl text-center">
            <IconGasStation size={18} className="mx-auto mb-2 text-slate-400" />
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate leading-none">
              {vehicle.fuel_type || "Petrol"}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!currentUser) {
              Swal.fire({
                title: 'Adventure Awaits',
                text: 'Please sign in to book your favorite vehicle.',
                icon: 'info',
                confirmButtonColor: '#22c55e',
                confirmButtonText: 'Let\'s Go',
              }).then(() => {
                window.location.href = '/signin';
              });
              return;
            }
            onDetail(vehicle._id);
          }}
          className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-zoom-green transition-colors group/btn"
        >
          Book Now
          <IconChevronRight size={18} stroke={3} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
});

export default VehicleCard;