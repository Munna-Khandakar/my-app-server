const jwt = require("jsonwebtoken");
const UserModel = require("../models/C");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    // console.log('authorization error...');
    return res.status(401).json({ error: "You must be logged in" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, result) => {
    if (err) {
      //  console.log(err);
      return res.status(401).json({ error: "You must be logged in" });
    } else {
      UserModel.findOne({ _id: result._id })
        .then((user) => {
          req.user = user;
          next();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};
