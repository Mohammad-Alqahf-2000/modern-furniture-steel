// backend/routes/categoryRoutes.js
// مسارات التصنيفات

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');

// جلب كل الأقسام
router.get('/', asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
}));

// جلب قسم محدد مع منتجاته
router.get('/:id', asyncHandler(async (req, res) => {
  const category = await Category.findOne({ id: req.params.id });
  
  if (category) {
    const products = await Product.find({ category: req.params.id });
    res.json({
      ...category._doc,
      products: products
    });
  } else {
    res.status(404);
    throw new Error('القسم غير موجود');
  }
}));

module.exports = router;