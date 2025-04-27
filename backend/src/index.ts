import express, { Express } from "express";  
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
import cors from "cors";
import notificationRouter from "./routes/notificationRoute";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app: Express = express();  
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 2047;


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
app.use('/notifications', notificationRouter); 
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB()

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});