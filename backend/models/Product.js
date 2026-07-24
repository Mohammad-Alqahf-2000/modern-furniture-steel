// backend/models/Product.js
// نموذج المنتج

const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true }, // إضافة unique لمنع تكرار المعرفات
  name: { type: String, default: "منتج جديد" },
  price: { type: String, default: "غير محدد" }, 
  imageUrl: { type: String, required: true },
  description: { type: String, required: false, default: "" }, 
  details: { type: String, required: false },
  category: { 
    type: String, 
    required: true 
  },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;