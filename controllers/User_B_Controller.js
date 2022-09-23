const DoctorModel = require("../models/B"); // B->ukil model
const ReviewModel = require("../models/ReviewModel");
const OperationModel = require("../models/OperationModel");

// PUT: api/doctors/profile
// UPDATE DOCTOR
module.exports.updateProfile = async (req, res) => {
  const {
    fullName,
    email,
    nid,
    presentAddressDetails,
    permanentAddressDetails,
    designation,
  } = req.body;
  try {
    const updatedData = await DoctorModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        fullName,
        email,
        nid,
        presentAddressDetails,
        permanentAddressDetails,
        designation,
      },
      {
        new: true, // returns the new updated record...
      }
    );
    if (updatedData) {
      console.log("Doctor's Data Saved....");
      return res
        .status(201)
        .json({ success: `Data saved successfully...`, user: updatedData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

// PUT: api/doctors/profile
// UPDATE DOCTOR
module.exports.updateSettings = async (req, res) => {
  const { charge } = req.body;
  try {
    const updatedData = await DoctorModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        charge,
      },
      {
        new: true, // returns the new updated record...
      }
    );
    if (updatedData) {
      console.log("Doctor's Data Saved....");
      return res
        .status(201)
        .json({ success: `Data saved successfully...`, user: updatedData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

// PUT: api/doctors/profile/photo
// UPDATE DOCTOR PROFILE PICTURE
module.exports.updateProfilePicture = async (req, res) => {
  try {
    const updatedData = await DoctorModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        photo: req.body.photo,
      },
      {
        new: true, // returns the new updated record...
      }
    );
    if (updatedData) {
      console.log("Doctor's Data Saved....");
      return res
        .status(201)
        .json({ success: `Data saved successfully...`, user: updatedData });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

// PUT: api/doctors/location
// UPDATE DOCTOR
module.exports.updateLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const updatedData = await DoctorModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        location,
      },
      {
        new: true, // returns the new updated record...
      }
    );
    if (updatedData) {
      console.log("Location Updated Saved....");
      return res.status(201).json({
        success: `Location Updated successfully...`,
        user: updatedData,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

module.exports.getAllUkils = async (req, res) => {
  try {
    const ukils = await DoctorModel.find();

    return ukils;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.getClientLocation = async (req, res) => {
  // const {operationId} = req.body;
  try {
    console.log("client location controller");
    res.send("ok");
  } catch (error) {}
};

module.exports.checkPayment = async (req, res) => {
  const { operationId } = req.body;
  try {
    const operation = OperationModel.findById(operationId)
      .populate("clientId")
      .then((data) => {
        console.log(data);
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

module.exports.completeOperation = async (req, res) => {
  const { operationId } = req.body;
  try {
    const updatedData = await OperationModel.findOneAndUpdate(
      { _id: operationId },
      {
        operationStatus: "success",
      },
      {
        new: true, // returns the new updated record...
      }
    );
    if (updatedData) {
      console.log("Operation Complete");
      return res.status(201).json(updatedData);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Somwthing went wrong` });
  }
};

module.exports.ukilReviewToClient = async (req, res) => {
  const { clientId } = req.body;
  console.log(clientId);
  try {
  } catch (error) {}
};
