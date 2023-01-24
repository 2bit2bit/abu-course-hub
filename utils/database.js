const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(console.log("MONGODB connected "))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
      next(error);
    });
};
