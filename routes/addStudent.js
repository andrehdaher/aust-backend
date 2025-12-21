const express = require('express')
const User = require('../models/user')
const router =express.Router()
const jwt = require("jsonwebtoken");
const middleware = require('../middleware/middleware')
router.post('/add-student', middleware, async (req, res) => {
  try {
    const {
      name,
      studentNum,
      password,
      nationalNumber,
      place,
      hours,
      sex,
      birthday,
      nationality,
      role,
      section,
    } = req.body;

    // 🔍 التحقق من وجود الطالب مسبقًا
    const findUser = await User.findOne({
      $or: [{ studentNum }, { nationalNumber }],
    });

    if (findUser) {
      return res.status(400).json({ message: "الطالب موجود مسبقًا ❌" });
    }

    // 🧩 إنشاء مستخدم جديد
    const newUser = new User({
      name,
      studentNum,
      password,
      nationalNumber,
      place,
      hours,
      sex,
      birthday,
      nationality,
      role,
      section,
    });

    await newUser.save();

    // ✅ رد النجاح
    res.status(201).json({ message: "تمت إضافة الطالب بنجاح ✅", newUser });
  } catch (error) {
    console.error("❌ خطأ في إضافة الطالب:", error);
    res.status(500).json({ message: "حدث خطأ أثناء إضافة الطالب", error });
  }
});


// مثال على مسار API في Express
router.get('/view-students', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const students = await User.find().skip(skip).limit(limit);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الطلاب' });
  }
});

// 🔥 الدالة المطلوبة لواجهة React:
router.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findById(id);

    if (!student) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }

    res.status(200).json({
      message: "تم جلب بيانات الطالب بنجاح",
      student,
    });
  } catch (error) {
    console.error("خطأ أثناء جلب بيانات الطالب:", error);
    res
      .status(500)
      .json({ message: "حدث خطأ في السيرفر أثناء جلب بيانات الطالب" });
  }
});

router.put('/student/:id' , middleware,async(req,res)=>{
  try {
    const { id } = req.params;

    const updatedStudent = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // يرجع البيانات بعد التعديل
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }

    res.json({
      message: "تم تحديث بيانات الطالب بنجاح",
      student: updatedStudent
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "حدث خطأ أثناء التعديل" });
  }
});
router.delete('/student/:id', middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await User.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "الطالب غير موجود" });
    }
    res.json({ message: "تم حذف الطالب بنجاح" });
  } catch (error) {
    console.error("خطأ أثناء حذف الطالب:", error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الطالب" });
  }
});

module.exports = router