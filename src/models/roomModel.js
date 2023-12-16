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
};
