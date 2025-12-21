const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  hours: {
    type: Number,
    required: true,
    min: 1,
  },
  doctorName: {
    type: String,
    required: true,
    trim: true,
  },
  practicalTeacher: {
    type: String,
    required: false,
    trim: true,
  },
  numberOfClasses: {
    type: Number,
    required: true,
    min: 1,
  },
  classes: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        enum: ["نظري", "عملي", "نظري وعملي"],
        default: "نظري",
      },
      schedule: {
        type: Map,
        of: [String], // مثال: { "السبت": ["08:00 - 10:00", "10:00 - 12:00"], "الأحد": ["02:00 - 04:00"] }
        default: {},
      },
    },
  ],
  // الأقسام/الفروع التي تنطبق عليها المادة (مثال: ["هندسة معلوماتية", "هندسة عمارة"])
  sections: {
    type: [String],
    required: false,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subject", SubjectSchema);
