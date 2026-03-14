import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import authMiddleware from './middleware/auth.js';
import userRouter from './routes/userRoute.js';
import itemrouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderrouter from './routes/orderRoute.js';

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://gharcart-frontend.vercel.app'
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
console.log("Connecting to MongoDB...");
connectDB();

// Routes
app.use("/api/user", userRouter);
app.use('/api/cart', authMiddleware, cartRouter);
app.use('/api/items', itemrouter);
app.use('/api/orders', orderrouter);

// Serve uploads folder for images
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Log uploads folder contents on startup
fs.readdir(uploadsPath, (err, files) => {
  if (err) {
    console.log('Uploads folder error:', err);
  } else {
    console.log('Uploads folder contents:', files);
  }
});

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});