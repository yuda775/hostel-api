const express = require("express");
const router = express.Router();

const facilitiesController = require("../controllers/facilitiesController");

router.get("/", facilitiesController.getFacilities);
router.get("/:id", facilitiesController.getFacilityById);
router.post("/", facilitiesController.createFacility);
router.put("/:id", facilitiesController.updateFacility);
router.delete("/:id", facilitiesController.deleteFacility);

// Endpoint untuk menyediakan akses ke file gambar
router.get("/images/facilities/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(imageDirectory, imageName);

  // Periksa apakah file gambar ada
  if (fs.existsSync(imagePath)) {
    // Set header Content-Type sebagai image/jpeg atau sesuai jenis gambar lainnya
    res.setHeader("Content-Type", "image/jpeg");

    // Baca file gambar dan kirimkan ke response
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
  } else {
    res.status(404).send("Image not found");
  }
});

module.exports = router;
