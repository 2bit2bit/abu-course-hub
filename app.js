const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const dbConnect = require("./utils/database");
const path = require("path");
require("dotenv").config();

const flash = require("connect-flash");

const errorController = require("./controllers/error");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");
const userRoute = require("./routes/user");

const app = express();

dbConnect.connect();

const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

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
});
