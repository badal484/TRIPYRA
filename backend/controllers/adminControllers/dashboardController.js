import { errorHandler } from "../../utils/error.js";
import vehicle from "../../models/vehicleModel.js";
import Vehicle from "../../models/vehicleModel.js";
import { imagekit } from "../../utils/imagekitConfig.js";

// admin addVehicle
export const addProduct = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(400, "Body cannot be empty"));
    }

    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, "Image cannot be empty"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      fuel_type,
      description,
      seat,
      transmition_type,
      registeration_end_date,
      insurance_end_date,
      polution_end_date,
      car_type,
      location,
      district,
    } = req.body;

    const uploadedImages = [];

    try {
      await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await imagekit.upload({
              file: file.buffer,
              fileName: `admin_vehicle_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
              folder: "/vehicles"
            });
            uploadedImages.push(result.url);
          } catch (error) {
            console.error("Admin ImageKit upload error:", error);
          }
        })
      );

      if (uploadedImages.length === 0) {
        return next(errorHandler(500, "Image upload to ImageKit failed. Check keys."));
      }

      const addVehicle = new vehicle({
        registeration_number,
        company,
        name,
        image: uploadedImages,
        model,
        car_title: title,
        car_description: description,
        base_package,
        price,
        year_made,
        fuel_type: fuel_type === "ev" ? "electric" : fuel_type, // normalized fuel type
        seats: seat,
        transmition: transmition_type,
        insurance_end: insurance_end_date,
        registeration_end: registeration_end_date,
        pollution_end: polution_end_date,
        car_type,
        created_at: Date.now(),
        location,
        district,
        isAdminAdded: true,
        isAdminApproved: true,
        isDeleted: false
      });

      await addVehicle.save();
      res.status(200).json({
        success: true,
        message: "Product added successfully via ImageKit",
        data: addVehicle
      });

    } catch (error) {
      console.error("Critical error in addProduct:", error);
      if (error.code === 11000) {
        return next(errorHandler(409, "Vehicle already exists"));
      }
      return next(errorHandler(500, "Product not uploaded"));
    }
  } catch (error) {
    console.error(error);
    next(errorHandler(400, "Vehicle failed to add"));
  }
};

// show all vehicles to admin
export const showVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicle.find({ isDeleted: false }).sort({ created_at: -1 });
    if (!vehicles) return next(errorHandler(404, "No vehicles found"));
    res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Something went wrong"));
  }
};

// admin delete vehicle
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    if (!vehicle_id) return next(errorHandler(400, "ID is required"));

    const deleted = await Vehicle.findByIdAndUpdate(vehicle_id, {
      isDeleted: true,
    });
    if (!deleted) return next(errorHandler(500, "Not able to delete"));
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Something went wrong"));
  }
};

// edit vehicle listed by admin
export const editVehicle = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    if (!vehicle_id) return next(errorHandler(400, "Vehicle ID required"));

    if (!req.body || !req.body.formData) {
      return next(errorHandler(404, "Add data to edit first"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      description,
      Seats,
      transmitionType,
      Registeration_end_date,
      insurance_end_date,
      polution_end_date,
      carType,
      fuelType,
      vehicleLocation,
      vehicleDistrict,
    } = req.body.formData;

    const edited = await Vehicle.findByIdAndUpdate(
      vehicle_id,
      {
        registeration_number,
        company,
        name,
        model,
        car_title: title,
        car_description: description,
        base_package,
        price,
        year_made,
        fuel_type: fuelType,
        seats: Seats,
        transmition: transmitionType,
        insurance_end: insurance_end_date,
        registeration_end: Registeration_end_date,
        pollution_end: polution_end_date,
        car_type: carType,
        updated_at: Date.now(),
        location: vehicleLocation,
        district: vehicleDistrict,
      },
      { new: true }
    );
    if (!edited) return next(errorHandler(404, "Vehicle not found"));
    res.status(200).json(edited);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Something went wrong while editing"));
  }
};