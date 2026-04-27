
import { useDispatch, useSelector } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MenuItem, TextField } from "@mui/material";
import { fetchModelData } from "../../admin/components/AddProductModal";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { motion, AnimatePresence } from "framer-motion";
import { IconUpload, IconCar, IconSettings, IconShieldCheck, IconCash } from "@tabler/icons-react";

const VendorAddProductModal = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      registeration_number: "",
      company: "",
      name: "",
      model: "",
      title: "",
      base_package: "",
      price: "",
      year_made: "",
      fuelType: "",
      carType: "",
      Seats: "",
      transmitionType: "",
      vehicleLocation: "",
      vehicleDistrict: "",
      description: "",
      insurance_end_date: null,
      Registeration_end_date: null,
      polution_end_date: null,
    }
  });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddVehicleClicked } = useSelector((state) => state.addVehicle);
  const { modelData, companyData, locationData, districtData } = useSelector(
    (state) => state.modelDataSlice
  );
  const { _id } = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    fetchModelData(dispatch);
  }, [dispatch]);

  const onSubmit = async (addData) => {
    if (isUploading) return;
    
    try {
      setIsUploading(true);
      const formData = new FormData();
      
      formData.append("registeration_number", addData.registeration_number);
      formData.append("company", addData.company);
      formData.append("name", addData.name);
      formData.append("model", addData.model);
      formData.append("title", addData.title);
      formData.append("description", addData.description);
      formData.append("base_package", addData.base_package);
      formData.append("year_made", addData.year_made);
      formData.append("fuel_type", addData.fuelType);
      formData.append("seat", addData.Seats);
      formData.append("transmition_type", addData.transmitionType);
      formData.append("car_type", addData.carType);
      formData.append("price", addData.price);
      formData.append("location", addData.vehicleLocation);
      formData.append("district", addData.vehicleDistrict);
      formData.append("addedBy", _id);
      
      if (addData.insurance_end_date) formData.append("insurance_end_date", addData.insurance_end_date.$d || addData.insurance_end_date);
      if (addData.Registeration_end_date) formData.append("registeration_end_date", addData.Registeration_end_date.$d || addData.Registeration_end_date);
      if (addData.polution_end_date) formData.append("polution_end_date", addData.polution_end_date.$d || addData.polution_end_date);

      if (addData.image?.length) {
        Array.from(addData.image).forEach(file => formData.append("image", file));
      }

      let tostID = toast.loading("Processing vehicle upload...");
      
      const res = await fetch("/api/vendor/vendorAddVehicle", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("refreshToken")},${localStorage.getItem("accessToken")}` },
        body: formData,
      });

      if (res.ok) {
        toast.success("Vehicle posted successfully!", { id: tostID });
        reset();
        setTimeout(() => {
          navigate("/vendorDashboard/vendorAllVeihcles");
          dispatch(addVehicleClicked(false));
          setIsUploading(false);
        }, 1500);
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Submission failed.", { id: tostID });
        setIsUploading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during upload.");
      setIsUploading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-zoom-green/10 flex items-center justify-center text-zoom-green">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
        <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isAddVehicleClicked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm overflow-y-auto px-4 py-12"
        >
          <Toaster />
          <motion.div
            initial={{ y: 50, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl relative overflow-hidden"
          >
            {/* Header Area */}
            <div className="bg-slate-900 px-10 py-12 text-white relative">
              <button 
                onClick={() => { navigate("/vendorDashboard/vendorAllVeihcles"); dispatch(addVehicleClicked(false)); }}
                className="absolute top-8 right-8 w-12 h-12 rounded-full glass-effect flex items-center justify-center hover:scale-110 transition-all text-white border-white/20"
              >
                <IoMdClose size={24} />
              </button>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-zoom-green flex items-center justify-center shadow-lg shadow-zoom-green/20">
                  <IconCar size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight mb-2">Host Your Vehicle</h1>
                  <p className="text-slate-400 text-lg font-medium opacity-80">Join our hosting community and earn passive income.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-10 lg:p-14">
              <div className="space-y-16">
                
                {/* Section 1: Basics */}
                <div className="vendor-card shadow-none">
                  <SectionHeader icon={IconCar} title="Vehicle Identity" subtitle="Basic information for your car listing." />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TextField fullWidth label="Registration Number" variant="outlined" {...register("registeration_number")} />
                    <Controller
                      control={control}
                      name="company"
                      render={({ field }) => (
                        <TextField {...field} select label="Brand / Company" fullWidth>
                          {companyData.map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>{cur}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    <TextField fullWidth label="Vehicle Model Name" {...register("name")} />
                    <Controller
                      control={control}
                      name="model"
                      render={({ field }) => (
                        <TextField {...field} select label="Model Type" fullWidth>
                          {modelData.map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>{cur}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    <TextField fullWidth label="Year" type="number" {...register("year_made")} />
                    <Controller
                      control={control}
                      name="carType"
                      render={({ field }) => (
                        <TextField {...field} select label="Body Style" fullWidth>
                          <MenuItem value="sedan">Sedan</MenuItem>
                          <MenuItem value="suv">SUV</MenuItem>
                          <MenuItem value="hatchback">Hatchback</MenuItem>
                        </TextField>
                      )}
                    />
                  </div>
                </div>

                {/* Section 2: Technicals */}
                <div className="vendor-card shadow-none">
                  <SectionHeader icon={IconSettings} title="Technicals" subtitle="Transmission, fuel, and seats." />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Controller
                      control={control}
                      name="fuelType"
                      render={({ field }) => (
                        <TextField {...field} select label="Fuel Type" fullWidth>
                          <MenuItem value={"petrol"}>Petrol</MenuItem>
                          <MenuItem value={"diesel"}>Diesel</MenuItem>
                          <MenuItem value={"electric"}>Electric</MenuItem>
                          <MenuItem value={"hybrid"}>Hybrid</MenuItem>
                        </TextField>
                      )}
                    />
                    <Controller
                      control={control}
                      name="transmitionType"
                      render={({ field }) => (
                        <TextField {...field} select label="Gearbox" fullWidth>
                          <MenuItem value={"automatic"}>Automatic</MenuItem>
                          <MenuItem value={"manual"}>Manual</MenuItem>
                        </TextField>
                      )}
                    />
                    <Controller
                      control={control}
                      name="Seats"
                      render={({ field }) => (
                        <TextField {...field} select label="Capacity" fullWidth>
                          <MenuItem value={"5"}>5-Seater</MenuItem>
                          <MenuItem value={"7"}>7-Seater</MenuItem>
                          <MenuItem value={"8"}>8-Seater</MenuItem>
                        </TextField>
                      )}
                    />
                  </div>
                </div>

                {/* Section 3: Pricing & Location */}
                <div className="vendor-card shadow-none">
                  <SectionHeader icon={IconCash} title="Pricing & Hub" subtitle="Where and how much you'll earn." />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    <TextField fullWidth label="Daily Rent (₹)" type="number" {...register("price")} InputProps={{ startAdornment: <span className="mr-2 text-gray-400">₹</span> }} />
                    <Controller
                      control={control}
                      name="vehicleDistrict"
                      render={({ field }) => (
                        <TextField {...field} select label="District" fullWidth>
                          {districtData.map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>{cur}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    <Controller
                      control={control}
                      name="vehicleLocation"
                      render={({ field }) => (
                        <TextField {...field} select label="Pickup Hub" fullWidth>
                          {locationData.map((cur, idx) => (
                            <MenuItem value={cur} key={idx}>{cur}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </div>
                  <TextField fullWidth multiline rows={3} label="Highlights" {...register("description")} />
                </div>

                {/* Section 4: Photo Gallery */}
                <div className="vendor-card shadow-none">
                  <SectionHeader icon={IconShieldCheck} title="Gallery" subtitle="Photos attract more bookings." />
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center">
                    <IconUpload size={32} className="mx-auto mb-4 text-zoom-green" />
                    <input type="file" multiple {...register("image")} className="max-w-xs mx-auto" />
                  </div>
                </div>

                {/* Submit Block */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-gray-100 gap-8">
                  <motion.button 
                    whileHover={{ scale: isUploading ? 1 : 1.02 }} 
                    whileTap={{ scale: isUploading ? 1 : 0.98 }} 
                    type="submit"
                    disabled={isUploading}
                    className={`w-full md:w-[320px] h-20 rounded-3xl text-white text-xl font-bold shadow-xl flex items-center justify-center gap-3 ${
                      isUploading ? 'bg-slate-400 cursor-not-allowed' : 'zoom-green-gradient shadow-zoom-green/20'
                    }`}
                  >
                    {isUploading ? 'Processing...' : 'Go Live Now'}
                  </motion.button>
                </div>

              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VendorAddProductModal;
