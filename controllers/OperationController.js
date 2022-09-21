const OperationModel = require("../models/OperationModel");
const UkilModel = require("../models/B");
const ExpoPushTokenModel = require("../models/ExpoPushToken");

module.exports.getOperationData = async (req, res) => {
  try {
    const data = await OperationModel.find()
      .populate("clientId")
      .populate("ukil");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports.getOneOperationData = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await OperationModel.findById(id)
      .populate("clientId")
      .populate("ukil");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports.getOneUkil = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await UkilModel.findById(id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports.paymentComplete = async (req, res) => {
  const { id } = req.params;
  try {
    const operation = await OperationModel.findByIdAndUpdate(id, {
      operationStatus: "payment completed",
    });
    res.status(200).json("payment completed");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
