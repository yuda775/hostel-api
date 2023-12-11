const roomModel = require("../models/roomModel");
const roomImageModel = require("../models/roomImageModel");
const roomFacilitiesRelationModel = require("../models/roomFacilitiesRelationModel");

const fileHandler = require("../utils/fileHandler");
const imageDirectory = "./public/images/rooms/";

const getRooms = async (req, res) => {
  try {
    const rooms = await roomModel.getRooms();
    res.json({
      status: true,
      rooms,
      message: "Get all rooms successfully",
    });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRoomById = async (req, res) => {
  const roomId = req.params.id;
  try {
    const rooms = await roomModel.getRoomById(roomId);
    res.json({
      status: true,
      rooms,
      message: "Get room successfully",
    });
  } catch (error) {
    console.error("Error fetching facilities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateRoom = async (req, res) => {
  const roomId = req.params.id;
  const { roomNumber, capacity, price, type, facilities } = req.body;
  const images = req.files?.images;

  const facilitiesArray = Array.isArray(facilities)
    ? facilities.filter(Number.isInteger).map(Number)
    : [];

  try {
    const existingRoom = await roomModel.getRoomById(roomId);

    if (!existingRoom) {
      return res.status(404).json({ message: "Kamar tidak ditemukan" });
    }

    const updatedRoomData = {
      roomNumber: parseInt(roomNumber) || existingRoom.roomNumber,
      capacity: parseInt(capacity) || existingRoom.capacity,
      price: parseFloat(price) || existingRoom.price,
      type: type || existingRoom.type,
    };

    const updatedRoom = await roomModel.updateRoom(roomId, updatedRoomData);

    const filePath = imageDirectory + roomId;

    if (facilitiesArray.length > 0) {
      await roomFacilitiesRelationModel.deleteRelation(roomId);
      const createdFacilities = await Promise.all(
        facilitiesArray.map((facilityId) =>
          roomFacilitiesRelationModel.createRelation(roomId, facilityId)
        )
      );

      return res.status(200).json({
        status: true,
        room: updatedRoom,
        images: [],
        facilities: createdFacilities,
        message: "Kamar berhasil diperbarui",
      });
    }

    if (images) {
      await fileHandler.handleImagesCleanup(filePath, existingRoom.images);
      const uploadedImageNames = await fileHandler.handleImageUpload(
        filePath,
        images
      );

      await roomImageModel.deleteRoomImages(roomId);
      const uploadedImages = await Promise.all(
        uploadedImageNames.map((fileName) =>
          roomImageModel.createRoomImage(roomId, fileName)
        )
      );

      return res.status(200).json({
        status: true,
        room: updatedRoom,
        images: uploadedImages,
        facilities: [],
        message: "Kamar berhasil diperbarui",
      });
    } else {
      await roomImageModel.deleteRoomImages(roomId);
      await fileHandler.handleImagesCleanup(filePath, existingRoom.images);
    }

    res.status(200).json({
      status: true,
      room: updatedRoom,
      images: [],
      facilities: [],
      message: "Kamar berhasil diperbarui",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await roomModel.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const filePath = `${imageDirectory}${roomId}`;

    const isImageDirectoryExist = await fileHandler.isDirectoryExists(filePath);

    if (isImageDirectoryExist) {
      await fileHandler.handleDeleteDirectory(filePath);
    }

    await roomImageModel.deleteRoomImages(roomId);
    await roomFacilitiesRelationModel.deleteRelation(roomId);
    await roomModel.deleteRoom(roomId);

    return res.status(200).json({
      status: true,
      message: "Room and associated images deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createRoom = async (req, res) => {
  const { roomNumber, capacity, price, type, facilities } = req.body;
  const uploadedImages = req.files?.images;

  try {
    const facilitiesArray = Array.isArray(facilities)
      ? facilities.map(Number)
      : [Number(facilities)];

    const room = await roomModel.createRoom(roomNumber, capacity, price, type);

    if (!uploadedImages) {
      return res.json({
        status: true,
        room,
        message: "Create room without images successfully",
      });
    }

    const roomId = room.id;
    const imagePath = `${imageDirectory}${roomId}/`;

    const uploadedFileNames = await fileHandler.handleImageUpload(
      imagePath,
      uploadedImages
    );

    const [createdFacilities, uploadedImagesResult] = await Promise.all([
      Promise.all(
        facilitiesArray.map((facilityId) =>
          roomFacilitiesRelationModel.createRelation(roomId, facilityId)
        )
      ),
      Promise.all(
        (Array.isArray(uploadedFileNames)
          ? uploadedFileNames
          : [uploadedFileNames]
        ).map((filename) => roomImageModel.createRoomImage(roomId, filename))
      ),
    ]);

    const response = {
      status: true,
      room,
      images: uploadedImagesResult,
      facilities: createdFacilities,
      message: "Create room with images successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
