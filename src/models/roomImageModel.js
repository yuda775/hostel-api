const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createRoomImage: async (roomId, image) => {
    try {
      const createdImage = await prisma.roomImages.create({
        data: {
          roomId: parseInt(roomId),
          images: image,
        },
      });

      return createdImage;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create room image");
    }
  },
  getRoomImages: async (roomId) => {
    return await prisma.roomImages.findMany({
      where: {
        roomId: parseInt(roomId),
      },
    });
  },
  updateRoomImage: async (imageId, newImageData) => {
    try {
      const updatedImage = await prisma.roomImages.update({
        where: {
          id: parseInt(imageId),
        },
        data: newImageData,
      });

      return updatedImage;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update room image");
    }
  },

  deleteRoomImages: async (roomId) => {
    return await prisma.roomImages.deleteMany({
      where: {
        roomId: parseInt(roomId),
      },
    });
  },
};
