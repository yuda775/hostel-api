const facilitiesModel = require("../models/facilityModels");
const fileHandler = require("../utils/fileHandler");

module.exports = {
  getFacilities: async (req, res) => {
    try {
      const facilities = await facilitiesModel.getFacilities();
      res.json({
        status: true,
        facilities,
        message: "Dapatkan semua fasilitas dengan sukses",
      });
    } catch (error) {
      console.error("Error fetching facilities:", error);
      res.status(500).json({ error: "Kesalahan server internal" });
    }
  },

  getFacilityById: async (req, res) => {
    const { id } = req.params;

    try {
      const facility = await facilitiesModel.getFacilityById(id);
      if (!facility) {
        res.status(404).json({ error: "Fasilitas tidak ditemukan" });
        return;
      }

      res.json(facility);
    } catch (error) {
      console.error("Error fetching facility by ID:", error);
      res.status(500).json({ error: "Kesalahan server internal" });
    }
  },

  createFacility: async (req, res) => {
    const { name } = req.body;
    const imageFile = req.files?.image;

    try {
      const uploadDirectory = "./public/images/facilities/";

      if (!fileHandler.directoryExists(uploadDirectory)) {
        fileHandler.createDirectory(uploadDirectory);
      }

      if (name && imageFile) {
        await imageFile.mv(uploadDirectory + imageFile.name);
        const facility = await facilitiesModel.createFacilityWithImage(
          name,
          imageFile.name
        );

        return res.json(facility);
      } else {
        const facility = await facilitiesModel.createFacilityWithoutImage(name);

        return res.json(facility);
      }
    } catch (error) {
      console.error("Error creating facility:", error);
      return res.status(500).json({ error: "Kesalahan server internal" });
    }
  },

  updateFacility: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      await facilitiesModel.updateFacility(id, name);

      res.json({ message: "Fasilitas berhasil diperbarui" });
    } catch (error) {
      console.error("Error updating facility:", error);
      res.status(500).json({ error: "Kesalahan server internal" });
    }
  },

  deleteFacility: async (req, res) => {
    const id = req.params.id;

    try {
      const facility = await facilitiesModel.getFacilityById(id);
      const fileName = facility.image;

      await facilitiesModel.deleteFacility(id);

      if (fileName) {
        const filePath = `./public/images/facilities/${fileName}`;

        await fileHandler.deleteFile(filePath);
      }

      res.json({ message: "Fasilitas berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting facility:", error);
      res.status(500).json({ error: "Kesalahan server internal" });
    }
  },
};
