// backend/routes/productRoutes.js
// مسارات المنتجات

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { admin } = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');

// جلب كل المنتجات
router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
}));

// إضافة منتج جديد (صلاحية الأدمن فقط)
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { id, name, price, description, imageUrl, category, details } = req.body;

  const product = new Product({
    id,
    name,
    price,
    description: description || "منتج جديد",
    imageUrl,
    category,
    details
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
}));

// حذف منتج (صلاحية الأدمن فقط)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: req.params.id }); 
  
  if (product) {
    await Product.deleteOne({ id: req.params.id });
    res.json({ message: 'Product removed' });
  } else {
    const productMongo = await Product.findById(req.params.id);
    if (productMongo) {
        await Product.deleteOne({ _id: req.params.id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
  }
}));

// إضافة تقييم لمنتج
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  let product = await Product.findOne({ id: req.params.id });
  if (!product) product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('لقد قمت بتقييم هذا المنتج مسبقاً، شكراً لك!');
    }

    const review = {
      name: req.user.name, 
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'تمت إضافة التقييم بنجاح' });
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
}));

// حذف تقييم (صلاحية الأدمن فقط)
router.delete('/:productId/reviews/:reviewId', protect, admin, asyncHandler(async (req, res) => {
  let product = await Product.findOne({ id: req.params.productId });
  if (!product) product = await Product.findById(req.params.productId);

  if (product) {
    const updatedReviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId.toString()
    );

    product.reviews = updatedReviews;
    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0; 
    }

    await product.save();
    res.json({ message: 'تم حذف التقييم بنجاح' });
  } else {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }
}));

module.exports = router;