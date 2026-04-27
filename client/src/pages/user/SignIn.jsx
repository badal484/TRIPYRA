import { Link, useNavigate } from "react-router-dom";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { IconMail, IconLock, IconArrowRight, IconLoader2, IconAlertCircle, IconX } from "@tabler/icons-react";

const schema = z.object({
  email: z.string().min(1, { message: "Required" }).email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Required" }),
});

function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData, e) => {
    const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "";
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.accessToken) localStorage.setItem("accessToken", data.accessToken);
      if (data?.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      if (data.succes === false || !res.ok) {
        dispatch(loadingEnd());
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      dispatch(loadingEnd());
      if (data.isAdmin) navigate("/adminDashboard");
      else if (data.isVendor) navigate("/vendorDashboard");
      else navigate("/");
    } catch (error) {
      dispatch(loadingEnd());
      dispatch(signInFailure({ message: "Network error" }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100"
      >
        {/* Compact Header */}
        <div className="bg-slate-900 px-8 py-10 text-white relative">
          <Link to="/" className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
            <IconX size={20} />
          </Link>
          <div className="w-12 h-12 bg-zoom-green rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-zoom-green/20">
            <IconLock size={24} stroke={2.5} />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-1">Welcome back</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sign in to continue</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-1.5">
              <div className="relative group">
                <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-zoom-green transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-black ml-4 uppercase tracking-tighter">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-zoom-green transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all"
                  {...register("password")}
                />
              </div>
              <div className="flex justify-end px-1">
                <button type="button" className="text-[10px] font-black text-slate-400 hover:text-zoom-green uppercase tracking-widest">Forgot password?</button>
              </div>
            </div>

            <AnimatePresence>
              {isError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-500">
                  <IconAlertCircle size={16} />
                  <p className="text-[10px] font-black uppercase tracking-tighter">{isError.message || "Error"}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="w-full h-12 bg-zoom-green text-white rounded-xl font-black text-sm shadow-lg shadow-zoom-green/20 flex items-center justify-center gap-2 hover:bg-[#0e8a0e] transition-all disabled:bg-slate-200"
            >
              {isLoading ? <IconLoader2 className="animate-spin" size={20} /> : <>Sign In <IconArrowRight size={18} stroke={3} /></>}
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] flex-1 bg-slate-100"></div>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">Social</span>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>

            <OAuth />
            
            <div className="mt-8 text-center text-[12px] font-bold text-slate-400">
              New here? <Link to="/signup" className="text-zoom-green hover:underline">Create account</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignIn;

import { Link, useNavigate } from "react-router-dom";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { IconMail, IconLock, IconArrowRight, IconLoader2, IconAlertCircle, IconX } from "@tabler/icons-react";

const schema = z.object({
  email: z.string().min(1, { message: "Required" }).email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Required" }),
});

function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const { isLoading, isError } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData, e) => {
    const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "";
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.accessToken) localStorage.setItem("accessToken", data.accessToken);
      if (data?.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      if (data.succes === false || !res.ok) {
        dispatch(loadingEnd());
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      dispatch(loadingEnd());
      if (data.isAdmin) navigate("/adminDashboard");
      else if (data.isVendor) navigate("/vendorDashboard");
      else navigate("/");
    } catch (error) {
      dispatch(loadingEnd());
      dispatch(signInFailure({ message: "Network error" }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px] bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100"
      >
        {/* Compact Header */}
        <div className="bg-slate-900 px-8 py-10 text-white relative">
          <Link to="/" className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
            <IconX size={20} />
          </Link>
          <div className="w-12 h-12 bg-zoom-green rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-zoom-green/20">
            <IconLock size={24} stroke={2.5} />
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-1">Welcome back</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sign in to continue</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="space-y-1.5">
              <div className="relative group">
                <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-zoom-green transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-black ml-4 uppercase tracking-tighter">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-zoom-green transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-12 pl-11 pr-4 bg-slate-50 border-none rounded-xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-zoom-green/20 focus:bg-white transition-all"
                  {...register("password")}
                />
              </div>
              <div className="flex justify-end px-1">
                <button type="button" className="text-[10px] font-black text-slate-400 hover:text-zoom-green uppercase tracking-widest">Forgot password?</button>
              </div>
            </div>

            <AnimatePresence>
              {isError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-500">
                  <IconAlertCircle size={16} />
                  <p className="text-[10px] font-black uppercase tracking-tighter">{isError.message || "Error"}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="w-full h-12 bg-zoom-green text-white rounded-xl font-black text-sm shadow-lg shadow-zoom-green/20 flex items-center justify-center gap-2 hover:bg-[#0e8a0e] transition-all disabled:bg-slate-200"
            >
              {isLoading ? <IconLoader2 className="animate-spin" size={20} /> : <>Sign In <IconArrowRight size={18} stroke={3} /></>}
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] flex-1 bg-slate-100"></div>
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[2px]">Social</span>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>

            <OAuth />
            
            <div className="mt-8 text-center text-[12px] font-bold text-slate-400">
              New here? <Link to="/signup" className="text-zoom-green hover:underline">Create account</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignIn;