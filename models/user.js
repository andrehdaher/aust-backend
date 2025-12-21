const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  studentNum: {
    type: Number,
    required: true,
    unique: true, // 🔹 يمنع تكرار الرقم الجامعي
  },
  password: {
    type: String,
    required: true, // 🔹 كلمة المرور مطلوبة
  },
  name: {
    type: String,
    required: true,
    trim: true, // 🔹 لإزالة المسافات الزائدة
  },
  sex: {
    type: String,
    enum: ['ذكر', 'أنثى'], // 🔹 يحدد القيم الممكنة
    required: true,
  },
  nationalNumber: {
    type: Number,
    required: true,
    unique: true, // 🔹 رقم وطني لا يتكرر عادةً
  },
  place: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: false, // 🔹 يمكن جعله اختياريًا
  },
  nationality: {
    type: String,
    required: true,
  },
  // فرع الطالب (مثل: هندسة معلوماتية، هندسة عمارة، طب اسنان، ...)
  section: {
    type: String,
    required: false,
    trim: true,
  },
  warning: {
    type: Boolean,
    required: false,
    default: false,
  },

  hours: {
    type: Number,
    required: true,
    default: 0,
  },
  role:{
  type: String,
  enum: ['student', 'admin'],
  default: 'student',
  },
  courses: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
],

  createdAt: {
    type: Date,
    default: Date.now, // 🔹 تاريخ إنشاء السجل
  }
});

module.exports = mongoose.model('User', UserSchema);
