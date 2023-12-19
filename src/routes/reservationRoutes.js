const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");

router.get("/", reservationController.getReservations);
router.get("/:id", reservationController.getReservationById);
router.post("/", reservationController.createReservation);

module.exports = router;
