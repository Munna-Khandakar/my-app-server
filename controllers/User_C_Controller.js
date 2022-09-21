const UserModel = require("../models/C"); // C->client model
const OperationModel = require("../models/OperationModel"); // C->client model

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
    const updatedData = await OperationModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        operationStatus: "cancel",
      }
      // {
      //   new: true, // returns the new updated record...
      // }
    );
    if (updatedData) {
      console.log("User's canceled an emergency call");
      return res.status(201).json({ msg: `Call canceled` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};
