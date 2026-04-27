
import { useDispatch, useSelector } from "react-redux";
import { FaCarSide, FaUsers } from "react-icons/fa";
import { MdAirlineSeatReclineNormal, MdLocalGasStation, MdSettings } from "react-icons/md";
import CarNotFound from "./CarNotFound";
import { useNavigate } from "react-router-dom";
import { setVariants } from "../../redux/user/listAllVehicleSlice";
import { setFilteredData } from "../../redux/user/sortfilterSlice";
import { motion } from "framer-motion";

const AvailableVehiclesAfterSearch = () => {
  const { availableCars } = useSelector((state) => state.selectRideSlice);
  const { pickup_district, pickup_location, pickupDate, dropoffDate } =
    useSelector((state) => state.bookingDataSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showVarients = async (model) => {
    try {
      const datas = {
        pickUpDistrict: pickup_district,
        pickUpLocation: pickup_location,
        pickupDate: pickupDate.humanReadable,
        dropOffDate: dropoffDate.humanReadable,
        model,
      };
      const res = await fetch("/api/user/getVehiclesWithoutBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datas),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(setVariants(data));
        dispatch(setFilteredData(data));
        navigate("/allVariants");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {availableCars && availableCars.length > 0 && (
        <div className="pt-20 px-4 text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Select Your Perfect Drive
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed"
          >
            We've found the best vehicles available in <span className="text-zoom-green font-bold">{pickup_district}</span> for your selected dates. 
            All cars are deep-cleaned and quality-checked.
          </motion.p>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {availableCars &&
            availableCars.map((cur, idx) => (
              !cur.isDeleted && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 relative"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-white p-6">
                    <motion.img
                      whileHover={{ scale: 1.1, rotate: -2 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      src={cur.image[0]}
                      alt={cur.name}
                      className="w-full h-full object-contain"
                    />
                    {/* Floating Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <span className="glass-effect car-pill-green car-pill backdrop-blur-md">
                        {cur.car_type}
                       </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 pt-2">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 capitalize mb-1">{cur.name}</h3>
                        <p className="text-slate-400 font-medium flex items-center gap-1">
                          <FaCarSide className="text-zoom-green" /> {cur.company}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900">₹{cur.price}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Per Day</p>
                      </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                          <FaUsers size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Seats</p>
                          <p className="text-sm font-bold text-slate-700">{cur.seats} People</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400">
                          <MdSettings size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Gearbox</p>
                          <p className="text-sm font-bold text-slate-700">Auto/Manual</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => showVarients(cur.model)}
                      className="w-full py-5 rounded-[24px] bg-slate-900 text-white font-bold text-lg hover:bg-zoom-green transition-colors flex items-center justify-center gap-2 group-button"
                    >
                      Book This Vehicle
                    </motion.button>
                  </div>
                </motion.div>
              )
            ))}
        </div>
      </div>
      
      {(!availableCars || availableCars.length === 0) && <CarNotFound />}
    </div>
  );
};

export default AvailableVehiclesAfterSearch;
