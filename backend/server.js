// backend/server.js
// خادم الويب

require('dotenv').config();
const path = require('path');
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const mongoose = require('mongoose');

// استيراد الموجهات (Routes)
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// استيراد معالج الأخطاء المركزي (Centralized Error Handler)
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// استخدام متغيرات البيئة 
const MONGO_URI = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/modern-steel';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

connectDB();

// ربط مسارات الـ API (End Points)
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// 🔴 دوال معالجة الأخطاء (يجب أن توضع دائماً بعد كل المسارات)
app.use(notFound);
app.use(errorHandler);

// استخدام متغير البيئة للمنفذ
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`🚀 Server running on port ${PORT}`.yellow.bold));