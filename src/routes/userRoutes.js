const express = require("express");
const router = express.Router();

const userController = require("../controllers/userConreoller");
const {
  authenticateToken,
  permittedRole,
} = require("../middlewares/authMiddleware");

router.get(
  "/:id",
  authenticateToken,
  permittedRole("admin"),
  userController.getUserById
);

module.exports = router;
