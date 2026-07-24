// backend/routes/uploadRoutes.js
// مسارات الرفع

const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// إعداد محرك التخزين (Storage Engine)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // المجلد الذي سيتم حفظ الصور فيه
  },
  filename(req, file, cb) {
    // توليد اسم فريد للصورة لتجنب تعارض الأسماء
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// فلتر للتأكد من أن الملف المرفوع هو صورة فقط
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('الصور فقط! (Images Only!)');
  }
}

// تهيئة متغير الرفع
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// المسار الفعلي لرفع الصورة (POST /api/upload)
router.post('/', upload.single('image'), (req, res) => {
  // إعادة مسار الصورة ليتمكن الـ Frontend من حفظه في قاعدة البيانات
  // نستخدم replace لتحويل المسارات في بيئة ويندوز إلى مسارات ويب صحيحة
  const normalizedPath = req.file.path.replace(/\\/g, '/');
  res.send(`/${normalizedPath}`);
});

module.exports = router;