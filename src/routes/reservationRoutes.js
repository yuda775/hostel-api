const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const paymentController = require("../controllers/paymentController");
const {
  authenticateToken,
  permittedRole,
} = require("../middlewares/authMiddleware");

router.get("/", reservationController.getReservations);
router.get("/:id", reservationController.getReservationById);

router.get(
  "/user/:userId",
  authenticateToken,
  permittedRole(["customer", "admin"]),
  reservationController.getReservationByUserId
);
router.post(
  "/",
  authenticateToken,
  permittedRole(["customer", "admin"]),
  reservationController.createReservation
);

router.post("/generateToken", paymentController.genereateToken);
router.patch("/success", paymentController.paymentSuccess);
router.patch("/cancel", paymentController.paymentCancel);

module.exports = router;
