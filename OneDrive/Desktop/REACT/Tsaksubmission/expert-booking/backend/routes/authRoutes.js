const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../controllers/authController");
const upload = require("../middleware/upload");

const validate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    console.log("Validation errors:", errs.array(), req.body);
    return res
      .status(422)
      .json({ error: "Validation failed", details: errs.array() });
  }
  next();
};

router.post(
  "/register-user",
  upload.single("profileImage"),
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  auth.registerUser,
);

router.post(
  "/register-expert",
  upload.single("profileImage"),
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validate,
  auth.registerExpert,
);

router.post("/login-user", auth.loginUser);
router.post("/login-expert", auth.loginExpert);

module.exports = router;
