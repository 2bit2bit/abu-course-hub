const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const dbConnect = require("./utils/database");
const path = require("path");
require("dotenv").config();

const flash = require("connect-flash");

const cloudinary = require("cloudinary").v2;
const multer = require('multer')


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const errorController = require("./controllers/error");
const blogRoutes = require("./routes/blog");
const donateRoutes = require("./routes/donate");
const authRoutes = require("./routes/auth");
const userRoute = require("./routes/user");

const app = express();

const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('coverImage'))

const store = new MongoDBStore(
  {
    uri: process.env.MONGODB_URI,
    collection: "sessions",
  },
  (err) => {
    app.use((req, res, next) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(error);
      next(error);
    });
  }
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 3000 },
    store: store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(authRoutes);
app.use(blogRoutes);
app.use(donateRoutes)
app.use(userRoute);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "/500",
    isLoggedIn: req.session.isLoggedIn,
  });
});


app.listen(PORT, () => {
  console.log(`http//localhost:${PORT}`);
  dbConnect.connect();
});
