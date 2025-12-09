// services/ cloudinary.service.js

import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadToCloudinary = async (filePath) => {
  try {
    const uploaded = await cloudinary.uploader.upload(filePath, {
      folder: "AutoRent/Cars"
    });

    // Borrar archivo temporal
    fs.unlinkSync(filePath);

    return uploaded;
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error);
    return null;
  }
};
