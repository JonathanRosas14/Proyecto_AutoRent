// controllers/images.controller.js

import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { db } from "../config/db.js";

export const uploadCarImage = async (req, res) => {
  try {
    const { id_car } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No se envió ninguna imagen" });
    }

    console.log("Archivo recibido:", req.file);

    // Subir imagen a Cloudinary
    const result = await uploadToCloudinary(req.file.path);

    if (!result) {
      return res.status(500).json({ message: "Error al subir a Cloudinary" });
    }

    // Insertar en DB
    await db.query(
      "INSERT INTO CarImages (id_car, image_url, public_id) VALUES (?, ?, ?)",
      [id_car, result.secure_url, result.public_id]
    );

    res.json({
      message: "Imagen subida correctamente",
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.log("Error controlador:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
