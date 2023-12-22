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
      const rooms = await prisma.rooms.findMany({
        where: {
          type: type,
          capacity: { gte: guestTotal },
        },
        select: {
          roomNumber: true,
          type: true,
          price: true,
          capacity: true,
          reservation: {
            where: {
              AND: [
                { checkin: { lte: new Date(checkin) } },
                { checkout: { gte: new Date(checkout) } },
              ],
            },
            select: {
              id: true,
              checkin: true,
              checkout: true,
              guestTotal: true,
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

      const SisaTamu = await prisma.rooms.findMany({
        where: {
          type: type,
          capacity: { gte: guestTotal },
        },
        select: {
          roomNumber: true,
          type: true,
          price: true,
          capacity: true,
          reservation: {
            where: {
              AND: [
                { checkin: { lte: new Date(checkin) } },
                { checkout: { gte: new Date(checkout) } },
              ],
            },
            select: {
              id: true,
              checkin: true,
              checkout: true,
              guestTotal: true,
            },
          },
        },
      });

      console.log("ini sisa tamu = ", SisaTamu);

      return rooms
        .map((room) => {
          if (room.type === "DORM") {
            const totalGuests = room.reservation.reduce(
              (total, reservation) => total + reservation.guestTotal,
              0
            );
            const availableCapacity = room.capacity - totalGuests;

            return {
              roomNumber: room.roomNumber,
              type: room.type,
              price: room.price,
              capacity: room.capacity,
              totalGuests,
              availableCapacity,
              reservations: room.reservation,
            };
          } else if (room.type === "PRIVATE") {
            return room.reservation.length === 0 ? room : null;
          }
        })
        .filter((room) => room !== null);
    } catch (error) {
      console.log(`Error checking room availability: ${error.message}`);
      throw new Error(`Error checking room availability: ${error.message}`);
    }
  },
};
