const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, fullName, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.createUser({
        email,
        password: hashedPassword,
        fullName,
        role: role || "customer",
      });

      res.json({
        status: true,
        user,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userModel.findUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Memverifikasi kata sandi
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Membuat token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY
      );

      res.json({
        status: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        token,
        message: "User logged in successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  logout: async (req, res) => {
    try {
      res.json({
        status: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      console.error("Error logging out user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
