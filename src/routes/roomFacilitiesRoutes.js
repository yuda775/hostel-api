const express = require("express");
const router = express.Router();

const roomFacilitiesController = require("../controllers/roomFacilitiesController");

router.get("/", roomFacilitiesController.getRoomFacilities);
router.get("/:id", roomFacilitiesController.getRoomFacilityById);
router.post("/", roomFacilitiesController.createRoomFacility);
router.put("/:id", roomFacilitiesController.updateRoomFacility);
router.delete("/:id", roomFacilitiesController.deleteRoomFacility);

module.exports = router;
