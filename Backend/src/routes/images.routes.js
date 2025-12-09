// routes/images.routes.js

import express from "express";
import multer from "multer";
import { uploadCarImage } from "../controllers/images.controller.js";

const router = express.Router();

// Multer DEBE guardar en /app/src/upload dentro del contenedor
const upload = multer({ dest: "src/upload/" });

router.post("/upload-car-image", upload.single("image"), uploadCarImage);

export default router;
