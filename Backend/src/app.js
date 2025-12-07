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
    const { name, email, phoneNumber, password } = req.body;

    //validar que todos los campos esten llenos
    if (!name || !email || !phoneNumber || !password) {
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
      "INSERT INTO Users (name, email, phoneNumber ,password, creation_date) VALUES (?, ?, ?, ?, NOW())",
      [name, email, phoneNumber,hashedPassword]
    );
    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        id: result.insertId,
        name,
        email,
        phoneNumber,
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
    const [users] = await db.query("SELECT * FROM Users WHERE email = ?", 
      [email]
    );

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

//ruta para actualizar el usuario

// Agregar después de la ruta de login en tu app.js

// ========== RUTA PARA ACTUALIZAR PERFIL DE USUARIO ==========
app.put("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, currentPassword, newPassword } = req.body;

    // Validar que al menos un campo venga para actualizar
    if (!name && !email && !phoneNumber && !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un campo para actualizar"
      });
    }

    // Buscar el usuario
    const [users] = await db.query(
      "SELECT * FROM Users WHERE id_user = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const user = users[0];

    // Si se quiere cambiar la contraseña, validar la actual
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Debe proporcionar la contraseña actual para cambiarla"
        });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "La contraseña actual es incorrecta"
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "La nueva contraseña debe tener al menos 6 caracteres"
        });
      }
    }

    // Verificar si el email ya existe (si se está cambiando)
    if (email && email !== user.email) {
      const [existingEmail] = await db.query(
        "SELECT * FROM Users WHERE email = ? AND id_user != ?",
        [email, id]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: "El email ya está en uso por otro usuario"
        });
      }
    }

    // Construir la query de actualización dinámicamente
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }

    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }

    if (phoneNumber) {
      updateFields.push("phoneNumber = ?");
      updateValues.push(phoneNumber);
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.push("password = ?");
      updateValues.push(hashedPassword);
    }

    // Agregar el ID al final de los valores
    updateValues.push(id);

    // Ejecutar la actualización
    const query = `UPDATE Users SET ${updateFields.join(", ")} WHERE id_user = ?`;
    await db.query(query, updateValues);

    // Obtener el usuario actualizado
    const [updatedUser] = await db.query(
      "SELECT id_user, name, email, phoneNumber, creation_date FROM Users WHERE id_user = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: {
        id: updatedUser[0].id_user,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        phoneNumber: updatedUser[0].phoneNumber,
        creation_date: updatedUser[0].creation_date
      }
    });

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el perfil",
      error: error.message
    });
  }
});

//ruta donde correra el port
app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server corriendo en el puerto ${process.env.PORT}`);
});
