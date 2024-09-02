const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const dbConnect = require("./utils/database");
const path = require("path");
require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");
const flash = require("connect-flash");

const multer = require("multer");
const multerS3 = require("multer-s3");

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your Secret Access Key
  region: "eu-north-1", // Replace with your bucket's region
};

const errorController = require("./controllers/error");
const blogRoutes = require("./routes/blog");
const dashboardLecturerRoutes = require("./routes/dashboard-lecturer");
const dashboardStudentRoutes = require("./routes/dashboard-student");

const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

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

const s3 = new S3Client(config);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 60 * 60 * 3000 },
    store: store,
  })
);

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "vibingvisual",
    metadata: function (req, file, cb) {
      cb(null, {
        originalname: file.originalname, // Store the original file name
      });
    },
    key: function (req, file, cb) {
      cb(null, `materials/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
});
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(upload.single("material"));

app.use(flash());

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Home",
    isLoggedIn: req.session.isLoggedIn || false,
    role: req.session.role || "",
    path: "/",
  });
});

app.use(authRoutes);
app.use(dashboardLecturerRoutes);
app.use(dashboardStudentRoutes);
app.use(blogRoutes);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "/500",
    isLoggedIn: req.session.isLoggedIn,
    role: req.session.role,
  });
});

dbConnect.connect(
  app.listen(PORT, () => {
    console.log(`http//localhost:${PORT}`);
  })
);

module.exports = s3;
