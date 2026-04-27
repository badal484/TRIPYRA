import { useDispatch, useSelector } from "react-redux";
import ProfileEdit from "../pages/user/ProfileEdit";
import toast, { Toaster } from "react-hot-toast";
import { setUpdated } from "../redux/user/userSlice";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconCalendarEvent, 
  IconId,
  IconShieldCheck,
  IconCamera
} from "@tabler/icons-react";

const UserProfileContent = () => {
  const { email, username, profilePicture, phoneNumber, adress, age, license } = useSelector(
    (state) => state.user.currentUser
  );
  const dispatch = useDispatch();
  const isUpdated = useSelector((state) => state.user.isUpdated);
  
  useEffect(() => {
    if (isUpdated) {
      toast.success("Profile synchronized successfully");
      dispatch(setUpdated(false));
    }
  }, [isUpdated, dispatch]);

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-none group">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-zoom-green group-hover:text-white transition-all">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-900">{value || "Not configured"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6 pb-20">
      <Toaster />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100"
      >
        {/* Modern Cover Header */}
        <div className="h-[200px] bg-slate-900 relative">
           <div className="absolute inset-0 bg-gradient-to-br from-zoom-green/20 to-transparent"></div>
           <div className="absolute top-8 right-8 flex gap-2">
              <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">Verified User</span>
           </div>
        </div>

        <div className="px-10 pb-12 relative">
          {/* Avatar Positioned over Cover */}
          <div className="relative -mt-20 mb-8 inline-block">
            <div className="w-40 h-40 rounded-[48px] border-[6px] border-white shadow-2xl overflow-hidden bg-slate-100">
               <img
                 src={profilePicture}
                 alt="profile"
                 className="w-full h-full object-cover"
               />
            </div>
            <div className="absolute -bottom-2 -right-2 transform translate-x-1/2 -translate-y-1/2">
               <div className="bg-zoom-green text-white p-3 rounded-2xl shadow-lg shadow-zoom-green/30 hover:scale-110 transition-transform cursor-pointer border-4 border-white">
                  <ProfileEdit />
               </div>
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
               {username} <IconShieldCheck className="text-zoom-green" size={32} />
            </h1>
            <p className="text-slate-400 font-bold text-sm">{email}</p>
          </div>

          {/* Grid Layout for Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
             <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6">Personal Attributes</h3>
                <InfoRow icon={IconUser} label="Display Name" value={username} />
                <InfoRow icon={IconMail} label="Email Address" value={email} />
                <InfoRow icon={IconPhone} label="Contact Number" value={phoneNumber} />
                <InfoRow icon={IconMapPin} label="Home Residence" value={adress} />
             </div>

             <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6">Mobility Credentials</h3>
                <InfoRow icon={IconCalendarEvent} label="Verified Age" value={age ? `${age} years` : null} />
                <InfoRow icon={IconId} label="Driving License" value={license} />
                
                <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                   <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                      All data is end-to-end encrypted. We only share verified credentials with vendors during the check-in process.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfileContent;
