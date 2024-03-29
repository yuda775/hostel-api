// src/models/reservationModel.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  getReservations: async () => {
    return await prisma.reservation.findMany({
      include: {
        Users: {
          select: {
            fullName: true,
          },
        },
        room: {
          select: {
            roomNumber: true,
            type: true,
            price: true,
            capacity: true,
            images: true,
            roomFacilityRelation: {
              include: {
                facility: true,
              },
            },
          },
        },
      },
    });
  },

  getReservationById: async (reservationId) => {
    return await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        room: {
          select: {
            images: true,
            roomNumber: true,
            type: true,
            price: true,
            capacity: true,
            roomFacilityRelation: {
              include: {
                facility: true,
              },
            },
          },
        },
      },
    });
  },

  getReservationByUserId: async (userId) => {
    return await prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      include: {
        room: {
          select: {
            images: true,
            roomNumber: true,
            type: true,
            price: true,
            capacity: true,
            roomFacilityRelation: {
              include: {
                facility: true,
              },
            },
          },
        },
      },
    });
  },

  createReservation: async (roomId, data) => {
    return await prisma.reservation.create({
      data: {
        roomId: parseInt(roomId),
        checkin: new Date(data.checkin),
        checkout: new Date(data.checkout),
        status: data.status,
        amount: data.amount,
        guestTotal: data.guestTotal,
        userId: parseInt(data.userId),
      },
    });
  },

  updateReservation: async (reservationId, updateData) => {
    return await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        checkin: updateData.checkin,
        checkout: updateData.checkout,
        status: updateData.status,
        amount: updateData.amount,
        guestTotal: updateData.guestTotal,
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
