import express, { Express } from "express";  
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
import cors from "cors";
import notificationRouter from "./routes/notificationRoute";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import attendanceRouter from "./routes/attendanceRoutes";
import performBackup from "./cron/backup.cron";
import cron from "node-cron";
import imageRouter from "./controllers/imageController";

dotenv.config();

const app: Express = express();  
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 2047;

// Módulo de backup
// if (process.env.NODE_ENV !== "production") {
//   cron.schedule('0 54 20 * * *', () => {
//     console.log('Iniciando backup diário...');
//     performBackup();
//     console.log('Backup diário concluído.');
//   }, {
//     timezone: "America/Sao_Paulo"
//   });
// }




const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
};
app.options('*', cors(corsOptions));
app.use((req, res, next) => {
  console.log('Received CORS request:', req.method, req.url);
  next();
});
app.use(cors(corsOptions));

// puxa as imagens
const path = require("path");
app.use("/uploads", express.static('uploads'));

app.use(express.json({limit: '20mb'}));
app.use("/api", userRouter)
app.use("/api", imageRouter)
app.use("/api", eventRouter)
app.use("/api", attendanceRouter)
app.use('/notifications', notificationRouter); 
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB()

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});