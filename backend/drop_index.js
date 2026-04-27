import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import User from "./models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, attempting to drop bad index...");
    try {
      await User.collection.dropIndex('phoneNumber_1');
      console.log('Successfully dropped the phoneNumber_1 strict unique index!');
    } catch (error) {
      console.log('Index might not exist or another error occurred:', error.message);
    }
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import User from "./models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, attempting to drop bad index...");
    try {
      await User.collection.dropIndex('phoneNumber_1');
      console.log('Successfully dropped the phoneNumber_1 strict unique index!');
    } catch (error) {
      console.log('Index might not exist or another error occurred:', error.message);
    }
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));