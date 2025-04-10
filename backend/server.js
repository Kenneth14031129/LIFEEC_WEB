import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import residentRoutes from "./routes/residentRoutes.js";
import addResidentRoutes from "./routes/addResidentRoutes.js";
import healthRecordRoutes from "./routes/healthRecords.js";
import mealRecordRoutes from "./routes/mealRecords.js";
import activitiesRecordRoutes from "./routes/activitiesRecords.js";
import emergencyAlertRoutes from "./routes/emergencyAlertRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// ES Module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "http://localhost:5174",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/addresidents", addResidentRoutes);
app.use("/api", healthRecordRoutes);
app.use("/api", mealRecordRoutes);
app.use("/api", activitiesRecordRoutes);
app.use("/api/emergency-alerts", emergencyAlertRoutes);
app.use("/api", messageRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
