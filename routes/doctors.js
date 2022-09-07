const router = require("express").Router();
const Doctor = require("../models/C");
const bcrypt = require("bcrypt");
const userB_LoginCheck = require("../middleware/userB_LoginCheck");
const {
  updateProfile,
  updateProfilePicture,
  updateSettings,
} = require("../controllers/User_B_Controller");
const upload = require("../middleware/multer");
// UPDATE USER
// router.put("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (error) {
//         return res.status(500).json(error);
//       }
//     }
//     try {
//       const user = await Doctor.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account Updated");
//     } catch (error) {
//       return res.status(500).json(error);
//     }
//   } else {
//     return res.status(403).json("You can update only your account");
//   }
// });

router.put("/profile", userB_LoginCheck, updateProfile);
router.put("/settings", userB_LoginCheck, updateSettings);
router.put("/profile/photo", userB_LoginCheck, updateProfilePicture);

// DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await Doctor.findByIdAndDelete(req.params.id);
      res.status(200).json("Account Deleted...");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

// GET A USER
router.get("/:id", async (req, res) => {
  try {
    const user = await Doctor.findById(req.params.id, {
      password: 0,
      updatedAt: 0,
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json("user not found...");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// FOLLOW A USER
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await Doctor.findById(req.params.id);
      const currentUser = await Doctor.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        res.status(200).json("You are following this user...");
      } else {
        res.status(403).json("Already following this user...");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't follow yourself...");
  }
});

// UNFOLLOW A USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await Doctor.findById(req.params.id);
      const currentUser = await Doctor.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        res.status(200).json("You are unfollowing this user...");
      } else {
        res.status(403).json("You are not following this user...");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can't unfollow yourself...");
  }
});
module.exports = router;
