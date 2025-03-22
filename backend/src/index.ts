import express, { Express } from "express";  
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";

dotenv.config();

const app: Express = express();  
const port: string | undefined = process.env.PORT;

app.use(express.json());
app.use("/api", userRouter)
app.use("/api", eventRouter)

connectDB()


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
