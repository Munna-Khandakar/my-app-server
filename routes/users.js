const router = require("express").Router();
const userC_LoginCheck = require("../middleware/userC_LoginCheck");
const {
  updateProfile,
  updateProfilePicture,
  cancelEmergencyCall,
  getUserReview,
  checkUkilAcceptCall,
  checkPayment,
  userReviewToUkil,
} = require("../controllers/User_C_Controller");

//PUT UPDATE USER
router.put("/profile", userC_LoginCheck, updateProfile);
//PUT UPDATE USER PROFILE PHOTO
router.put("/profile/photo", userC_LoginCheck, updateProfilePicture);
//PUT CANCEL A CALL
router.put("/cancel/operation/:id", userC_LoginCheck, cancelEmergencyCall);
// GET GET USER REVIEW
router.get("/myratings", userC_LoginCheck, getUserReview);
// GET CHECK CALL ACCEPTANCE
router.get("/check/call/:id", userC_LoginCheck, checkUkilAcceptCall);
// POST THE UKIL PAYMENT STATUS
router.post("/check/payment", userC_LoginCheck, checkPayment);
// POST REVIEW A UKIL
router.post("/review", userC_LoginCheck, userReviewToUkil);

// // GET PAYMENT REF CODE
// router.get("/get/ref/:id", userC_LoginCheck, getrefCode);
// // DELETE USER
// router.delete("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     try {
//       const user = await User.findByIdAndDelete(req.params.id);
//       res.status(200).json("Account Deleted...");
//     } catch (error) {
//       return res.status(500).json(error);
//     }
//   } else {
//     return res.status(403).json("You can delete only your account");
//   }
// });

// // GET A USER
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id, {
//       password: 0,
//       updatedAt: 0,
//     });
//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(400).json("user not found...");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// // FOLLOW A USER
// router.put("/:id/follow", async (req, res) => {
//   if (req.body.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);

//       if (!user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $push: { followers: req.body.userId } });
//         await currentUser.updateOne({ $push: { followings: req.params.id } });

//         res.status(200).json("You are following this user...");
//       } else {
//         res.status(403).json("Already following this user...");
//       }
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else {
//     res.status(403).json("You can't follow yourself...");
//   }
// });

// // UNFOLLOW A USER
// router.put("/:id/unfollow", async (req, res) => {
//   if (req.body.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);

//       if (user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $pull: { followers: req.body.userId } });
//         await currentUser.updateOne({ $pull: { followings: req.params.id } });

//         res.status(200).json("You are unfollowing this user...");
//       } else {
//         res.status(403).json("You are not following this user...");
//       }
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   } else {
//     res.status(403).json("You can't unfollow yourself...");
//   }
// });
module.exports = router;
