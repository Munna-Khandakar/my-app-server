const router = require("express").Router();
const User = require("../models/C");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcrypt");
const {
  login_controller,
  register_controller,
  doctor_login_controller,
  doctor_register_controller,
} = require("../controllers/authController");

// REGISTER
router.post("/register", register_controller);
// router.post("/register", async (req, res) => {
//   try {
//     if (!req.body.verified) {
//       res.status(200).json("Please Verify Your Phone Number first");
//     }
//     // generate new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     // create new user
//     const newUser = new User({
//       mobile: req.body.mobile,
//       password: hashedPassword,
//     });
//     // save user
//     const user = await newUser.save();
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// REGISTER DOCTOR
router.post("/doctor/register", doctor_register_controller);
// router.post("/doctor/register", async (req, res) => {
//   try {
//     if (!req.body.verified) {
//       res.status(200).json("Please Verify Your Phone Number first");
//     }
//     // generate new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);
//     // create new user
//     const newUser = new Doctor({
//       mobile: req.body.mobile,
//       password: hashedPassword,
//     });
//     // save user
//     const user = await newUser.save();
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

//LOGIN
router.post("/login", login_controller);
// router.post("/login", async (req, res) => {
//   try {
//     console.log("user login....");
//     const user = await User.findOne({ mobile: req.body.mobile });
//     !user && res.status(404).json("Invalid Credentials...");

//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     !validPassword && res.status(400).json("wrong password..");
//     // valid user
//     console.log("login successfull...");
//     res.status(200).json(user);
//   } catch (error) {
//     console.log("login error...");
//     res.status(500).json(error);
//   }
// });

//LOGIN DOCTOR
router.post("/doctor/login", doctor_login_controller);
// router.post("/doctor/login", async (req, res) => {
//   try {
//     const user = await Doctor.findOne({ email: req.body.email });
//     !user && res.status(404).json("Invalid Credentials...");

//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     !validPassword && res.status(400).json("wrong password..");
//     // valid user
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
