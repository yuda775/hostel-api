const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const paymentController = require("../controllers/paymentController");

router.get("/", reservationController.getReservations);
router.get("/:id", reservationController.getReservationById);
router.post("/", reservationController.createReservation);

router.post("/genereateToken", paymentController.genereateToken);
router.patch("/success", paymentController.paymentSuccess);
router.patch("/cancel", paymentController.paymentCancel);

module.exports = router;
