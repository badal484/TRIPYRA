import express from "express";
import { getRentals } from "../controllers/rentalsController.js";

const router = express.Router();

router.get("/get-rentals", getRentals);

export default router;