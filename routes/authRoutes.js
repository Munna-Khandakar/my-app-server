const router = require("express").Router();
const {
  login_controller,
  register_controller,
  doctor_login_controller,
  doctor_register_controller,
  getMyProfile,
} = require("../controllers/authController");
const userC_LoginCheck = require("../middleware/userC_LoginCheck"); // patient
const userB_LoginCheck = require("../middleware/userB_LoginCheck"); // doctor

// REGISTER
router.post("/register", register_controller);

// REGISTER DOCTOR
router.post("/doctor/register", doctor_register_controller);

//LOGIN
router.post("/login", login_controller);

//LOGIN DOCTOR
router.post("/doctor/login", doctor_login_controller);

// GET USER A PROFILE
router.get("/profile", userC_LoginCheck, getMyProfile);

// GET USER B PROFILE
router.get("/doctor/profile", userB_LoginCheck, getMyProfile);
module.exports = router;
