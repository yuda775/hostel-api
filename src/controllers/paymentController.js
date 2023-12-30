const midtransClient = require("midtrans-client");
const reservationModel = require("../models/reservationModel");

module.exports = {
  getPayment: async (req, res) => {
    const paymentId = req.params.id;
    try {
      const payment = await paymentModel.getPayment(paymentId);
      res.json({
        status: true,
        payment,
        message: "Get payment successfully",
      });
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  genereateToken: async (req, res) => {
    try {
      const { reservationId } = req.body;
      const reservation = await reservationModel.getReservationById(
        reservationId
      );

      if (!reservation) {
        return res.status(404).json({
          status: false,
          message: "Reservation not found",
        });
      }

      console.log("reservation", reservation);

      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: "SB-Mid-server-gg9_IQEi6I01MHCk-ijdQpD1",
      });

      const transactionDetails = {
        order_id: reservation.id,
        gross_amount: reservation.amount,
      };

      const creditCardDetails = { secure: true };

      const parameter = {
        transaction_details: transactionDetails,
        credit_card: creditCardDetails,
      };

      const transaction = await snap.createTransaction(parameter);
      const transactionToken = transaction.token;

      res.json({
        status: true,
        transactionToken,
        message: "Payment created successfully",
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  paymentSuccess: async (req, res) => {
    try {
      const { reservationId } = req.body;

      const reservation = await reservationModel.getReservationById(
        reservationId
      );

      const updateData = {
        ...reservation,
        status: "paid",
      };

      const reservationUpdate = await reservationModel.updateReservation(
        reservationId,
        updateData
      );

      res.json({
        status: true,
        reservationUpdate,
        message: "Payment success",
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  paymentCancel: async (req, res) => {
    try {
      const { reservationId } = req.body;

      const reservation = await reservationModel.getReservationById(
        reservationId
      );

      const updateData = {
        ...reservation,
        status: "canceled",
      };

      const reservationUpdate = await reservationModel.updateReservation(
        reservationId,
        updateData
      );

      res.json({
        status: true,
        reservationUpdate,
        message: "Payment canceled",
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
