const UserModel = require("../models/C"); // C->client model
const OperationModel = require("../models/OperationModel"); // C->client model
const { GetRattings } = require("../config/Helpers");
const ReviewModel = require("../models/ReviewModel");

// PUT: api/doctors/profile
// UPDATE DOCTOR
module.exports.updateProfile = async (req, res) => {
  const {
    fullName,
    email,
    nid,
    presentAddressDetails,
    permanentAddressDetails,
  } = req.body;

  try {
    const updatedData = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        fullName,
        email,
        nid,
        presentAddressDetails,
        permanentAddressDetails,
      },
      {
        new: true, // returns the new updated record...
      }
    );
    if (updatedData) {
      console.log("User's Data Saved....");
      return res
        .status(201)
        .json({ success: `Data saved successfully...`, user: updatedData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

module.exports.updateProfilePicture = async (req, res) => {
  try {
    const updatedData = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        photo: req.body.photo,
      },
      {
        new: true, // returns the new updated record...
      }
    );
    if (updatedData) {
      console.log("User's Data Saved....");
      return res
        .status(201)
        .json({ success: `Data saved successfully...`, user: updatedData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

module.exports.cancelEmergencyCall = async (req, res) => {
  console.log(req.params.id);
  try {
    const operation = await OperationModel.findById(req.params.id);
    if (operation.operationStatus === " payment pending") {
      res.status(200).json({
        msg: "the call is already accepted. You can't reject now.",
        code: "accepted",
      });
    } else {
      const updatedData = await OperationModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          operationStatus: "cancel",
        },
        {
          new: true, // returns the new updated record...
        }
      );
      if (updatedData) {
        console.log("User's canceled an emergency call");
        res.status(200).json({
          msg: "The call is terminated",
          code: "cancelled",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

module.exports.getUserReview = async (req, res) => {
  try {
    const review = await GetRattings(req.user._id);
    res.status(200).json(review);
  } catch (error) {
    console.log(error);
  }
};

module.exports.checkUkilAcceptCall = async (req, res) => {
  try {
    const operation = await OperationModel.findById(req.params.id);
    console.log(`checking ukil acceptance ${operation.operationStatus}`);
    if (operation.operationStatus === "payment pending") {
      return res.status(200).json({
        code: "yes",
        msg: "Ukil Accepted The Call. Please Pay The Charge",
      });
    } else {
      return res.status(200).json({
        code: "no",
        msg: "No one accepted the call till now",
      });
    }
  } catch (error) {}
};
module.exports.getrefCode = async (req, res) => {
  try {
    const review = await OperationModel.findById(req.params.id);
    res.status(200).json(review.referenceCode);
  } catch (error) {
    console.log(error);
  }
};

module.exports.checkPayment = async (req, res) => {
  const { operationId } = req.body;
  try {
    const operation = OperationModel.findById(operationId)
      .populate("ukil")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({ error: "Something went wrong" });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

module.exports.userReviewToUkil = async (req, res) => {
  const { receiverId, ratings, review } = req.body;
  try {
    const op = new ReviewModel({
      reviewer: req.user._id,
      ratings: ratings,
      review: review,
      receiver: receiverId,
    });
    const data = await op.save();
    res.status(200).json("Review Saved. Thanks for your review");
  } catch (error) {}
};
