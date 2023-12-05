const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRoomFacilities = async () => {
  return await prisma.roomFacilities.findMany();
};

const getRoomFacilityById = async (roomFacilityId) => {
  return await prisma.roomFacilities.findUnique({
    where: {
      id: parseInt(roomFacilityId),
    },
  });
};

const createRoomFacility = async (name, fileName) => {
  return await prisma.roomFacilities.create({
    data: {
      name,
      image: fileName,
    },
  });
};

const updateRoomFacility = async (roomFacilityId, updatedData) => {
  return await prisma.roomFacilities.update({
    where: {
      id: parseInt(roomFacilityId),
    },
    data: updatedData,
  });
};

const deleteRoomFacility = async (roomFacilityId) => {
  return await prisma.roomFacilities.delete({
    where: {
      id: parseInt(roomFacilityId),
    },
  });
};

module.exports = {
  getRoomFacilities,
  getRoomFacilityById,
  createRoomFacility,
  updateRoomFacility,
  deleteRoomFacility,
};
