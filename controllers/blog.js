exports.getIndex = (req, res, next) => {
  res.render("blog/index", {
    pageTitle: "Alticles",
    path: "/home",
  });
};
