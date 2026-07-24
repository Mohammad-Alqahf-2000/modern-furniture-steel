// middleware/roleMiddleware.js
// دالة للتحقق من دور المستخدم

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403); 
    throw new Error('Not authorized as an admin');
  }
};


const userOnly = (req, res, next) => {
  if (req.user && !req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied, users only');
  }
};

module.exports = { admin, userOnly };