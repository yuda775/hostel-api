const midtransClient = require("midtrans-client");
const reservationModel = require("../models/reservationModel");
const { json } = require("express");

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

  postPayment: async (req, res) => {
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

      const customerDetails = {
        first_name: "budi",
        last_name: "pratama",
        email: "budi.pra@example.com",
        phone: "08111222333",
      };

      const parameter = {
        transaction_details: transactionDetails,
        credit_card: creditCardDetails,
        customer_details: customerDetails,
      };

      const transaction = await snap.createTransaction(parameter);
      const transactionToken = transaction.token;

      const updatedReservation = {
        status: "complete",
      };

      const postPaymentResult = await reservationModel.updateReservation(
        reservation.id,
        updatedReservation
      );

      res.json({
        status: true,
        customerDetails,
        transactionToken,
        postPaymentResult,
        message: "Payment created successfully",
      });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
