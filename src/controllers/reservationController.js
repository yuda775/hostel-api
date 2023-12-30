const midtransClient = require("midtrans-client");
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
      const { roomId, checkin, checkout, guestTotal } = req.body;

      const room = await roomModel.getRoomById(roomId);
      if (!room) {
        return res
          .status(404)
          .json({ status: false, message: "Room not found" });
      }

      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      if (checkoutDate <= checkinDate) {
        return res.status(400).json({
          status: false,
          message: "Checkout date must be later than checkin date",
        });
      }

      const existingReservations =
        await reservationModel.getReservationsByRoomAndDate(
          roomId,
          checkin,
          checkout
        );

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
          return res
            .status(400)
            .json({ status: false, message: "Room capacity is not enough" });
        }
      } else if (room.type === "PRIVATE" && existingReservations.length > 0) {
        return res.status(400).json({
          status: false,
          message: "Room is not available for the selected dates",
        });
      }

      const durationMilliseconds = checkoutDate - checkinDate;
      const durationDays = Math.ceil(
        durationMilliseconds / (1000 * 60 * 60 * 24)
      );

      const amount =
        room.type === "DORM"
          ? room.price * durationDays * guestTotal
          : room.price * durationDays;

      const customerDetails = {
        first_name: "budi",
        last_name: "pratama",
        email: "budi.pra@example.com",
        phone: "08111222333",
      };

      const reservation = await reservationModel.createReservation(roomId, {
        checkin,
        checkout,
        guestTotal,
        amount,
        customerDetails,
        status: "pending",
      });

      return res.json({
        status: true,
        reservation,
        room,
        message: "Reservation created successfully",
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        status: false,
        message: `Error creating reservation: ${error.message}`,
      });
    }
  },
};
