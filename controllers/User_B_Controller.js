const DoctorModel = require("../models/B"); // B->doctor model
const cloudinary = require("../middleware/cloudinary");

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
  // submit the form
  console.log(req.body);
  const photo = await cloudinary.uploader.upload(req.body.photo);
  console.log(photo);
  //const photo = req.file.filename
  req.body.photo = photo.url;
  //console.log(req.body);
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
