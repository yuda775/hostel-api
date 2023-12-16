const path = require("path");

const fileHandler = require("../utils/fileHandler");
const roomFacilitiesModel = require("../models/roomFacilitesModel");
const fileDirectory = "./public/images/roomFacilities/";

module.exports = {
  getRoomFacilities: async (req, res) => {
    try {
      const roomFacilities = await roomFacilitiesModel.getRoomFacilities();
      if (roomFacilities.length === 0) {
        res.status(404).json({ error: "No room facilities found" });
      } else {
        res.status(200).json(roomFacilities);
      }
    } catch (error) {
      console.error("Error retrieving room facilities:", error);
      res.status(500).json({ error: "Failed to retrieve room facilities" });
    }
  },

  getRoomFacilityById: async (req, res) => {
    try {
      const roomFacilityId = req.params.id;
      const roomFacility = await roomFacilitiesModel.getRoomFacilityById(
        roomFacilityId
      );

      if (roomFacility !== null && roomFacility !== undefined) {
        res.json(roomFacility);
      } else {
        res.status(404).json({ error: "Room facility not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  },

  createRoomFacility: async (req, res) => {
    const name = req.body.name;
    const file = req.files.image;

    try {
      await fileHandler.handleImageUpload(fileDirectory, file);

      const roomFacilities = await roomFacilitiesModel.createRoomFacility(
        name,
        file.name
      );

      res.json({
        status: true,
        roomFacilities,
        message: "Create new room facilities successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: `Error uploading file: ${err.message}`,
      });
    }
  },

  updateRoomFacility: async (req, res) => {
    try {
      const roomFacilityId = req.params.id;
      const { name } = req.body;
      const newImage = req.files ? req.files.image : null;
      console.log("ini new image", newImage);

      const existingRoomFacility =
        await roomFacilitiesModel.getRoomFacilityById(roomFacilityId);

      console.log("ini image lama", existingRoomFacility.image);

      if (!existingRoomFacility) {
        return res.status(404).json({
          status: false,
          message: "Facility not found",
        });
      }

      if (newImage) {
        console.log("Before handleImagesCleanup");
        await fileHandler.handleImagesCleanup(
          fileDirectory,
          existingRoomFacility.image
        );
        console.log("After handleImagesCleanup");

        await fileHandler.handleImageUpload(fileDirectory, newImage);
      }

      const updatedFacility = await roomFacilitiesModel.updateRoomFacility(
        roomFacilityId,
        name || existingRoomFacility.name,
        newImage.name || existingRoomFacility.image
      );

      res.json({
        status: true,
        facility: updatedFacility,
        message: "Facility updated successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: `Error updating facility: ${err.message}`,
      });
    }
  },

  deleteRoomFacility: async (req, res) => {
    const roomFacilityId = req.params.id;

    try {
      const roomFacility = await roomFacilitiesModel.getRoomFacilityById(
        roomFacilityId
      );

      if (!roomFacility) {
        return res.status(404).json({
          message: "Room facility not found",
        });
      }

      await fileHandler.handleImagesCleanup(fileDirectory, roomFacility.image);

      await roomFacilitiesModel.deleteRoomFacility(roomFacilityId);

      res.json({
        message: "Room facilities deleted successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: false,
        message: `Error deleting room facilities: ${err.message}`,
      });
    }
  },
};
