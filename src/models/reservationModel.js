// src/models/reservationModel.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  getReservations: async () => {
    return await prisma.reservation.findMany({
      include: {
        room: true,
      },
    });
  },

  getReservationById: async (reservationId) => {
    return await prisma.reservation.findUnique({
      where: { id: reservationId },
    });
  },

  createReservation: async (roomId, data) => {
    return await prisma.reservation.create({
      data: {
        roomId: parseInt(roomId),
        checkin: data.checkin,
        checkout: data.checkout,
        status: data.status,
        amount: data.amount,
        guestTotal: data.guestTotal,
      },
    });
  },

  updateReservation: async (
    reservationId,
    roomId,
    userId,
    checkin,
    checkout
  ) => {
    return await prisma.reservation.update({
      where: { id: parseInt(reservationId) },
      data: {
        roomId: parseInt(roomId),
        userId: parseInt(userId),
        checkin: new Date(checkin),
        checkout: new Date(checkout),
      },
    });
  },

  deleteReservation: async (reservationId) => {
    return await prisma.reservation.delete({
      where: { id: parseInt(reservationId) },
    });
  },

  getReservationsByRoomAndDate: async (roomId, checkin, checkout) => {
    const reservations = await prisma.reservation.findMany({
      where: {
        roomId: roomId,
        OR: [
          {
            AND: [
              { checkin: { lte: new Date(checkout) } },
              { checkout: { gte: new Date(checkin) } },
            ],
          },
          {
            AND: [
              { checkin: { lte: new Date(checkin) } },
              { checkout: { gte: new Date(checkout) } },
            ],
          },
        ],
      },
    });

    return reservations || []; // Selalu kembalikan array, bahkan jika kosong
  },
};
