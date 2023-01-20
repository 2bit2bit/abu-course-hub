const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const dbConnect = require("./utils/database");
const path = require("path");
require("dotenv").config();

const csrf = require('csurf')

// const multer  = require('multer')
// const cloudinary = require("cloudinary").v2;

// // Configuration
// cloudinary.config({
//   cloud_name: "dlbdbsepv",
//   api_key: "834411355526916",
//   api_secret: "okATFN0V7RzIiD8sla2ToFu0PtE",
// });

const errorController = require("./controllers/error");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const isAuth = require("./middlewares/is-auth");
const userRoute = require("./routes/user");

// const userModel = require('./models/user')

const app = express();

const csrfProtection = csrf()

dbConnect.connect();

const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
// app.use(multer().single('coverImage'))
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 3000 },
    store: store,
  })
);
app.use(csrfProtection)

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  res.locals.isLoggedIn = req.session.isLoggedIn
  next()
})

app.use(authRoutes);
app.use(blogRoutes);
app.use(isAuth, userRoute);
app.use(errorController.get404);

app.listen(PORT, () => {
  console.log(`http//localhost:${PORT}`);
});
