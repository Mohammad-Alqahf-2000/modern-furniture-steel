// // backend/seeder.js
// // إدخال البيانات

// const mongoose = require('mongoose');
// const colors = require('colors');
// const bcrypt = require('bcryptjs'); // لتشفير كلمة المرور
// const Product = require('./models/Product');
// const Category = require('./models/Category');
// const User = require('./models/User'); 
// const { categories, products } = require('./data/fullData');

// // رابط قاعدة البيانات
// const MONGO_URI = 'mongodb://127.0.0.1:27017/modern-steel';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('✅ Connected to DB...'.cyan);
//   } catch (error) {
//     console.error(`Error: ${error.message}`.red);
//     process.exit(1);
//   }
// };

// const importData = async () => {
//   await connectDB();
//   try {
    
//     await Product.deleteMany();
//     await Category.deleteMany();
//     await User.deleteMany(); 

//     console.log('🗑️  Old data removed...'.red.inverse);

  
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash('123456', salt);

//     const createdUser = await User.create({
//       name: 'Admin User',
//       email: 'admin@example.com',
//       password: hashedPassword,
//       isAdmin: true,
//     });

//     console.log(`👤 Admin User Created: ${createdUser.email}`.blue.inverse);

//     // 3. إدخال الأقسام والمنتجات
//     await Category.insertMany(categories);
//     await Product.insertMany(products);

//     console.log('✅ Data Imported!'.green.inverse);
//     process.exit();
//   } catch (error) {
//     console.error(`Error: ${error.message}`.red.inverse);
//     process.exit(1);
//   }
// };

// const destroyData = async () => {
//   await connectDB();
//   try {
//     await Product.deleteMany();
//     await Category.deleteMany();
//     await User.deleteMany();
//     console.log('Data Destroyed!'.red.inverse);
//     process.exit();
//   } catch (error) {
//     console.error(`${error}`.red.inverse);
//     process.exit(1);
//   }
// };

// if (process.argv[2] === '-d') {
//   destroyData();
// } else {
//   importData();
// }

// backend/seeder.js
// إدخال البيانات

require('dotenv').config(); // 👈 السطر الأهم لقراءة الرابط السحابي من ملف .env
const mongoose = require('mongoose');
const colors = require('colors');
const bcrypt = require('bcryptjs'); // لتشفير كلمة المرور
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User'); 
const { categories, products } = require('./data/fullData');

// 👈 استخدام الرابط السحابي إذا كان موجوداً، أو المحلي كبديل
const MONGO_URI = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/modern-steel';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to DB: ${mongoose.connection.host}`.cyan);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany(); 

    console.log('🗑️  Old data removed...'.red.inverse);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const createdUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
    });

    console.log(`👤 Admin User Created: ${createdUser.email}`.blue.inverse);

    // 3. إدخال الأقسام والمنتجات
    await Category.insertMany(categories);
    await Product.insertMany(products);

    console.log('✅ Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}