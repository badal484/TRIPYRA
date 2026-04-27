import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from './routes/adminRoute.js'
import vendorRoute from './routes/venderRoute.js'
import rentalsRoute from './routes/rentalsRoute.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";


const App = express();


App.use(express.json());
App.use(cookieParser())


import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
const port = 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected"))
  .catch((error) => console.error(error));

  

App.listen(port, () => {
  console.log("server listening !");
});

const allowedOrigins = [
  'https://rent-a-ride-two.vercel.app', 
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175'
]; // Add allowed origins here

App.use(
  cors({
    origin: allowedOrigins,
    methods:['GET', 'PUT', 'POST' ,'PATCH','DELETE'],
    credentials: true, // Enables the Access-Control-Allow-Credentials header
  })
);


// App.use('*', cloudinaryConfig);

// App.get('/*', (req, res) => res.sendFile(resolve(__dirname, '../public/index.html')));


App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin",adminRoute);
App.use("/api/vendor",vendorRoute)
App.use("/api/rentals", rentalsRoute)



App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    succes: false,
    message,
    statusCode,
  });
});
