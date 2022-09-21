const { updateExpoPushToken } = require("../controllers/TokenController");

const router = require("express").Router();

router.put("/expoPushToken", updateExpoPushToken);

module.exports = router;
