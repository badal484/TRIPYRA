import { IconCalendarEvent, IconMapPinFilled, IconX } from "@tabler/icons-react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";

//reducers
import { setAvailableCars, setLocationsOfDistrict, setSelectedDistrict } from "../../redux/user/selectRideSlice";
import { motion } from "framer-motion";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { setSelectedData } from "../../redux/user/BookingDataSlice";
import dayjs from "dayjs";
import useFetchLocationsLov from "../../hooks/useFetchLocationsLov";

const schema = z.object({
  dropoff_location: z.string().min(1, { message: "Dropoff location needed" }),
  pickup_district: z.string().min(1, { message: "Pickup District needed" }),
  pickup_location: z.string().min(1, { message: "Pickup Location needed" }),

  pickuptime: z.object({
    $d: z.instanceof(Date).refine((date) => date !== null && date !== undefined, {
      message: "Date is not selected",
    }),
  }),

  dropofftime: z.object(
    {
      $L: z.string(), // Language code
      $d: z.date(), // Date object
      $y: z.number(), // Year
      $M: z.number(), // Month (0-indexed)
      $D: z.number(), // Day of month
      $W: z.number(), // Day of week (0-indexed, starting from Sunday)
      $H: z.number(), // Hour
      $m: z.number(), // Minute
      $s: z.number(), // Second
      $ms: z.number(), // Millisecond
      $isDayjsObject: z.boolean(), // Indicator for Day.js object
    },
    { message: "drop-off time is required" }
  ),
});

