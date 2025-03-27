import express, { Express } from "express";  
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
import cors from "cors";

dotenv.config();

const app: Express = express();  
const port: string | undefined = process.env.PORT;


const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  console.log('Received CORS request:', req.method, req.url);
  next();
});
app.use(cors(corsOptions));


app.use(express.json());
app.use("/api", userRouter)
app.use("/api", eventRouter)

connectDB()

app.listen(2047, "192.168.1.103", () => {
  console.log(`Server is running on port ${port}`);
});