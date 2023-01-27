const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB connected ");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(error);
    next(error);
  }
};
