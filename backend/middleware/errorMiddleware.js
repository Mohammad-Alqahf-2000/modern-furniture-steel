// دالة لالتقاط المسارات الغير الموجودة
const notFound = (req, res, next) => {
  const error = new Error(`المسار غير موجود - ${req.originalUrl}`);
  res.status(404);
  next(error); // تمرير الخطأ للدالة التالية
};

// دالة المعالجة المركزية للأخطاء
const errorHandler = (err, req, res, next) => {
  // إذا كان كود الحالة 200 (نجاح) رغم وجود خطأ، اجعله 500 (خطأ سيرفر داخلي)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    // إخفاء الـ stack trace في بيئة الإنتاج كإجراء أمني
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };