import { useDispatch, useSelector } from "react-redux";
import { MdCurrencyRupee, MdVerifiedUser, MdSecurity, MdHistoryEdu } from "react-icons/md";
import { IconCalendar, IconClock, IconChevronRight, IconShieldCheck, IconLock, IconCreditCard, IconTruckLoading, IconMapPin } from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaIndianRupeeSign } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { displayRazorpay } from "./Razorpay";
import { setPageLoading } from "../../redux/user/userSlice";
import { setisPaymentDone } from "../../redux/user/LatestBookingsSlice";
import { setSelectedData } from "../../redux/user/BookingDataSlice";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const schema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  phoneNumber: z.string().min(8, { message: "Phone number is required" }),
  adress: z.string().min(4, { message: "Address is required" }),
  coupon: z.string().optional(),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pickup_district, pickup_location, dropoff_location, pickupDate, dropoffDate } = useSelector((state) => state.bookingDataSlice);
  const currentUser = useSelector((state) => state.user.currentUser);
  const singleVehicleDetail = useSelector((state) => state.userListVehicles.singleVehicleDetail);
  const { isPageLoading } = useSelector((state) => state.user);
  
  // Local states for editable dates
  const [localPickup, setLocalPickup] = useState(pickupDate?.humanReadable ? dayjs(pickupDate.humanReadable) : dayjs());
  const [localDropoff, setLocalDropoff] = useState(dropoffDate?.humanReadable ? dayjs(dropoffDate.humanReadable) : dayjs().add(2, 'day'));
  
  const { handleSubmit, register, watch, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: currentUser?.email || "", phoneNumber: currentUser?.phoneNumber || "", adress: currentUser?.adress || "", coupon: "" }
  });

  const [discount, setDiscount] = useState(0);
  const [addGps, setAddGps] = useState(false);
  const [addChildSeat, setAddChildSeat] = useState(false);
  const [addInsurance, setAddInsurance] = useState(true); // Default to secure

  // Calculate Days
  const Days = Math.max(1, localDropoff.diff(localPickup, 'day'));
  const basePrice = (singleVehicleDetail?.price || 0) * Days;
  const gpsCharge = addGps ? 500 : 0;
  const childSeatCharge = addChildSeat ? 300 : 0;
  const insuranceCharge = addInsurance ? 1000 : 0;
  let totalPrice = basePrice + 50 - discount + gpsCharge + childSeatCharge + insuranceCharge;

  const handlePlaceOrder = async (formData) => {
    const orderData = {
      user_id: currentUser._id,
      vehicle_id: singleVehicleDetail._id,
      totalPrice,
      pickupDate: localPickup.toISOString(),
      dropoffDate: localDropoff.toISOString(),
      pickup_district,
      pickup_location,
      dropoff_location,
      customerDetails: formData
    };

    try {
      dispatch(setPageLoading(true));
      const response = await displayRazorpay(orderData, navigate, dispatch);
      if (!response?.ok) toast.error(response?.message || "Payment failed");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      dispatch(setPageLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-8">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Order Summary (Editable) */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-8"
        >
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Booking Summary</h2>
            
            {/* Vehicle Preview Card */}
            <div className="flex flex-col md:flex-row gap-8 bg-slate-50 p-8 rounded-[32px] mb-10 border border-slate-100">
              <div className="w-full md:w-48 h-32 overflow-hidden rounded-2xl bg-white p-2">
                <img src={singleVehicleDetail?.image[0]} className="w-full h-full object-contain" alt="" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-slate-900 capitalize">{singleVehicleDetail?.name || singleVehicleDetail?.model}</h3>
                  <div className="bg-zoom-green/10 text-zoom-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Confirmed</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight">
                    <p className="flex items-center gap-2"><IconTruckLoading size={14} className="text-zoom-green" /> {singleVehicleDetail?.transmition}</p>
                    <p className="flex items-center gap-2"><IconShieldCheck size={14} className="text-zoom-green" /> Insured Ride</p>
                </div>
              </div>
            </div>

            {/* Editable Search Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-zoom-green uppercase tracking-widest ml-4">Pickup Schedule</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            value={localPickup}
                            onChange={(v) => setLocalPickup(v)}
                            className="w-full bg-slate-50 rounded-2xl"
                            sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                        />
                    </LocalizationProvider>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs ml-4">
                        <IconMapPin size={14} /> {pickup_location || "Select Hub"}
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-zoom-green uppercase tracking-widest ml-4">Dropoff Schedule</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker 
                            value={localDropoff}
                            minDate={localPickup.add(1, 'day')}
                            onChange={(v) => setLocalDropoff(v)}
                            className="w-full bg-slate-50 rounded-2xl"
                            sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                        />
                    </LocalizationProvider>
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs ml-4">
                        <IconMapPin size={14} /> {dropoff_location || "Select Hub"}
                    </div>
                </div>
            </div>

            {/* Policy Info */}
            <div className="p-6 bg-slate-900 rounded-[32px] text-white flex items-center gap-6">
                <div className="w-12 h-12 bg-zoom-green rounded-2xl flex items-center justify-center shrink-0">
                    <IconShieldCheck size={24} />
                </div>
                <div>
                    <h4 className="font-black text-sm uppercase tracking-tight">Full Protection Plan Enabled</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Policy covers minor scratches and maintenance. 24/7 Roadside Assistance included.</p>
                </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Secure Payment & Details */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
        >
          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12 sticky top-10">
            <div className="flex items-center gap-2 mb-8">
                <IconLock size={20} className="text-zoom-green" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Secure Payment</h2>
            </div>

            <form onSubmit={handleSubmit(handlePlaceOrder)} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Personal Details</label>
                <input {...register("email")} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-zoom-green/20 outline-none transition-all placeholder:text-slate-200" placeholder="Email Address" />
                {errors.email && <p className="text-[10px] text-red-500 font-bold ml-4">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input {...register("phoneNumber")} className="h-14 px-6 bg-slate-50 rounded-2xl font-bold outline-none" placeholder="Phone" />
                <input {...register("coupon")} className="h-14 px-6 bg-slate-50 rounded-2xl font-bold outline-none" placeholder="Coupon" />
              </div>

              <textarea {...register("adress")} rows={3} className="w-full p-6 bg-slate-50 rounded-2xl font-bold outline-none resize-none" placeholder="Residential Address for Verification" />

                {/* Secure Add-ons */}
                <div className="pt-4 space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Protection & Add-ons</label>
                    <div 
                        onClick={() => setAddInsurance(!addInsurance)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${addInsurance ? 'bg-zoom-green/5 border-zoom-green text-zoom-green' : 'bg-slate-50 border-transparent text-slate-400'}`}
                    >
                        <div className="flex items-center gap-3">
                            <IconShieldCheck size={20} />
                            <span className="text-xs font-black uppercase tracking-tight">Comprehensive Insurance</span>
                        </div>
                        <span className="text-xs font-black">₹1,000</span>
                    </div>
                </div>

              {/* Price Calculation */}
              <div className="pt-8 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between text-slate-500 font-bold text-sm">
                      <span>Rent for {Days} days</span>
                      <span className="text-slate-900">₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold text-sm">
                      <span>Processing Fee</span>
                      <span className="text-slate-900">₹50</span>
                  </div>
                  {addInsurance && (
                    <div className="flex justify-between text-zoom-green font-bold text-sm">
                        <span>Insurance Coverage</span>
                        <span>₹1,000</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-4">
                      <span className="text-lg font-black text-slate-900">Total Price</span>
                      <div className="text-right">
                          <p className="text-3xl font-black text-slate-900 tracking-tight">₹{totalPrice}</p>
                          <span className="text-[10px] text-slate-400 font-black uppercase">Tax Included</span>
                      </div>
                  </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isPageLoading}
                className="w-full h-16 bg-slate-900 text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-zoom-green transition-all shadow-xl shadow-slate-200"
              >
                {isPageLoading ? <IconClock className="animate-spin" /> : <>Pay & Reserve Securely <IconCreditCard size={20} /></>}
              </motion.button>

              {/* Trust Signals */}
              <div className="flex justify-center items-center gap-6 pt-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png" className="h-4" alt="Razorpay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png" className="h-3" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6" alt="Mastercard" />
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;