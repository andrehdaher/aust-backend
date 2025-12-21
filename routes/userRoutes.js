const express = require('express');
const router = express.Router();
const User = require('../models/user'); // ✅ تأكد من المسار الصحيح للـ schema

// ✅ إضافة مستخدم جديد
router.post('/add', async (req, res) => {
  try {
    const { studentNum, password, name, sex, nationalNumber, place, birthday, nationality, role } = req.body;

    // ✅ تحقق أن جميع الحقول المطلوبة موجودة
    if (!studentNum || !password || !name || !sex || !nationalNumber || !place || !nationality) {
      return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة' });
    }

    // ✅ تحقق من عدم تكرار المستخدم
    const existingUser = await User.findOne({ studentNum });
    if (existingUser) {
      return res.status(400).json({ message: 'الرقم الجامعي مسجل مسبقًا' });
    }


    // ✅ إنشاء مستخدم جديد
    const newUser = new User({
      studentNum,
      password,
      name,
      sex,
      nationalNumber,
      place,
      birthday,
      nationality,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'تمت إضافة المستخدم بنجاح ✅', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'حدث خطأ أثناء إضافة المستخدم' });
  }
});

module.exports = router;
