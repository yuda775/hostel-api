const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const paymentController = require("../controllers/paymentController");
const {
  authenticateToken,
  permittedRole,
} = require("../middlewares/authMiddleware");

router.get(
  "/",
  authenticateToken,
  permittedRole(["admin"]),
  reservationController.getReservations
);
router.get("/:id", reservationController.getReservationById);

router.get(
  "/user/:userId",
  authenticateToken,
  permittedRole(["customer", "admin"]),
  reservationController.getReservationByUserId
);
router.post("/", authenticateToken, (req, res, next) => {
  const userRole = req.user.role;
  console.log("userRole", userRole);
  if (userRole === "customer") {
    reservationController.createReservation(req, res, next);
  } else if (userRole === "admin") {
    reservationController.createReservationByAdmin(req, res, next);
  } else {
    // Handle peran lainnya jika diperlukan
    res.status(403).json({ error: "Permission denied" });
  }
});

router.post("/generateToken", paymentController.genereateToken);
router.patch("/success", paymentController.paymentSuccess);
router.patch("/cancel", paymentController.paymentCancel);

module.exports = router;
