const fs = require("fs");
const path = require("path");

const handleImageUpload = async (directory, images) => {
  try {
    const allowedExtensions = [".png", ".jpg", ".jpeg"];
    const imageArray = Array.isArray(images) ? images : [images];
    const uploadedFileNames = [];

    for (const image of imageArray) {
      let fileName;

      // Check if image is an object with a name property
      if (typeof image === "object" && image.name) {
        fileName = image.name;
      } else if (typeof image === "string") {
        // If image is a string, use it as the file name
        fileName = image;
      } else {
        throw new Error("Invalid image format");
      }

      const fileExtension = path.extname(fileName).toLowerCase();

      // Check if the file extension is allowed
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error("Invalid image format");
      }

      // Create the directory if it doesn't exist
      await fs.promises.mkdir(directory, { recursive: true });

      // Move the image file to the specified directory
      const finalFileName = fileName;
      await image.mv(path.join(directory, finalFileName));

      uploadedFileNames.push(finalFileName);
    }

    return uploadedFileNames;
  } catch (error) {
    console.error("Error handling image upload:", error);
    throw error;
  }
};

const handleImagesCleanup = async (directory, images) => {
  try {
    if (Array.isArray(images) && images.length > 0) {
      for (const image of images) {
        await deleteImage(directory, image);
      }
    } else if (typeof images === "object" && images.images) {
      await deleteImage(directory, images.images);
    } else if (typeof images === "string") {
      await deleteImage(directory, images);
    } else {
      console.log(`No valid images to delete.`);
    }
  } catch (error) {
    console.error("Error cleaning up images:", error);
    throw error;
  }
};

const deleteImage = async (directory, image) => {
  const imageName = typeof image === "object" ? image.images : image;
  const imagePath = path.join(directory, imageName);

  console.log(`Deleting image: ${imagePath}`);

  try {
    console.log(`Checking access for image: ${imagePath}`);
    await fs.promises.access(imagePath, fs.constants.F_OK);
    console.log(`Access checked for image: ${imagePath}`);

    console.log(`Deleting image: ${imagePath}`);
    await fs.promises.unlink(imagePath);
    console.log(`Deleted image: ${imagePath}`);
  } catch (error) {
    console.log(`Failed to delete image: ${imagePath}`, error);
  }
};

const handleDeleteDirectory = async (directory) => {
  try {
    await fs.promises.rm(directory, { recursive: true });
  } catch (error) {
    console.error("Error deleting directory:", error);
    throw error;
  }
};

const isDirectoryExists = async (path) => {
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  handleImagesCleanup,
  handleImageUpload,
  handleDeleteDirectory,
  isDirectoryExists,
};
