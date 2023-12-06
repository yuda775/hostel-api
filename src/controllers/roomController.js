const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const roomModel = require("../models/roomModel");
const roomImageModel = require("../models/roomImageModel");
const roomFacilitiesRelationModel = require("../models/roomFacilitiesRelationModel");

const imageDirectory = "./public/images/rooms/";

module.exports = {
  getRooms: async (req, res) => {
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
  },

  getRoomById: async (req, res) => {
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
  },

  createRoom: async (req, res) => {
    const { roomNumber, capacity, price, type, facilities } = req.body;
    const images = req.files?.images;

    const facilitiesArray = Array.isArray(facilities)
      ? facilities.map(Number)
      : [facilities].map(Number);

    try {
      if (!images) {
        const room = await roomModel.createRoom(
          parseInt(roomNumber),
          parseInt(capacity),
          parseFloat(price),
          type
        );
        res.json({
          status: true,
          room,
          message: "Create room without images successfully",
        });
        return;
      }

      const uploadedImageNames = await handleImageUpload(images);

      const room = await roomModel.createRoom(
        parseInt(roomNumber),
        parseInt(capacity),
        parseFloat(price),
        type
      );
      const roomId = room.id;

      const createdFacilities = await Promise.all(
        facilitiesArray.map((facilityId) =>
          roomFacilitiesRelationModel.createRelation(roomId, facilityId)
        )
      );

      const uploadedImages = await Promise.all(
        uploadedImageNames.map((fileName) =>
          roomImageModel.createRoomImage(roomId, fileName)
        )
      );

      res.status(200).json({
        status: true,
        room,
        images: uploadedImages,
        facilities: createdFacilities,
        message: "Create room with images successfully",
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const roomId = req.params.id;
      const { body: updatedRoomData, files } = req;

      const existingRoom = await roomModel.getRoomById(roomId);

      if (!existingRoom) {
        return res.status(404).json({ message: "Room not found" });
      }

      const updatedRoom = await roomModel.updateRoom(roomId, updatedRoomData);

      if (files) {
        const updatedImageNames = await handleImageUpload(files.images);

        handleImagesCleanup(existingRoom.images);

        await roomImageModel.deleteRoomImages(roomId);

        await Promise.all(
          updatedImageNames.map((fileName) =>
            roomImageModel.createRoomImage(roomId, fileName)
          )
        );
      }

      res.status(200).json({
        status: true,
        updatedRoom,
        message: "Room and associated images updated successfully",
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      const roomId = req.params.id;
      const room = await roomModel.getRoomById(roomId);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      handleImagesCleanup(room.images);

      await roomImageModel.deleteRoomImages(roomId);
      await roomModel.deleteRoom(roomId);

      return res.status(200).json({
        status: true,
        message: "Room and associated images deleted successfully",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

async function handleImageUpload(images) {
  const allowedFileTypes = [".png", ".jpg", ".jpeg"];
  const imageArray = Array.isArray(images) ? images : [images];

  return Promise.all(
    imageArray.map(async (image) => {
      const fileFormat = path.extname(image.name).toLowerCase();
      const uniqueId = uuid.v4(); // Generate a unique identifier
      const fileName = `${uniqueId}${fileFormat}`;

      if (!allowedFileTypes.includes(fileFormat)) {
        return Promise.reject(new Error({ message: "Invalid image format" }));
      }

      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }

      return new Promise((resolve, reject) => {
        image.mv(path.join(imageDirectory, fileName), (err) => {
          if (err) {
            console.error(err);
            reject(new Error("Failed to upload image"));
          } else {
            resolve(fileName);
          }
        });
      });
    })
  );
}

async function handleImagesCleanup(images) {
  images.forEach((image) => {
    const imageName = typeof image === "object" ? image.image : image;
    const imagePath = path.join(imageDirectory, imageName.replace(/"/g, ""));

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });
}
