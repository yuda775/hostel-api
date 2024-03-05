const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");
const {
  authenticateToken,
  permittedRole,
} = require("../middlewares/authMiddleware");

router.get("/", roomController.getRooms);
router.get("/:id", authenticateToken, roomController.getRoomById);
router.post(
  "/",
  authenticateToken,
  permittedRole("admin"),
  roomController.createRoom
);
router.put(
  "/:id",
  authenticateToken,
  permittedRole("admin"),
  roomController.updateRoom
);
router.delete(
  "/:id",
  authenticateToken,
  permittedRole("admin"),
  roomController.deleteRoom
);

router.post("/available-room", roomController.checkRoomAvailability);

module.exports = router;
