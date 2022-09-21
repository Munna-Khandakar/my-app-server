const {
  getOperationData,
  getOneOperationData,
  getOneUkil,
  paymentComplete,
} = require("../controllers/OperationController");

const router = require("express").Router();

router.get("/operations", getOperationData);
router.get("/operations/:id", getOneOperationData);
router.put("/operations/payment-complete/:id", paymentComplete);
router.get("/ukil/:id", getOneUkil);

module.exports = router;
