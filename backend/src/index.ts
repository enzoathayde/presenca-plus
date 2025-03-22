import express, { Express } from "express";  
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import router from "./routes/userRoutes";

dotenv.config();

const app: Express = express();  
const port: string | undefined = process.env.PORT;

app.use(express.json());
app.use("/api", router)

connectDB()


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
