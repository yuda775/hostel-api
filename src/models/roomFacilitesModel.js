const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getRoomFacilities: async () => {
    return await prisma.roomFacilities.findMany();
  },

  getRoomFacilityById: async (roomFacilityId) => {
    return await prisma.roomFacilities.findUnique({
      where: {
        id: parseInt(roomFacilityId),
      },
    });
  },

  createRoomFacility: async (name, fileName) => {
    return await prisma.roomFacilities.create({
      data: {
        name,
        image: fileName,
      },
    });
  },

  updateRoomFacility: async (roomFacilityId, updatedData, image) => {
    return await prisma.roomFacilities.update({
      where: {
        id: parseInt(roomFacilityId),
      },
      data: {
        name: updatedData,
        image: image,
      },
    });
  },

  deleteRoomFacility: async (roomFacilityId) => {
    return await prisma.roomFacilities.delete({
      where: {
        id: parseInt(roomFacilityId),
      },
    });
  },
};
