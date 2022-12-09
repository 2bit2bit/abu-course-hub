const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session'); 

require("dotenv").config();

const errorController = require("./controllers/error");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");

const userModel = require('./models/user')

const app = express();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false}))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 3000 }
}));


app.use(authRoutes);
app.use(blogRoutes);

app.use(errorController.get404);


mongoose
  .connect(MONGODB_URI)
  .then(
    app.listen(PORT, () => {
      console.log(`http//localhost:${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
