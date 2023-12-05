const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getFacilities: async () => {
    return await prisma.facilities.findMany();
  },

  getFacilityById: async (id) => {
    return await prisma.facilities.findUnique({
      where: { id: parseInt(id) },
    });
  },

  createFacilityWithImage: async (name, image) => {
    return await prisma.facilities.create({
      data: {
        name: name,
        image: image,
      },
    });
  },

  createFacilityWithoutImage: async (name) => {
    return await prisma.facilities.create({
      data: {
        name: name,
      },
    });
  },

  updateFacility: async (id, name) => {
    return await prisma.facilities.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });
  },

  deleteFacility: async (id) => {
    return await prisma.facilities.delete({
      where: { id: parseInt(id) },
    });
  },
};
