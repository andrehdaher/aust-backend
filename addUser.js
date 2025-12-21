// addAdmin.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");

// تحميل متغيرات البيئة
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("🟢 تم الاتصال بقاعدة البيانات");

    // بيانات الأدمن
    const studentNum = 99999999; // رقم جامعي مميز للأدمن
    const password = "123123"; // كلمة المرور (غير مشفرة - يمكنك لاحقاً تشفيرها)
    const name = "مدير النظام";
    const sex = "ذكر";
    const nationalNumber = 555555555;
    const place = "دمشق";
    const birthday = new Date("1990-01-01");
    const nationality = "سوري";
    const role = "admin";

    // تحقق إذا كان الأدمن موجود مسبقاً
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️ يوجد مدير بالفعل في النظام.");
      return process.exit(0);
    }

    // إنشاء ObjectId مخصص (اختياري)
    const customId = new mongoose.Types.ObjectId("6881182fc169b808649726da");

    // إنشاء الأدمن
    const newAdmin = new User({
      _id: customId,
      studentNum,
      password,
      name,
      sex,
      nationalNumber,
      place,
      birthday,
      nationality,
      role, // 🔹 تعيينه كـ admin
    });

    await newAdmin.save();
    console.log("✅ تم إنشاء حساب الأدمن بنجاح:", newAdmin);

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err);
    process.exit(1);
  });
