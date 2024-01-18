const userModel = require("../models/userModel");

module.exports = {
  getUserById: async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findUserById(id);
    res.json({
      status: true,
      user,
      message: "Get user successfully",
    });
  },
};
