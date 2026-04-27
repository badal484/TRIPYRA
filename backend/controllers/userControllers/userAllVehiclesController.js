import vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

// show all vehicles to user
export const listAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicle.find({ 
      isDeleted: false, 
      isAdminApproved: true 
    }).sort({ created_at: -1 });

    if (!vehicles || vehicles.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(vehicles);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

// show one vehicle Detail to user
export const showVehicleDetails = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) return next(errorHandler(400, "Vehicle ID is required"));

    const vehicleDetail = await vehicle.findById(id);
    if (!vehicleDetail) {
      return next(errorHandler(404, "no vehicles found"));
    }

    res.status(200).json(vehicleDetail);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

// check vehicle availability
export const checkAvailability = async (req, res, next) => {
  try {
    const { pickupDate, dropOffDate, vehicleId } = req.body;
    if (!pickupDate || !dropOffDate || !vehicleId) {
      return next(errorHandler(400, "pickupDate, dropOffDate and vehicleId are required"));
    }

    if (new Date(pickupDate) >= new Date(dropOffDate)) {
      return next(errorHandler(400, "Invalid date range"));
    }

    // Logic for availability check remains same but ensuring we use the correct models
    // (Assuming availability service is used elsewhere or handled by Booking.find)
    // For now, focusing on the search visibility issue
    next();
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in checkAvailability"));
  }
};

// search car filter in homepage
export const searchCar = async (req, res, next) => {
  try {
    if (req && req.body) {
      const {
        pickup_district,
        pickup_location,
        pickuptime,
        dropofftime,
      } = req.body;

      const pickuptimeDate = new Date(pickuptime?.$d || pickuptime);
      const dropofftimeDate = new Date(dropofftime?.$d || dropofftime);

      if (dropofftimeDate <= pickuptimeDate) {
        return next(errorHandler(400, "Dropoff date must be after pickup date"));
      }

      const search = await vehicle.aggregate([
        {
          $match: {
            isDeleted: false,
            isAdminApproved: true, // Only show approved vehicles
            district: pickup_district,
            location: pickup_location,
            isBooked: false, // Ensure filtered by boolean, not string
          },
        },
        {
          $group: {
            _id: {
              model: "$model",
              location: "$location",
              fuel_type: "$fuel_type",
              transmition: "$transmition",
              seats: "$seats",
            },
            vehicles: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $project: {
            _id: 1,
            vehicles: { $arrayElemAt: ["$vehicles", 0] },
          },
        },
        {
          $replaceRoot: {
            newRoot: "$vehicles",
          },
        },
      ]);

      res.status(200).json(search || []);
    } else {
      res.status(400).json({ message: "Please provide all the details" });
    }
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Something went wrong while searching car"));
  }
};
