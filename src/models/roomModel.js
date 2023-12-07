const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getRooms: async () => {
    return await prisma.rooms.findMany({
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
        roomNumber: roomNumber,
        capacity: capacity,
        price: price,
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
        type: data.type,
        capacity: data.capacity,
        price: data.price,
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
};
