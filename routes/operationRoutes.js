const {
  getOperationData,
  getOneOperationData,
  getOneUkil,
  paymentComplete,
  getAllUser,
  getAllUkil,
  getOneUkilOperationData,
} = require("../controllers/OperationController");

const router = require("express").Router();

router.get("/operations", getOperationData);
router.get("/operations/:id", getOneOperationData);
router.put("/operations/payment-complete/:id", paymentComplete);
router.get("/ukil/:id", getOneUkil);
router.get("/operations/ukil/:id", getOneUkilOperationData);
router.get("/users", getAllUser);
router.get("/ukils", getAllUkil);

module.exports = router;
