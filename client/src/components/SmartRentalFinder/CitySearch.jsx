import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconSearch, IconAdjustmentsHorizontal, IconCurrentLocation, IconNavigationShare, IconClock, IconTallymark4 } from '@tabler/icons-react';
import AutocompleteInput from './AutocompleteInput';
import MapView from './MapView';
import toast, { Toaster } from 'react-hot-toast';

const CitySearch = () => {
  const [city, setCity] = useState('');
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityCoords, setCityCoords] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const fetchRentals = async () => {
    if (!city) return toast.error("Please enter a city name");
    
    setLoading(true);
    try {
      const res = await fetch(`/api/rentals/get-rentals?city=${city}`);
      const data = await res.json();
      
      if (data.success) {
        setRentals(data.rentals);
        setCityCoords(data.coords);
        toast.success(`Found ${data.count} rental hubs in ${city}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to connect to the smart server");
    } finally {
      setLoading(false);
    }
  };

  const calculateRoute = async () => {
    if (!pickup || !dropoff) return;
    
    // Using OpenRouteService (requires API key usually, but Nominatim is free)
    // For this demo, we'll simulate the calculation if no key is provided, 
    // or call the public API if enabled.
    const distance = 12.5; // Mock data
    const duration = 24;   // Mock data
    setRouteInfo({ distance, duration });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <Toaster />
      <div className="max-w-[1400px] mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-zoom-green rounded-[32px] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-zoom-green/20"
          >
            <IconNavigationShare size={40} stroke={2.5} />
          </motion.div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Smart Rental Finder</h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Discover real car rental locations in your city using real-time OpenStreetMap data. 
            Select your points and get on the road instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              
              {/* City Input */}
              <div className="mb-10">
                <label className="block text-[10px] font-black text-zoom-green uppercase tracking-widest mb-3 ml-4">
                  Target City
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 group">
                    <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-zoom-green transition-colors" size={20} />
                    <input 
                      type="text"
                      placeholder="e.g. Bengaluru, Mumbai, Delhi..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-14 pl-12 bg-gray-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 transition-all"
                    />
                  </div>
                  <button 
                    onClick={fetchRentals}
                    disabled={loading}
                    className="h-14 px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <IconAdjustmentsHorizontal size={20} />}
                    Scan
                  </button>
                </div>
              </div>

              {/* Dynamic Autocomplete Inputs */}
              <div className="space-y-8">
                <AutocompleteInput 
                  label="Pick-up Hub" 
                  placeholder={rentals.length > 0 ? "Select from OSM locations" : "Scan a city first"}
                  suggestions={rentals}
                  onSelect={(item) => { setPickup(item); calculateRoute(); }}
                  value={pickup?.name}
                />
                
                <AutocompleteInput 
                  label="Drop-off Hub"
                  placeholder={rentals.length > 0 ? "Select return location" : "Scan a city first"}
                  suggestions={rentals}
                  onSelect={(item) => { setDropoff(item); calculateRoute(); }}
                  value={dropoff?.name}
                />
              </div>

              {/* Route Summary */}
              {routeInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-10 p-6 bg-zoom-green/5 rounded-3xl border border-zoom-green/10 flex items-center justify-around"
                >
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-zoom-green mb-1 justify-center">
                      <IconNavigationShare size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Distance</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{routeInfo.distance} km</p>
                  </div>
                  <div className="w-[1px] h-10 bg-zoom-green/10"></div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-zoom-green mb-1 justify-center">
                      <IconClock size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{routeInfo.duration} mins</p>
                  </div>
                </motion.div>
              )}

              <button className="w-full h-16 mt-10 bg-zoom-green text-white rounded-3xl font-black text-lg shadow-xl shadow-zoom-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Find Available Cars
              </button>
            </div>

            {/* Nearest Hub Shortcut */}
            <button className="w-full h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-slate-600 font-bold hover:bg-slate-50 transition-all">
              <IconCurrentLocation size={18} className="text-zoom-green" />
              Find Nearest Rental to Me
            </button>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-7 h-[700px]">
            <MapView 
              rentals={rentals} 
              pickup={pickup} 
              dropoff={dropoff} 
              cityCoords={cityCoords}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CitySearch;