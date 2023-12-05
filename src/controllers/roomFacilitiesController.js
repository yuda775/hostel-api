const path = require("path");
const uuid = require("uuid");
const filesHandler = require("../utils/filesHandler");

const roomFacilitiesModel = require("../models/roomFacilitesModel");
const fileDirectory = "./public/images/roomFacilities/";

const getRoomFacilities = async (req, res) => {
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
};

const getRoomFacilityById = async (req, res) => {
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
};

const createRoomFacility = async (req, res) => {
  const name = req.body.name;
  const file = req.files.image;

  try {
    if (await filesHandler.directoryExists(fileDirectory)) {
      await filesHandler.createNewDirectory(fileDirectory);
    }

    const fileName = uuid.v4() + path.extname(file.name);
    await file.mv(fileDirectory + fileName);
    console.log("File uploaded successfully");

    const roomFacilities = await roomFacilitiesModel.createRoomFacility(
      name,
      fileName
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
};

const updateRoomFacility = async (req, res) => {
  const roomFacilityId = req.params.id;
  const { name } = req.body;
  const newImage = req.files ? req.files.image : null;

  try {
    const existingRoomFacility = await roomFacilitiesModel.getRoomFacilityById(
      roomFacilityId
    );

    if (!existingRoomFacility) {
      return res.status(404).json({
        status: false,
        message: "Facility not found",
      });
    }

    // Mengganti nama dan/atau gambar jika ada data baru
    const updatedData = {
      name: name || existingRoomFacility.name,
    };

    if (newImage) {
      // Menghapus gambar lama
      await filesHandler.deleteFile(fileDirectory + existingRoomFacility.image);

      // Menyimpan gambar baru
      const fileName = uuid.v4() + path.extname(newImage.name);
      await newImage.mv(fileDirectory + fileName);
      console.log("File replaced successfully");

      updatedData.image = fileName;
    }

    const updatedFacility = await roomFacilitiesModel.updateRoomFacility(
      roomFacilityId,
      updatedData
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
};

const deleteRoomFacility = async (req, res) => {
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

    const filePath = fileDirectory + roomFacility.image;
    filesHandler.deleteFile(filePath);

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
};

module.exports = {
  getRoomFacilities,
  createRoomFacility,
  getRoomFacilityById,
  updateRoomFacility,
  deleteRoomFacility,
};
