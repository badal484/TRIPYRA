import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setVariants,
  setVehicleDetail,
  showVehicles,
} from "../../redux/user/listAllVehicleSlice";
import { useNavigate } from "react-router-dom";
import Filter from "../../components/Filter";
import Sort from "../../components/Sort";
import Footers from "../../components/Footer";
import VehicleCard from "../../components/VehicleCard";
import { motion, AnimatePresence } from "framer-motion";
import { IconCar, IconFilter, IconArrowRight, IconLoader2 } from "@tabler/icons-react";

// Logic remains similar but cleaned up
export const onVehicleDetail = async (id, dispatch, navigate) => {
  try {
    const res = await fetch("/api/user/showVehicleDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    dispatch(setVehicleDetail(data));
    navigate("/vehicleDetails");
  } catch (error) {
    console.error(error);
  }
};

const Vehicles = () => {
  const { userAllVehicles } = useSelector((state) => state.userListVehicles);
  const { filterdData } = useSelector((state) => state.sortfilterSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "";

  useEffect(() => {
    dispatch(setVariants(null));
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/listAllVehicles`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(showVehicles(data));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const displayData = filterdData && filterdData.length > 0 ? filterdData : userAllVehicles;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-4">
              Explore Fleet <IconCar size={40} className="text-zoom-green" />
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Find the perfect ride for your next journey from our verified listings.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-white p-2 rounded-[32px] shadow-sm border border-slate-100"
          >
            <Sort />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Layout Sidebar */}
          <aside className="lg:col-span-3">
             <div className="sticky top-10">
                <Filter />
             </div>
          </aside>

          {/* Main Content Areas */}
          <main className="lg:col-span-9">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
                <IconLoader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold uppercase tracking-widest text-[10px]">Fetching available vehicles...</p>
              </div>
            ) : (
              <>
                {displayData && displayData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {displayData.map((cur) => (
                        <VehicleCard 
                          key={cur._id} 
                          vehicle={cur} 
                          onDetail={(id) => onVehicleDetail(id, dispatch, navigate)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                      <IconFilter size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">No results found</h2>
                    <p className="text-slate-500 mb-8 font-medium">Try adjusting your filters to find more vehicles.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Clear All Filters <IconArrowRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footers />
    </div>
  );
};

export default Vehicles;