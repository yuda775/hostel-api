const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createRelation: async (roomId, facilityId) => {
    try {
      return await prisma.roomFacilitiesRelation.create({
        data: {
          roomId: parseInt(roomId),
          facilityId: parseInt(facilityId),
        },
      });
    } catch (error) {
      console.error("Error creating room facility relation:", error);
      throw error;
    }
  },

  deleteRelation: async (roomId) => {
    try {
      return await prisma.roomFacilitiesRelation.deleteMany({
        where: {
          roomId: parseInt(roomId),
        },
      });
    } catch (error) {
      console.error("Error delete room facility relation:", error);
      throw error;
    }
  },
};