const CarSearch = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pickup_district: "",
      pickup_location: "",
      dropoff_location: "",
      pickuptime: null,
      dropofftime: null,
    },
  });

  const navigate = useNavigate();
  const { districtData } = useSelector((state) => state.modelDataSlice);
  const { fetchLov, isLoading } = useFetchLocationsLov();
  const uniqueDistrict = districtData?.filter((cur, idx) => {
    return cur !== districtData[idx + 1];
  });
  const { selectedDistrict, wholeData, locationsOfDistrict } = useSelector((state) => state.selectRideSlice);

  const [pickup, setPickup] = useState(null);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  //useEffect to fetch data from backend for locations
  useEffect(() => {
    // fetchModelData(dispatch);
    fetchLov();
  }, []);

  //for showing appropriate locations according to districts
  useEffect(() => {
    if (selectedDistrict !== null) {
      const showLocationInDistrict = wholeData
        .filter((cur) => {
          return cur.district === selectedDistrict;
        })
        .map((cur) => cur.location);
      dispatch(setLocationsOfDistrict(showLocationInDistrict));
    }
  }, [selectedDistrict]);

  //search cars
  const handleData = async (data) => {
    try {
      if (data) {
        //preserving the selected data for later use
        dispatch(setSelectedData(data));

        const pickupDate = data.pickuptime.$d;
        const dropOffDate = data.dropofftime.$d;
        const datas = {
          pickupDate,
          dropOffDate,
          pickUpDistrict: data.pickup_district,
          pickUpLocation: data.pickup_location,
        };

        const res = await fetch("/api/user/showSingleofSameModel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datas),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message);
          return;
        }

        if (res.ok) {
          const result = await res.json();
          dispatch(setAvailableCars(result));
          navigate("/availableVehicles");
        }

        if (res.ok) {
          reset({
            pickuptime: null, // Reset pickuptime to null
            dropofftime: null, // Reset dropofftime to null
          });

          const pickupDistrictElement = document.getElementById("pickup_district");
          const pickupLocationElement = document.getElementById("pickup_location");
          const dropoffLocationElement = document.getElementById("dropoff_location");

          if (pickupDistrictElement) {
            pickupDistrictElement.innerHTML = "";
          }
          if (pickupLocationElement) {
            pickupLocationElement.innerHTML = "";
          }
          if (dropoffLocationElement) {
            dropoffLocationElement.innerHTML = "";
          }
        }
      }
    } catch (error) {
      console.log("Error  : ", error);
    }
  };

  //this is to ensure there will be 1 day gap between pickup and dropoff date

  const oneDayGap = pickup && pickup.add(1, "day");

  return (
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        id="booking-section" 
        className="relative z-10 mx-auto w-full max-w-[1200px] mb-20"
      >
        <div className="bg-white rounded-[24px] shadow-[0_12px_44px_0_rgba(0,0,0,0.12)] p-4 md:p-6 mx-auto">
          {/* Messages */}
          <p className="error-message">
            All fields required! <IconX width={20} height={20} />
          </p>
          <p className="booking-done">
            Check your email to confirm an order. <IconX width={20} height={20} />
          </p>

          <form onSubmit={handleSubmit(handleData)}>
            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-2 w-full zoomcar-search-pill">
              
              {/* Pickup District */}
              <div className="flex-1 w-full relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-zoom-green">
                  <span className="w-3 h-3 rounded-full bg-zoom-green inline-block"></span>
                </div>
                <Controller
                  name="pickup_district"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="pickup_district"
                      select
                      fullWidth
                      variant="outlined"
                      label="City"
                      className="capitalize bg-gray-50/50 rounded-xl lg:rounded-l-2xl lg:rounded-r-none"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiInputLabel-root': { paddingLeft: '24px', fontSize: '14px', fontWeight: 'bold' },
                        '& .MuiSelect-select': { paddingLeft: '38px', paddingTop: '24px', paddingBottom: '10px', fontSize: '15px' }
                      }}
                      error={Boolean(errors.pickup_district)}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        dispatch(setSelectedDistrict(e.target.value));
                      }}
                    >
                      {isLoading == true && (
                        <MenuItem value="">
                          <span className="animate-pulse">Loading</span> <span className="animate-pulse">...</span>
                        </MenuItem>
                      )}
                      {!isLoading && <MenuItem value="">Select City</MenuItem>}
                      {uniqueDistrict?.map((cur, idx) => (
                        <MenuItem value={cur} key={idx}>
                          {cur}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </div>

              <div className="hidden lg:block w-[1px] h-10 bg-gray-200"></div>

              {/* Pickup Location */}
              <div className="flex-1 w-full">
                <Controller
                  name="pickup_location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="pickup_location"
                      select
                      fullWidth
                      variant="outlined"
                      label="Pick-Up At"
                      className="capitalize bg-gray-50/50 rounded-xl lg:rounded-none"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                        '& .MuiSelect-select': { paddingTop: '24px', paddingBottom: '10px', fontSize: '15px' }
                      }}
                      error={Boolean(errors.pickup_location)}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {isLoading && (
                        <MenuItem value="">
                          <span className="animate-pulse">Loading</span> <span className="animate-pulse">...</span>
                        </MenuItem>
                      )}
                      {!isLoading && <MenuItem value="">Select Specific Location</MenuItem>}
                      {locationsOfDistrict &&
                        locationsOfDistrict.map((availableLocations, idx) => (
                          <MenuItem value={availableLocations} key={idx}>
                            {availableLocations}
                          </MenuItem>
                        ))}
                    </TextField>
                  )}
                />
              </div>

              <div className="hidden lg:block w-[1px] h-10 bg-gray-200"></div>

              {/* Drop-off Location */}
              <div className="flex-1 w-full">
                <Controller
                  name="dropoff_location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      variant="outlined"
                      label="Drop-Off At"
                      className="capitalize bg-gray-50/50 rounded-xl lg:rounded-none"
                      id="dropoff_location"
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                        '& .MuiSelect-select': { paddingTop: '24px', paddingBottom: '10px', fontSize: '15px' }
                      }}
                      error={Boolean(errors.dropoff_location)}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {isLoading && (
                        <MenuItem value="">
                          <span className="animate-pulse">Loading</span> <span className="animate-pulse">...</span>
                        </MenuItem>
                      )}
                      {!isLoading && <MenuItem value="">Select Specific Location</MenuItem>}
                      {locationsOfDistrict &&
                        locationsOfDistrict.map((availableLocations, idx) => (
                          <MenuItem value={availableLocations} key={idx}>
                            {availableLocations}
                          </MenuItem>
                        ))}
                    </TextField>
                  )}
                />
              </div>

              <div className="hidden lg:block w-[1px] h-10 bg-gray-200"></div>

              {/* Pickup Time */}
              <div className="flex-[1.2] w-full">
                <Controller
                  name={"pickuptime"}
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Pickup Time"
                        {...field}
                        value={field.value}
                        minDate={dayjs()}
                        onChange={(newValue) => {
                          field.onChange(newValue);
                          setPickup(newValue);
                        }}
                        className="bg-gray-50/50 w-full rounded-xl lg:rounded-none"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                          '& .MuiInputBase-input': { paddingTop: '24px', paddingBottom: '10px', fontSize: '15px' }
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
              </div>

              <div className="hidden lg:block w-[1px] h-10 bg-gray-200"></div>

              {/* Dropoff Time */}
              <div className="flex-[1.2] w-full">
                <Controller
                  name={"dropofftime"}
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker 
                        label="Dropoff Time" 
                        {...field} 
                        value={field.value} 
                        minDate={pickup ? oneDayGap : dayjs()} 
                        className="bg-gray-50/50 w-full rounded-xl lg:rounded-none lg:rounded-r-2xl"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiInputLabel-root': { fontSize: '14px', fontWeight: 'bold' },
                          '& .MuiInputBase-input': { paddingTop: '24px', paddingBottom: '10px', fontSize: '15px' }
                        }}
                      />
                    </LocalizationProvider>
                  )}
                />
                {error && <p className="absolute text-[10px] text-red-500 mt-1">{error}</p>}
              </div>

              {/* Submit Button */}
              <div className="w-full lg:w-auto mt-4 lg:mt-0 lg:ml-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="w-full lg:w-[120px] bg-zoom-green text-white hover:bg-[#0e8a0e] transition-all h-[56px] rounded-xl lg:rounded-full font-bold text-[16px] shadow-[0_8px_16px_0_rgba(16,163,16,0.3)] flex items-center justify-center gap-2"
                >
                  <span className="lg:hidden">Find Cars</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </div>

            </div>
          </form>
        </div>
      </motion.section>
  );
};

export default CarSearch;