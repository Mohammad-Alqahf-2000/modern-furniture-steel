// middleware/authMiddleware.js
// دالة لحماية المسارات

const jwt = require('jsonwebtoken'); 
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, jwtConfig.JWT_SECRET); 
      
      req.user = await User.findById(decoded.id).select('-password');
      
      
      // إذا كان التوكن صالحاً لكن المستخدم لم يعد موجوداً في قاعدة البيانات
      if (!req.user) {
        res.status(401);
        throw new Error('المستخدم غير موجود، انتهت الجلسة. يرجى تسجيل الدخول مجدداً.');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('غير مصرح لك، التوكن غير صالح أو منتهي الصلاحية');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('غير مصرح لك، لا يوجد توكن');
  }
});

module.exports = { protect };