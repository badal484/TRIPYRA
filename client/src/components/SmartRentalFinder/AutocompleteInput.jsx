import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMapPin, IconSearch, IconX } from '@tabler/icons-react';

const AutocompleteInput = ({ label, icon: Icon, placeholder, suggestions, onSelect, value }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (inputValue.length > 0) {
      const matches = suggestions.filter(s => 
        s.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        s.address?.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFiltered(matches);
      setShowDropdown(true);
    } else {
      setFiltered([]);
      setShowDropdown(false);
    }
  }, [inputValue, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-[10px] font-black text-zoom-green uppercase tracking-widest mb-1 ml-4">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-zoom-green transition-colors">
          {Icon ? <Icon size={20} /> : <IconMapPin size={20} />}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowDropdown(inputValue.length > 0)}
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-4 bg-gray-50 border-none rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all"
        />
        {inputValue && (
          <button 
            onClick={() => { setInputValue(''); onSelect(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
          >
            <IconX size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-[100] top-full mt-2 w-full bg-white rounded-[24px] shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {filtered.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => {
                    setInputValue(item.name);
                    setShowDropdown(false);
                    onSelect(item);
                  }}
                  className="w-full px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none text-left"
                >
                  <div className="mt-1 w-8 h-8 rounded-full bg-zoom-green/10 flex items-center justify-center text-zoom-green shrink-0">
                    <IconMapPin size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.address || "Car Rental Hub"}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutocompleteInput;
