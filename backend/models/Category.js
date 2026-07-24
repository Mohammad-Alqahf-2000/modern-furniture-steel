// backend/models/Category.js
// نموذج التصنيف

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, {
  timestamps: true,
});

categorySchema.virtual('products', {
  ref: 'Product',
  localField: 'id',
  foreignField: 'category',
  justOne: false
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;