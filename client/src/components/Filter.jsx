import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setFilteredData } from "../redux/user/sortfilterSlice";
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronDown, IconCash, IconUsers, IconSteeringWheel, IconGasStation } from '@tabler/icons-react';

const FilterSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 last:border-none py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 hover:opacity-70 transition-opacity"
      >
        <div className="flex items-center gap-2 text-slate-400">
          <Icon size={16} stroke={2} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-800">{title}</span>
        </div>
        <IconChevronDown size={14} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-2 pb-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Filter = () => {
  const dispatch = useDispatch();
  const { userAllVehicles } = useSelector((state) => state.userListVehicles);
  const [activeFilters, setActiveFilters] = useState({
    car_type: [],
    transmition: [],
    fuel_type: [],
    seats: [],
    priceRange: 4000
  });

  const handleFilterChange = (category, value) => {
    setActiveFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      
      const newFilters = { ...prev, [category]: updated };
      applyFilters(newFilters);
      return newFilters;
    });
  };

  const applyFilters = (filters) => {
    let results = userAllVehicles;
    if (filters.car_type.length > 0) results = results.filter(v => filters.car_type.includes(v.car_type.toLowerCase()));
    if (filters.transmition.length > 0) results = results.filter(v => filters.transmition.includes(v.transmition.toLowerCase()));
    if (filters.fuel_type.length > 0) results = results.filter(v => filters.fuel_type.includes(v.fuel_type.toLowerCase()));
    if (filters.seats.length > 0) results = results.filter(v => filters.seats.includes(v.seats.toString()));
    results = results.filter(v => v.price <= filters.priceRange);
    dispatch(setFilteredData(results));
  };

  const CheckboxItem = ({ label, value, category }) => (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
      <input 
        type="checkbox"
        className="hidden"
        checked={activeFilters[category]?.includes(value.toLowerCase())}
        onChange={() => handleFilterChange(category, value.toLowerCase())}
      />
      <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
        activeFilters[category]?.includes(value.toLowerCase()) ? 'border-zoom-green bg-zoom-green' : 'border-slate-200 group-hover:border-slate-400'
      }`}>
        {activeFilters[category]?.includes(value.toLowerCase()) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
      </div>
      <span className={`text-[13px] font-medium transition-colors ${
        activeFilters[category]?.includes(value.toLowerCase()) ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-700'
      }`}>{label}</span>
    </label>
  );

  return (
    <div className="bg-transparent pr-4">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-900">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Filters</h2>
        <button 
          onClick={() => {
            const reset = { car_type: [], transmition: [], fuel_type: [], seats: [], priceRange: 4000 };
            setActiveFilters(reset);
            dispatch(setFilteredData(userAllVehicles));
          }}
          className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-zoom-green transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2">
        <FilterSection title="Budget Range" icon={IconCash}>
          <div className="py-2">
            <input 
              type="range" 
              min="500" 
              max="4000" 
              step="100" 
              value={activeFilters.priceRange}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setActiveFilters(p => ({ ...p, priceRange: val }));
                applyFilters({ ...activeFilters, priceRange: val });
              }}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-zoom-green mb-4"
            />
            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span>₹500</span>
              <span className="text-zoom-green">Max ₹{activeFilters.priceRange}</span>
              <span>₹4k</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Vehicle" icon={IconSteeringWheel}>
           <CheckboxItem label="SUV" value="SUV" category="car_type" />
           <CheckboxItem label="Sedan" value="Sedan" category="car_type" />
           <CheckboxItem label="Hatchback" value="Hatchback" category="car_type" />
        </FilterSection>

        <FilterSection title="Drive" icon={IconSteeringWheel}>
           <CheckboxItem label="Automatic" value="Automatic" category="transmition" />
           <CheckboxItem label="Manual" value="Manual" category="transmition" />
        </FilterSection>

        <FilterSection title="Plan" icon={IconUsers}>
           <CheckboxItem label="4 Seats" value="4" category="seats" />
           <CheckboxItem label="5 Seats" value="5" category="seats" />
           <CheckboxItem label="7 Seats" value="7" category="seats" />
        </FilterSection>

        <FilterSection title="Fuel" icon={IconGasStation}>
           <CheckboxItem label="Petrol" value="Petrol" category="fuel_type" />
           <CheckboxItem label="Diesel" value="Diesel" category="fuel_type" />
           <CheckboxItem label="Electric" value="EV" category="fuel_type" />
        </FilterSection>
      </div>
    </div>
  );
};

export default Filter;