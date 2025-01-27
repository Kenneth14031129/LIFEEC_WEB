import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import residentRoutes from './routes/residentRoutes.js';
import addResidentRoutes from './routes/addResidentRoutes.js';
import healthRecordRoutes from './routes/healthRecords.js';
import mealRecordRoutes from './routes/mealRecords.js'
import activitiesRecordRoutes from './routes/activitiesRecords.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/addresidents', addResidentRoutes);
app.use('/api', healthRecordRoutes);
app.use('/api', mealRecordRoutes);
app.use('/api', activitiesRecordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});