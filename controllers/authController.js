const UserModel = require("../models/C"); // C -> user model
const DoctorModel = require("../models/Doctor");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

// USER LOGIN
module.exports.login_controller = async (req, res, next) => {
  const SECRET_KEY = process.env.SECRET_KEY;

  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(404).json({ error: "Please provide all fields value" });
    }

    const checkUser = await UserModel.findOne({ mobile });
    if (!checkUser) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const checkPass = await bcrypt.compare(password, checkUser.password);
    if (!checkPass) {
      return res.status(404).json({ error: "Password not matched" });
    }
    var token = await jwt.sign(
      { _id: checkUser._id, mobile: checkUser.mobile },
      SECRET_KEY
    );

    return res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
};

// USER REGISTRATION
module.exports.register_controller = async (req, res, next) => {
  try {
    if (!req.body.verified) {
      res.status(200).json("Please Verify Your Phone Number first");
    }
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new UserModel({
      mobile: req.body.mobile,
      password: hashedPassword,
    });

    // save user
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

// DOCTOR LOGIN
module.exports.doctor_login_controller = async (req, res, next) => {
  const SECRET_KEY = process.env.SECRET_KEY;

  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(404).json({ error: "Please provide all fields value" });
    }

    const checkUser = await DoctorModel.findOne({ mobile });
    if (!checkUser) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const checkPass = await bcrypt.compare(password, checkUser.password);
    if (!checkPass) {
      return res.status(404).json({ error: "Password not matched" });
    }
    var token = await jwt.sign(
      { _id: checkUser._id, mobile: checkUser.mobile },
      SECRET_KEY
    );

    return res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Something went wrong" });
  }
};

// DOCTOR REGISTRATION
module.exports.doctor_register_controller = async (req, res, next) => {
  try {
    if (!req.body.verified) {
      res.status(200).json("Please Verify Your Phone Number first");
    }
    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new DoctorModel({
      mobile: req.body.mobile,
      password: hashedPassword,
    });

    // save user
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

// DOCTOR REGISTRATION
module.exports.getMyProfile = async (req, res, next) => {
  try {
    // send the user from token

    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json(error);
  }
};
