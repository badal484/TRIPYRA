import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { IconMail, IconLock, IconUser, IconArrowRight, IconLoader2, IconAlertCircle, IconX } from "@tabler/icons-react";

const schema = z.object({
  username: z.string().min(3, { message: "Too short" }),
  email: z.string().min(1, { message: "Required" }).email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Min 6 chars" }),
});

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [isError, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (data.succes === false || data.success === false) {
        let msg = data.message;
          if (msg.includes("E11000")) msg = "User already exists";
        setError(msg);
        return;
      }
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[400px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        <div className="bg-slate-900 px-8 py-10 text-white relative">
          <Link to="/" className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><IconX size={20} /></Link>
          <div className="w-12 h-12 bg-zoom-green rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-zoom-green/20"><IconUser size={24} stroke={2.5} /></div>
          <h1 className="text-2xl font-black tracking-tight mb-1">Create account</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Join Tripyra</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1"><div className="relative group"><IconUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-zoom-green transition-colors" size={18} /><input type="text" placeholder="Full name" className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all" {...register("username")} /></div>
            {errors.username && <p className="text-[10px] text-red-500 font-black ml-4 uppercase tracking-tighter">{errors.username.message}</p>}</div>
            <div className="space-y-1"><div className="relative group"><IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-zoom-green transition-colors" size={18} /><input type="email" placeholder="Email address" className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all" {...register("email")} /></div>
            {errors.email && <p className="text-[10px] text-red-500 font-black ml-4 uppercase tracking-tighter">{errors.email.message}</p>}</div>
            <div className="space-y-1"><div className="relative group"><IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-zoom-green transition-colors" size={18} /><input type="password" placeholder="Password" className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all" {...register("password")} /></div>
            {errors.password && <p className="text-[10px] text-red-500 font-black ml-4 uppercase tracking-tighter">{errors.password.message}</p>}</div>
            <AnimatePresence>{isError && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-500"><IconAlertCircle size={16} /><p className="text-[10px] font-black uppercase tracking-tighter">{isError}</p></motion.div>)}</AnimatePresence>
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isLoading} className="w-full h-12 bg-zoom-green text-white rounded-xl font-black text-sm shadow-lg shadow-zoom-green/20 flex items-center justify-center gap-2 hover:bg-[#0e8a0e] transition-all disabled:bg-slate-200">
              {isLoading ? <IconLoader2 className="animate-spin" size={20} /> : <>Sign Up <IconArrowRight size={18} stroke={3} /></>}
            </motion.button>
          </form>
          <div className="mt-6 text-center text-[12px] font-bold text-slate-400">Already a member? <Link to="/signin" className="text-zoom-green hover:underline">Sign In</Link></div>
        </div>
      </motion.div>
    </div>
  );
}
export default SignUp;