const ExpoPushTokenModel = require("../models/ExpoPushToken");

// PUT: api/token/expoPushToken
// UPDATE  ExpoPushToken
module.exports.updateExpoPushToken = async (req, res) => {
  const { _id, expoPushToken } = req.body;
  try {
    const updatedData = await ExpoPushTokenModel.replaceOne(
      { userId: _id },
      { userId: _id, expoPushToken: expoPushToken },
      { upsert: true }
    );
    if (updatedData) {
      console.log("Doctor's ExpoPushToken Updated....");
      return res.status(201).json(`Data saved successfully...`);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Something went wrong` });
  }
};
