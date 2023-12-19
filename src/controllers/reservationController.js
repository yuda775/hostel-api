const reservationModel = require("../models/reservationModel");
const roomModel = require("../models/roomModel");

module.exports = {
  getReservations: async (req, res) => {
    try {
      const reservations = await reservationModel.getReservations();
      res.json({
        status: true,
        reservations,
        message: "Get all reservations successfully",
      });
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getReservationById: async (req, res) => {
    const reservationId = req.params.id;
    try {
      const reservation = await reservationModel.getReservationById(
        reservationId
      );
      res.json({
        status: true,
        reservation,
        message: "Get reservation successfully",
      });
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createReservation: async (req, res) => {
    try {
      const {
        roomId,
        checkin: userCheckin,
        checkout: userCheckout,
        guestTotal,
      } = req.body;

      const room = await roomModel.getRoomById(roomId);
      if (!room) {
        return res.status(404).json({
          status: false,
          message: "Room not found",
        });
      }

      const checkin = new Date(userCheckin);
      const checkout = new Date(userCheckout);

      if (checkout <= checkin) {
        return res.status(400).json({
          status: false,
          message: "Checkout date must be later than checkin date",
        });
      }

      const existingReservations =
        await reservationModel.getReservationsByRoomAndDate(
          roomId,
          userCheckin,
          userCheckout
        );

      // Pemeriksaan apakah existingReservations adalah array
      if (!Array.isArray(existingReservations)) {
        return res.status(400).json({
          status: false,
          message: "Invalid data for existingReservations",
        });
      }

      if (room.type === "DORM") {
        const totalGuests = existingReservations.reduce(
          (total, reservation) => total + reservation.guestTotal,
          0
        );
        if (room.capacity < totalGuests + guestTotal) {
          return res.status(400).json({
            status: false,
            message: "Room capacity is not enough",
          });
        }
      } else if (room.type === "PRIVATE" && existingReservations.length > 0) {
        return res.status(400).json({
          status: false,
          message: "Room is not available for the selected dates",
        });
      }

      const durationMilliseconds = checkout - checkin;
      const durationDays = Math.ceil(
        durationMilliseconds / (1000 * 60 * 60 * 24)
      );
      const amount = room.price * durationDays * guestTotal;

      const reservation = await reservationModel.createReservation(roomId, {
        checkin: userCheckin,
        checkout: userCheckout,
        guestTotal,
        amount,
        status: "pending",
      });

      return res.json({
        status: true,
        reservation,
        room,
        message: "Reservation created successfully",
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        status: false,
        message: `Error creating reservation: ${err.message}`,
      });
    }
  },
};
