//app.js
import express from "express";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//ruta para registrar los usuarios
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validar que todos los campos esten llenos
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }
    //valida si un correo esta existente
    const [existing_user] = await db.query(
      "SELECT * FROM Users WHERE email = ?",
      [email]
    );
    if (existing_user.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email ya en uso",
      });
    }

    //hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //inserta los datos cuando se registran
    const [result] = await db.query(
      "INSERT INTO Users (name, email, password, creation_date) VALUES (?, ?, ?, NOW())",
      [name, email, hashedPassword]
    );
    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        id: result.insertId,
        name,
        email,
      },
    });

    //error si no se registra correctamente el usuario
  } catch (error) {
    console.error("Error al registrar usuario", error);
    return res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
});

//obtener usuario para el login

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //valida que los campos esten llenos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }
    // hace la busqueda del usuario
    const [users] = await db.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email o contrasela incorrecta",
      });
    }
    const user = users[0];
    // valida la contraseña hasheada
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Email o contraseña incorrectos",
      });
    }

    // Login exitoso
    res.status(200).json({
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id_user,
        name: user.name,
        email: user.email,
      },
    });

    //error si no ingresa correctamente
  } catch (error) {
    console.error("Error en el login", error);
    return res.status(500).json({
      success: false,
      message: "Error en el login",
      error: error.message,
    });
  }
});

//ruta donde correra el port
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server corriendo en el puerto ${process.env.PORT}`);
});
