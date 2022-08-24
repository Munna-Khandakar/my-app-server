const { sendOTP, verifyOTP } = require("../controllers/verificationController");

const router = require("express").Router();

//router.get("/sessions", getAllSessions);

router.post("/sendOTP", sendOTP);
//router.post("/send-opt", sendOTP);
router.put("/verifyOTP", verifyOTP);

module.exports = router;
