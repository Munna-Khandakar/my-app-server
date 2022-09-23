// this middleware is only for users
// user c -> patient
const jwt = require("jsonwebtoken");
const UserB_Model = require("../models/B");

module.exports = async (req, res, next) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  const { authorization } = req.headers;
  if (!authorization) {
    console.log("authorization error...");
    return res.status(401).json({ error: "You must be logged in" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, result) => {
    if (err) {
      console.log("error during token verification");
      console.log(err);
      return res.status(401).json({ error: "You must be logged in" });
    } else {
      UserB_Model.findOne({ _id: result._id })
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => {
          console.log("error during finding user from model");
          console.log(err);
          return res.status(404).json({ error: "Something went wrong" });
        });
    }
  });
};
