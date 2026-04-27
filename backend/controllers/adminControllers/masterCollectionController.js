import MasterData from "../../models/masterDataModel.js";
import { errorHandler } from "../../utils/error.js";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_:-]/g, "");

const stableMasterId = (doc) => {
  if (doc.type === "location") return `loc:${normalize(doc.district)}:${normalize(doc.location)}`;
  return `car:${normalize(doc.brand)}:${normalize(doc.model)}:${normalize(doc.variant)}`;
};

const rawDummyData = [
  // kochi
  { district: "Kochi", location: "kalamassery : skoda service", type: "location" },
  { district: "Kochi", location: "kalamassery : volkswagen", type: "location" },
  { district: "Kochi", location: "cheranallur : volkswagen", type: "location" },

  // kottayam
  { district: "Kottayam", location: "ettumanoor : skoda service", type: "location" },
  { district: "Kottayam", location: "kottayam : railway station", type: "location" },
  { district: "Kottayam", location: "thellakom : volkswagen", type: "location" },

  // trivandrum
  { district: "Trivandrum", location: "Nh 66 bybass : kochuveli railway station", type: "location" },
  { district: "Trivandrum", location: "tampanur : central railway station", type: "location" },
  { district: "Trivandrum", location: "kazhakootam : railway station", type: "location" },

  // thrissur
  { district: "Thrissur", location: "thrissur : railway station", type: "location" },
  { district: "Thrissur", location: "valarkavu : near ganam theater", type: "location" },
  { district: "Thrissur", location: "paliyekara : evm mg", type: "location" },

  // calicut
  { district: "Calicut", location: "calicut : railway", type: "location" },
  { district: "Calicut", location: "calicut : airport", type: "location" },
  { district: "Calicut", location: "pavangad : evm nissan", type: "location" },

  // cars
  { model: "Alto 800", variant: "manual", type: "car", brand: "maruthi" },
  { model: "Alto 800", variant: "automatic", type: "car", brand: "maruthi" },
  { model: "SKODA SLAVIA PETROL AT", variant: "automatic", type: "car", brand: "maruthi" },
  { model: "NISSAN MAGNITE PETROL MT", variant: "manual", type: "car", brand: "nissan" },
  { model: "SKODA KUSHAQ Petrol MT", variant: "manual", type: "car", brand: "skoda" },
  { model: "SKODA KUSHAQ Petrol AT", variant: "automatic", type: "car", brand: "skoda" },
  { model: "MG HECTOR Petrol MT", variant: "manual", type: "car", brand: "mg" },
  { model: "MG HECTOR Petrol AT", variant: "automatic", type: "car", brand: "mg" },
  { model: "MG HECTOR Diesel MT", variant: "manual", type: "car", brand: "mg" },
  { model: "NISSAN TERRANO Diesel MT", variant: "manual", type: "car", brand: "nissan" },
  { model: "NISSAN KICKS Petrol MT", variant: "manual", type: "car", brand: "nissan" },
  { model: "NISSAN KICKS Petrol AT", variant: "manual", type: "car", brand: "nissan" },
  { model: "VW TAIGUN Petrol MT", variant: "manual", type: "car", brand: "volkswagen" },
  { model: "NISSAN MAGNITE Petrol MT", variant: "manual", type: "car", brand: "nissan" },
  { model: "HYUNDAI ALCAZAR Diesel AT", variant: "automatic", type: "car", brand: "hyundai" },
  { model: "CITROEN C3 Petrol MT", variant: "automatic", type: "car", brand: "citroen" },
  { model: "ISUZU MUX Diesel AT", variant: "automatic", type: "car", brand: "isuzu" },
  { model: "MG HECTOR PLUS Petrol MT", variant: "manual", type: "car", brand: "mg" },
  { model: "MG HECTOR PLUS Petrol AT", variant: "automatic", type: "car", brand: "mg" },
  { model: "MG HECTOR PLUS Diesel MT", variant: "manual", type: "car", brand: "mg" },
  { model: "MARUTI SWIFT Petrol AT", variant: "automatic", type: "car", brand: "maruthi" },
  { model: "DATSUN REDI GO Petrol MT", variant: "manual", type: "car", brand: "DATSUN" },
  { model: "DATSUN REDI GO Petrol AT", variant: "automatic", type: "car", brand: "DATSUN" },
  { model: "NISSAN MICRA Petrol MT", variant: "automatic", type: "car", brand: "NISSAN" },
  { model: "VW AMEO Diesel MT", variant: "manual", type: "car", brand: "volkswagen" },
  { model: "SKODA RAPID Petrol MT", variant: "manual", type: "car", brand: "skoda" },
  { model: "MARUTI DZIRE Petrol MT", variant: "manual", type: "car", brand: "maruthi" },
  { model: "VW VENTO Petrol MT", variant: "manual", type: "car", brand: "volkswagen" },
  { model: "VW VENTO Petrol AT", variant: "automatic", type: "car", brand: "volkswagen" },
  { model: "VW VENTO Diesel AT", variant: "automatic", type: "car", brand: "volkswagen" },
  { model: "VW POLO Petrol MT", variant: "manual", type: "car", brand: "volkswagen" },
  { model: "VW POLO Petrol AT", variant: "automatic", type: "car", brand: "volkswagen" },
  { model: "VW POLO Diesel MT", variant: "manual", type: "car", brand: "volkswagen" },
];

const dummyData = rawDummyData.map((doc) => ({ id: stableMasterId(doc), ...doc }));

// Function to insert dummy data into the database (idempotent)
export async function insertDummyData() {
  try {
    const operations = dummyData.map((doc) => ({
      updateOne: {
        filter: { id: doc.id },
        update: { $set: doc },
        upsert: true,
      },
    }));

    if (operations.length === 0) {
      console.log("No master data to seed.");
      return;
    }

    const result = await MasterData.bulkWrite(operations, { ordered: false });
    console.log("Master data upserted successfully.", {
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    });
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  }
}

// app product modal data fetching from db
export const getCarModelData = async (req, res, next) => {
  try {
    const availableVehicleModels = await MasterData.find();
    if (!availableVehicleModels) return next(errorHandler(404, "no model found"));
    res.status(200).json(availableVehicleModels);
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }    
};
        