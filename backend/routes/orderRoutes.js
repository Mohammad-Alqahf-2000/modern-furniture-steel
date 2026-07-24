// backend/routes/orderRoutes.js
// مسارات الطلبات

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { admin } = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    إنشاء طلب جديد
// @access  Private (للمستخدمين المسجلين فقط)
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentImage,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('لا يوجد منتجات في الطلب');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, // ربط الطلب بمعرف المستخدم الحالي
      shippingAddress,
      paymentMethod: paymentMethod || 'الدفع عند الاستلام', 
      paymentImage,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
}));

// @route   GET /api/orders/myorders
// @desc    جلب طلبات المستخدم الحالي
// @access  Private (للمستخدمين المسجلين فقط)
// ملاحظة هامة: يجب أن يكون مسار myorders قبل مسار /:id حتى لا يعتبره السيرفر متغيراً
router.get('/myorders', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// @route   GET /api/orders
// @desc    جلب جميع الطلبات للإدارة
// @access  Private/Admin (للمدراء فقط)
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  // جلب الطلبات مع بيانات المستخدم (الاسم والـ ID)
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
}));

// @route   PUT /api/orders/:id/status
// @desc    تحديث حالة الطلب
// @access  Private/Admin (للمدراء فقط)
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    order.deliveryTime = req.body.deliveryTime || order.deliveryTime;
    
    // التحديث التلقائي لحالة التوصيل إذا اختار الأدمن "تم التسليم"
    if (req.body.status === 'تم التسليم') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    } else {
        order.isDelivered = false;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('الطلب غير موجود');
  }
}));

module.exports = router;