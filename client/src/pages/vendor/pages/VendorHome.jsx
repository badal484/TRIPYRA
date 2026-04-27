import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { 
  IconCar, 
  IconCalendarEvent, 
  IconWallet, 
  IconChartBar, 
  IconArrowUpRight,
  IconClock,
  IconChecklist,
  IconTrendingUp,
  IconBell
} from "@tabler/icons-react";

const StatCard = ({ icon: Icon, title, value, trend, color, isDark = false }) => (
  <motion.div 
    whileHover={{ y: -6 }}
    className={`${isDark ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100'} p-8 rounded-[32px] shadow-sm transition-all hover:shadow-xl overflow-hidden relative group`}
  >
    {isDark && <div className="absolute top-0 right-0 w-32 h-32 bg-zoom-green/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>}
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-zoom-green/20 text-zoom-green' : `bg-${color}-50 text-${color}-600`} flex items-center justify-center`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 ${isDark ? 'bg-zoom-green text-white' : 'bg-green-100 text-green-600'}`}>
          {trend} <IconArrowUpRight size={12} stroke={2} />
        </span>
      )}
    </div>
    <h3 className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-[10px] font-bold uppercase tracking-wider mb-1 relative z-10`}>{title}</h3>
    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} relative z-10`}>{value}</p>
  </motion.div>
);

const VendorHome = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { vendorVehilces } = useSelector((state) => state.vendorDashboardSlice);

  const stats = [
    { icon: IconCar, title: "Total Fleet", value: vendorVehilces?.length || 0, trend: "+2", color: "blue", isDark: false },
    { icon: IconCalendarEvent, title: "Active Bookings", value: "12", trend: "+5", color: "green", isDark: false },
    { icon: IconWallet, title: "Monthly Revenue", value: "₹45,200", trend: "+12%", color: "zoom", isDark: true },
    { icon: IconChartBar, title: "Efficiency", value: "88%", trend: null, color: "orange", isDark: false },
  ];

  return (
    <div className="pb-20 pt-6">
      {/* Header with quick stats */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-zoom-green"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
             Analytics <span className="text-zoom-green">Overview</span>
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm"
        >
            <div className="flex items-center gap-4 px-6 py-3 border-r border-slate-100">
               <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <IconBell size={18} />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Alerts</p>
                  <p className="text-sm font-bold text-slate-900">4 New</p>
               </div>
            </div>
            <div className="flex items-center gap-4 px-6 py-3">
               <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-1">Status</p>
                  <p className="text-sm font-bold text-zoom-green uppercase leading-none">Online</p>
               </div>
               <div className="w-2.5 h-2.5 bg-zoom-green rounded-full animate-pulse"></div>
            </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Analytics Card */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-zoom-green/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-zoom-green/10 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                   Performance <IconTrendingUp className="text-zoom-green" size={20} />
                </h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider mt-1">Net revenue growth +12%</p>
              </div>
              <div className="flex gap-2">
                 {['Daily', 'Weekly', 'Monthly'].map((t) => (
                    <button key={t} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${t === 'Weekly' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>{t}</button>
                 ))}
              </div>
            </div>
            
            <div className="flex items-end gap-3 h-48 mb-10 px-4">
              {[30, 60, 40, 90, 50, 75, 100, 45, 80, 60, 95, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1.2, ease: "circOut" }}
                    className="w-full bg-slate-50 rounded-xl relative group/bar"
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-zoom-green rounded-xl transition-all h-full scale-y-0 group-hover/bar:scale-y-100 origin-bottom opacity-10"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-zoom-green rounded-b-xl"></div>
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-slate-50">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Volume</p>
                    <p className="text-lg font-bold text-slate-900">₹4,25,000</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Value</p>
                    <p className="text-lg font-bold text-slate-900">₹3,450</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth Rate</p>
                    <p className="text-lg font-bold text-zoom-green text-green-600">+18.4%</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Share</p>
                    <p className="text-lg font-bold text-slate-900">14.2%</p>
                </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-8">System Activity</h2>
          <div className="space-y-8 flex-1">
            {[
              { icon: IconClock, text: "Modification", sub: "Swift VXI Update", time: "2m ago", color: "orange" },
              { icon: IconChecklist, text: "Admin Decision", sub: "Glanza Approved", time: "1h ago", color: "green" },
              { icon: IconWallet, text: "Liquidity", sub: "Payment ₹1,200", time: "5h ago", color: "blue" },
              { icon: IconCar, text: "Inventory", sub: "New Vehicle Request", time: "Yesterday", color: "slate" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-5 group cursor-default">
                <div className={`w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-zoom-green/10 group-hover:text-zoom-green transition-all`}>
                  <item.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.text}</p>
                    <span className="text-[9px] text-slate-300 font-bold uppercase">{item.time}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-400 truncate">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 h-14 rounded-2xl bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all">
             Audit Full Logs
          </button>
        </div>

      </div>
    </div>
  );
};

export default VendorHome;