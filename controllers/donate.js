const _ = require("lodash");
const path = require("path");
const Donor = require("../models/donor");
const request = require("request");
const { initializePayment, verifyPayment } =
  require("../utils/paystack")(request);

exports.getDonate = (req, res, next) => {
  res.render("donate/donate", {
    pageTitle: "Donate",
    path: "",
  });
};

exports.postDonate = (req, res, next) => {
  const form = _.pick(req.body, ["amount", "email", "full_name"]);
  form.metadata = {
    full_name: form.full_name,
  };
  form.amount *= 100;

  initializePayment(form, (error, body) => {
    if (error) {
      console.log(error);
      return;
    }
    response = JSON.parse(body);
    res.redirect(response.data.authorization_url);
  });
};

exports.getDonateCallback = (req, res, next) => {
  const ref = req.query.reference;
  verifyPayment(ref, (error, body) => {
    if (error) {
      console.log(error);
      return res.redirect("/donate_error");
    }
    response = JSON.parse(body);
    const data = _.at(response.data, [
      "reference",
      "amount",
      "customer.email",
      "metadata.full_name",
    ]);
    [reference, amount, email, full_name] = data;
    newDonor = { reference, amount, email, full_name };
    const donor = new Donor(newDonor);
    donor
      .save()
      .then((donor) => {
        if (donor) {
          res.redirect("/receipt/" + donor._id);
        }
      })
      .catch((e) => {
        res.redirect("/donate_error");
      });
  });
};

exports.getDonateReciept = (req, res, next) => {
  const id = req.params.id;
  Donor.findById(id)
    .then((donor) => {
      if (!donor) {
        //handle error when the donor is not found
        res.redirect("/donate_error");
      }
      res.render("donate/donate_success", {
        pageTitle: "Donate Success",
        path: "",
        donor,
      });
    })
    .catch((e) => {
      res.render("donate/donate_error", {
        pageTitle: "Donate Error",
        path: "",
      });
    });
};

exports.getDonateError = (req, res, next) => {
  res.render("donate/donate_error", {
    pageTitle: "Donate Error",
    path: "",
  });
};
