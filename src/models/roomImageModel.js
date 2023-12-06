const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createRoomImage: async (roomId, image) => {
    return await prisma.roomImages.create({
      data: {
        roomId: parseInt(roomId),
        images: JSON.stringify(image),
      },
    });
  },

  getRoomImages: async (roomId) => {
    return await prisma.roomImages.findMany({
      where: {
        roomId: parseInt(roomId),
      },
    });
  },

  deleteRoomImages: async (roomId) => {
    return await prisma.roomImages.deleteMany({
      where: {
        roomId: parseInt(roomId),
      },
    });
  },
};
