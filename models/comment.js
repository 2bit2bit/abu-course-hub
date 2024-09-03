const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ["student", "lecturer"] },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
