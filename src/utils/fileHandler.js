const fs = require("fs").promises;
const path = require("path");

const generateUniqueFileName = async (image, uniqueId) => {
  const fileFormat = path.extname(image.name).toLowerCase();
  return uniqueId + fileFormat;
};

const uploadFile = async (image, directory, fileName) => {
  const file = fs.createReadStream(image.path);
  const fileStream = fs.createWriteStream(`${directory}/${fileName}`);

  file.pipe(fileStream);
  fileStream.on("finish", () => {
    file.close();
    fileStream.close();
  });
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(error);
    throw new Error("Gagal menghapus berkas");
  }
};

const createDirectory = async (directory) => {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error) {
    console.error(error);
    throw new Error("Gagal membuat direktori");
  }
};

const directoryExists = async (directory) => {
  try {
    await fs.access(directory);
    return true;
  } catch (error) {
    return false;
  }
};

const handleImagesCleanup = async (images) => {
  for (const image of images) {
    const imageName = typeof image === "object" ? image.image : image;
    const imagePath = `./public/images/rooms/${imageName.replace(/"/g, "")}`;

    if (await fileExists(imagePath)) {
      await deleteFile(imagePath);
    }
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateUniqueFileName,
  uploadFile,
  deleteFile,
  createDirectory,
  directoryExists,
  handleImagesCleanup,
  fileExists,
};
