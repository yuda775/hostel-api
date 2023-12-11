const fs = require("fs/promises");
const path = require("path");

const directoryExists = async (directory) => {
  try {
    await fs.access(directory);
    return true;
  } catch (error) {
    return error;
  }
};

const createNewDirectory = async (directory) => {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error) {
    console.error(error);
    throw new Error("Gagal membuat direktori");
  }
};

const deleteFile = async (filePath) => {
  const fileExists = await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false);

  if (fileExists) {
    try {
      const sanitizedPath = path.normalize(filePath);
      await fs.unlink(sanitizedPath);
      return `File ${sanitizedPath} deleted successfully.`;
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  } else {
    console.log("File does not exist");
  }
};

module.exports = {
  directoryExists,
  createNewDirectory,
  deleteFile,
};
