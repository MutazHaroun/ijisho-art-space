const express = require("express");
const router = express.Router();
const {
  requestMTNPayment,
  requestAirtelPayment,
  getPaymentStatus,
  paymentCallback
} = require("../controllers/paymentController");

router.post("/mtn/request", requestMTNPayment);
router.post("/airtel/request", requestAirtelPayment);
router.get("/:id/status", getPaymentStatus);
router.post("/callback", paymentCallback);

module.exports = router;