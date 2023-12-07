const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const roomModel = require("../models/roomModel");
const roomImageModel = require("../models/roomImageModel");
const roomFacilitiesRelationModel = require("../models/roomFacilitiesRelationModel");

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
  let uploadedImages;
  let createdFacilities;

  const roomId = req.params.id;
  const { roomNumber, capacity, price, type, facilities } = req.body;
  const images = req.files?.images;

  const facilitiesArray = Array.isArray(facilities)
    ? facilities.map((facilityId) => parseInt(facilityId))
    : [parseInt(facilities)];

  try {
    const existingRoom = await roomModel.getRoomById(roomId);

    if (!existingRoom) {
      return res.status(404).json({ message: "Kamar tidak ditemukan" });
    }

    const updatedRoom = await roomModel.updateRoom(roomId, {
      roomNumber: parseInt(roomNumber) || existingRoom.roomNumber,
      capacity: parseInt(capacity) || existingRoom.capacity,
      price: parseFloat(price) || existingRoom.price,
      type: type || existingRoom.type,
    });

    // Hapus dan tambahkan fasilitas jika ada
    if (facilitiesArray.length > 0) {
      // Filter nilai yang valid (bukan NaN)
      const validFacilitiesArray = facilitiesArray.filter(
        (facilityId) => !isNaN(facilityId)
      );

      if (validFacilitiesArray.length > 0) {
        await roomFacilitiesRelationModel.deleteRelation(roomId);
        createdFacilities = await Promise.all(
          validFacilitiesArray.map((facilityId) =>
            roomFacilitiesRelationModel.createRelation(roomId, facilityId)
          )
        );
      }
    }

    // Lakukan pembaruan pada gambar jika ada
    if (images) {
      await handleImagesCleanup(existingRoom.images);
      const uploadedImageNames = await handleImageUpload(images);
      await roomImageModel.deleteRoomImages(roomId);
      uploadedImages = await Promise.all(
        uploadedImageNames.map((fileName) =>
          roomImageModel.createRoomImage(roomId, fileName)
        )
      );
    }

    res.status(200).json({
      status: true,
      room: updatedRoom,
      images: uploadedImages || [],
      facilities: createdFacilities || [],
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
};

const createRoom = async (req, res) => {
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
        return Promise.reject("Invalid image format");
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
  const imageDirectory = path.join(__dirname, "../public/images/rooms");

  try {
    // Hapus gambar-gambar lama jika ada
    if (images && Array.isArray(images) && images.length > 0) {
      await Promise.all(
        images.map(async (image) => {
          const imageName = typeof image === "object" ? image.images : image;
          const imagePath = path.join(imageDirectory, imageName);

          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        })
      );
    }
  } catch (error) {
    console.error("Error cleaning up images:", error);
    throw error;
  }
}

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
