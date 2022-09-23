const router = require("express").Router();
const Doctor = require("../models/C");
const userB_LoginCheck = require("../middleware/userB_LoginCheck");
const {
  updateProfile,
  updateProfilePicture,
  updateSettings,
  updateLocation,
  getClientLocation,
  checkPayment,
  completeOperation,
  ukilReviewToClient,
} = require("../controllers/User_B_Controller");

// UPDATE UKIL PROFILE
router.put("/profile", userB_LoginCheck, updateProfile);
// UPDATE UKIL LOCATION
router.put("/location", userB_LoginCheck, updateLocation);
// UPDATE ukil charge
router.put("/settings", userB_LoginCheck, updateSettings);
// UPDATE UKIL PROFILE PHOTO
router.put("/profile/photo", userB_LoginCheck, updateProfilePicture);
// GET THE CLIENT LOCATION
router.get("/client/location", userB_LoginCheck, getClientLocation);
// POST THE UKIL PAYMENT STATUS
router.post("/check/payment", userB_LoginCheck, checkPayment);
// POST FINISH THE OPERATION
router.post("/complete/operation", userB_LoginCheck, completeOperation);
// POST REVIEW A CLIENT
router.post("/review", userB_LoginCheck, ukilReviewToClient);

module.exports = router;
