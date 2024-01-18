const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  createUser: async ({ email, password, fullName, role }) => {
    return prisma.users.create({
      data: {
        email,
        password,
        fullName,
        role,
      },
    });
  },

  findUserByEmail: async (email) => {
    return prisma.users.findUnique({ where: { email } });
  },

  findUserById: async (id) => {
    return prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
  },
};
