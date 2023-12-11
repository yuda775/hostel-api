const fs = require("fs");
const path = require("path");

const handleImageUpload = async (directory, images) => {
  try {
    const allowedFileTypes = [".png", ".jpg", ".jpeg"];
    const imageArray = Array.isArray(images) ? images : [images];
    const uploadedFileNames = [];

    for (const image of imageArray) {
      try {
        let fileName;

        if (typeof image === "object" && image.name) {
          fileName = image.name;
        } else if (typeof image === "string") {
          fileName = image;
        } else {
          console.log("Invalid image format:", image);
          throw new Error("Invalid image format");
        }

        const fileExtension = path.extname(fileName).toLowerCase();

        if (!allowedFileTypes.includes(fileExtension)) {
          console.log("Invalid image format:", fileExtension);
          throw new Error("Invalid image format");
        }

        await fs.promises.mkdir(directory, { recursive: true });

        const finalFileName = fileName;
        await image.mv(path.join(directory, finalFileName));

        console.log("Successfully uploaded image:", finalFileName);
        uploadedFileNames.push(finalFileName);
      } catch (err) {
        console.error(err.message);
        throw new Error("Failed to upload image");
      }
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
      await Promise.all(
        images.map(async (image) => {
          const imageName = typeof image === "object" ? image.images : image;
          const imagePath = path.join(directory, imageName);

          try {
            await fs.promises.access(imagePath, fs.constants.F_OK);
            await fs.promises.unlink(imagePath);
            console.log(`Deleted image: ${imagePath}`);
          } catch (error) {
            console.log(`Failed to delete image: ${imagePath}`, error);
          }
        })
      );
    }
  } catch (error) {
    console.error("Error cleaning up images:", error);
    throw error;
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
