const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getRooms: async () => {
    return await prisma.rooms.findMany({
      include: {
        images: true,
        roomFacilityRelation: {
          include: {
            facility: true,
          },
        },
      },
    });
  },

  getRoomById: async (roomId) => {
    return await prisma.rooms.findUnique({
      where: {
        id: parseInt(roomId),
      },
      include: {
        images: true,
        roomFacilityRelation: {
          select: {
            facility: true,
          },
        },
      },
    });
  },

  createRoom: async (roomNumber, capacity, price, type) => {
    return await prisma.rooms.create({
      data: {
        roomNumber: parseInt(roomNumber),
        capacity: parseInt(capacity),
        price: parseFloat(price),
        type: type,
      },
    });
  },

  updateRoom: async (roomId, data) => {
    return await prisma.rooms.update({
      where: {
        id: parseInt(roomId),
      },
      data: {
        roomNumber: parseInt(data.roomNumber),
        capacity: parseInt(data.capacity),
        price: parseFloat(data.price),
        type: data.type,
      },
    });
  },

  deleteRoom: async (roomId) => {
    console.log(`Deleting room: ${roomId}`);
    return await prisma.rooms.delete({
      where: {
        id: parseInt(roomId),
      },
    });
  },
  getCapacityByType: async (type) => {
    const room = await prisma.rooms.findFirst({
      where: {
        type: type,
      },
    });

    return room ? room.capacity : 0; // Jika tidak ada kamar dengan tipe tersebut, kembalikan 0
  },

  checkRoomAvailability: async (checkin, checkout, type, guestTotal) => {
    try {
      const availableRooms = await prisma.rooms.findMany({
        where: {
          type,
          capacity: { gte: guestTotal },
          reservation: {
            every: {
              NOT: {
                checkin: { lte: new Date(checkin) },
                checkout: { gte: new Date(checkout) },
                status: { in: ["paid"] },
              },
            },
          },
        },
        select: {
          id: true,
          roomNumber: true,
          type: true,
          price: true,
          capacity: true,
          reservation: {
            where: {
              checkin: { lte: new Date(checkin) },
              checkout: { gte: new Date(checkout) },
            },
            select: {
              id: true,
              checkin: true,
              checkout: true,
              guestTotal: true,
              status: true,
              amount: true,
            },
          },
          images: true,
          roomFacilityRelation: {
            select: {
              facility: true,
            },
          },
        },
      });

      const filteredRooms = availableRooms.filter((room) => {
        const isPrivateRoomValid =
          room.type === "PRIVATE" &&
          room.reservation.every(
            (reservation) =>
              reservation.status === "pending" ||
              reservation.status === "canceled"
          );

        const isDormRoomValid =
          room.type === "DORM" &&
          (room.capacity -
            room.reservation.reduce(
              (total, reservation) => total + reservation.guestTotal,
              0
            ) >=
            guestTotal ||
            room.reservation.every(
              (reservation) =>
                reservation.status === "pending" ||
                reservation.status === "canceled"
            ));

        return isPrivateRoomValid || isDormRoomValid;
      });

      return filteredRooms;
    } catch (error) {
      throw new Error(`Error checking room availability: ${error.message}`);
    }
  },
};
