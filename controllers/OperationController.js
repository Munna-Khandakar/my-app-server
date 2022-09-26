const OperationModel = require("../models/OperationModel");
const UkilModel = require("../models/B");
const UserModel = require("../models/C");
const ExpoPushTokenModel = require("../models/ExpoPushToken");
const { GetRattings } = require("../config/Helpers");

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
    const ukil = await UkilModel.findById(id);
    const rattings = await GetRattings(id);
    const data = { ukil, rattings };
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

module.exports.getAllUser = async (req, res) => {
  try {
    const data = await UserModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports.getAllUkil = async (req, res) => {
  try {
    const data = await UkilModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports.getOneUkilOperationData = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await OperationModel.find({ ukil: id }).populate("clientId");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
