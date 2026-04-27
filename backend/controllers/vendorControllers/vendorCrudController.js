import { errorHandler } from "../../utils/error.js";
import vehicle from "../../models/vehicleModel.js";
import { imagekit } from "../../utils/imagekitConfig.js";

// vendor add vehicle
export const vendorAddVehicle = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(errorHandler(400, "Request body cannot be empty"));
    }
    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, "At least one image is required"));
    }

    const vendorId = req.user;
    if (!vendorId) return next(errorHandler(401, "You are not authenticated"));

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
      addedBy: addedByFromBody,
    } = req.body;
    if (addedByFromBody && String(addedByFromBody) !== String(vendorId)) {
      return next(errorHandler(403, "Invalid vendor id"));
    }

    const uploadedImages = [];
    
    // Upload images to ImageKit
    await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await imagekit.upload({
            file: file.buffer, 
            fileName: `vehicle_${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
            folder: "/vehicles"
          });
          uploadedImages.push(result.url);
        } catch (error) {
          console.error("ImageKit upload error:", error);
        }
      })
    );

    if (uploadedImages.length === 0) {
      return next(errorHandler(500, "Image upload to ImageKit failed. Check your keys."));
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
      fuel_type,
      seats: seat,
      transmition: transmition_type,
      insurance_end: insurance_end_date,
      registeration_end: registeration_end_date,
      pollution_end: polution_end_date,
      car_type,
      created_at: Date.now(),
      location,
      district,
      isAdminAdded: false,
      addedBy: vendorId,
      isAdminApproved: true, // Default to true so they are visible immediately
      isRejected: false,
      isDeleted: false
    });

    await addVehicle.save();
    return res.status(200).json({
      success: true,
      message: "Vehicle added successfully",
      data: addVehicle
    });

  } catch (error) {
    console.error("vendorAddVehicle error:", error);
    if (error.code === 11000) {
      return next(errorHandler(409, "Vehicle registration already exists"));
    }
    next(errorHandler(500, "Failed to save vehicle data"));
  }
};

// edit vendor Vehicles
export const vendorEditVehicles = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    if (!vehicle_id) return next(errorHandler(400, "Vehicle ID is required"));

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

    const edited = await vehicle.findByIdAndUpdate(
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
        isAdminApproved: true, // Reset to visible after edit or keep logic as needed
        isRejected: false,
      },
      { new: true }
    );

    if (!edited) return next(errorHandler(404, "Vehicle not found"));
    res.status(200).json(edited);
  } catch (error) {
    console.error("vendorEditVehicles error:", error);
    next(errorHandler(500, "Failed to update vehicle"));
  }
};

// delete vendor Vehicle (soft delete)
export const vendorDeleteVehicles = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    const softDeleted = await vehicle.findByIdAndUpdate(
      vehicle_id,
      { isDeleted: true },
      { new: true }
    );
    if (!softDeleted) return next(errorHandler(404, "Vehicle not found"));
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error deleting vehicle"));
  }
};

// show vendor vehicles
export const showVendorVehicles = async (req, res, next) => {
  try {
    const vendorId = req.user;
    if (!vendorId) return next(errorHandler(401, "You are not authenticated"));
    const { _id } = req.body || {};
    if (_id && String(_id) !== String(vendorId)) {
      return next(errorHandler(403, "Invalid vendor id"));
    }

    const vendorsVehicles = await vehicle.find({
      isDeleted: false,
      isAdminAdded: false,
      addedBy: vendorId
    }).sort({ created_at: -1 });

    res.status(200).json(vendorsVehicles || []);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Error fetching vendor vehicles"));
  }
};
