const express = require("express");
const router = express.Router();
const passport = require("../User/passport");

const adminController = require("./adminController");

router.post("/social-login", adminController.socialLoginHandler);

router.post("/login", adminController.loginHandler);

router.post("/logout", adminController.logoutHandler);

router.post("/exchange-access-token", adminController.exchangeAccessToken);

// router.get("/admin-list/:id")

// router.get("/admin-list")

// router.get("/user-list/:id")

// router.get("/user-list")

// router.get("/class-list/:id")

// router.get("/class-list")

// router.post("/create-admin-account")

// router.put("/ban-account")

// router.put("/allow-account")

router.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  adminController.getStatistics
);

//router.get("/", adminController.getStatistics)

module.exports = router;
