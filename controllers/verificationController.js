var otpGenerator = require("otp-generator");
const OTPVerificationModel = require("../models/OTPVerificationModel");
const UserModel = require("../models/User");
const { send_verification_sms } = require("../config/smsModule");

// POST: api/sendOTP
// CREATE OTP
module.exports.sendOTP = async (req, res, next) => {
  console.log("sendOTP activated...");
  const { mobile } = req.body;
  console.log("phone number : " + mobile);
  if (!mobile) {
    return res.status(401).json({ error: "Please provide your phone number" });
  }

  // const otp_code = otpGenerator.generate(6, {
  //   digits: true,
  //   upperCase: false,
  //   specialChars: false,
  //   lowerCaseAlphabets: false,
  //   upperCaseAlphabets: false,
  // });

  const otp_code = Math.floor(100000 + Math.random() * 9000);
  console.log("OTP Generated");
  // if the phone number is already registerd
  try {
    const existUser = await UserModel.findOne({ mobile: mobile });
    if (existUser) {
      console.log("User found in User Model");
      return res
        .status(201)
        .json({ error: `This phone is already registerd, try with a new one` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }

  // if otp is sent to the phone number

  try {
    const existOTP = await OTPVerificationModel.findOne({ mobile: mobile });
    if (existOTP) {
      if (existOTP.status === "varified") {
        console.log("Req user is already verified...");
        return res.status(202).json({
          varified: `Phone number is already verified`,
        });
      }
      if (existOTP.status === "notVarified") {
        const oldOTP = await OTPVerificationModel.findOne({ mobile: mobile });
        await oldOTP.updateOne({ $set: { otp: otp_code } });
        send_verification_sms(mobile, otp_code);
        console.log("otp send to the user...");
        return res.status(200).json({
          success: `A verification code sent in this ${mobile} phone number`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }

  const data = {
    mobile: mobile,
    otp: otp_code,
    status: "notVarified",
  };

  try {
    const newData = new OTPVerificationModel(data);
    const savedData = await newData.save();
    send_verification_sms(mobile, otp_code);
    console.log("1st time otp send to user");
    //  console.log(savedData);
    return res.status(200).json({
      success: `A verification code sent in this ${phoneNo} phone number`,
    });
  } catch (error) {
    res.status(500).json(error);
  }

  // console.log(req.body);
  // res.send("ok");
};

module.exports.verifyOTP = async (req, res, next) => {
  const { otp, mobile } = req.body;
  // verify if match then update status to varified
  try {
    const existOTP = await OTPVerificationModel.findOne({
      mobile: mobile,
      otp: otp,
    });

    if (existOTP) {
      if (existOTP.status === "notVarified") {
        await existOTP.updateOne({ $set: { status: "varified" } });
        return res.status(200).json({
          varified: `Phone number verification successfull`,
        });
      }
    } else {
      return res.status(200).json({
        notVarified: `OTP doesn't match`,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};
