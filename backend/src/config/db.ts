import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI: string | undefined = process.env.DATABASE;
let dbURIValidadated: string = "";

if(!dbURI) {
  throw new Error("Failed fatch URI database")
} else { 
  dbURIValidadated = dbURI;
}

export const connectDB = () => { 
   mongoose.connect(dbURIValidadated, { dbName: "presenca_plus" })
  .then(() => console.log("Database connected."))
  .catch(() => console.log("Failed to connnect in database."))
}

