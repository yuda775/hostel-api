const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getRooms: async () => {
    return await prisma.rooms.findMany({
      include: {
        images: true,
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
      },
    });
  },

  createRoom: async (roomData) => {
    return await prisma.rooms.create({
      data: {
        roomNumber: parseInt(roomData.roomNumber),
        category: roomData.category,
      },
    });
  },

  updateRoom: async (roomId, updatedRoomData) => {
    return await prisma.rooms.update({
      where: {
        id: parseInt(roomId),
      },
      data: {
        roomNumber: parseInt(updatedRoomData.roomNumber),
        category: updatedRoomData.category,
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
