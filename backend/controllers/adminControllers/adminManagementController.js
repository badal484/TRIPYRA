import User from "../../models/userModel.js";
import { errorHandler } from "../../utils/error.js";

// Fetch all users (excluding admins if needed, but here simple list)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ }).sort({ createdAt: -1 });
    if (!users) return next(errorHandler(404, "No users found"));
    res.status(200).json(users);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch users"));
  }
};

// Fetch all vendors (Users who have isVendor: true)
export const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ isVendor: true }).sort({ createdAt: -1 });
    if (!vendors) return next(errorHandler(404, "No vendors found"));
    res.status(200).json(vendors);
  } catch (error) {
    next(errorHandler(500, "Failed to fetch vendors"));
  }
};

// Deactivate/Delete user logic could go here
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(errorHandler(500, "Failed to delete user"));
  }
};