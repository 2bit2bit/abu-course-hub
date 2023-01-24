const express = require("express");
const router = express.Router();

const validateCreateArticle = require("../validators/create-article");
const validateEditArticle = require("../validators/edit-article");

const userController = require("../controllers/user");

router.get("/create-article", userController.getCreateArticle);

router.post(
  "/create-article",
  validateCreateArticle,
  userController.postCreateArticle
);

router.get("/my-articles", userController.getMyArticles);

router.post(
  "/edit-article/:articleId/update_state",
  userController.postUpdateState
);

router.get("/edit-article/:articleId", userController.getEditArticle);
router.post(
  "/edit-article/:articleId",
  validateEditArticle,
  userController.postEditArticle
);

router.post("/delete-article/:articleId", userController.postDeletetArticle);

module.exports = router;
