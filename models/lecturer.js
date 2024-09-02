const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const lecturerSchema = new Schema({
  staffID: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

lecturerSchema.pre("save", async function (next) {
  const lecturer = this;
  if (lecturer.isModified("password") || lecturer.isNew) {
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
  }
  next();
});

module.exports = mongoose.model("Lecturer", lecturerSchema);
