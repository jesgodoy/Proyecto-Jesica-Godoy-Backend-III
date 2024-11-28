import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

// Ruta para obtener mascotas simuladas
router.get("/mockingpets", mocksController.getMockingPets);

// Ruta para obtener usuarios simulados
router.get("/mockingusers", mocksController.getMockingUsers);

// Ruta para generar y guardar datos en la base de datos
router.post("/generatedata", mocksController.generateData);

// Ruta para obtener los usuarios y mascotas generados y guardados en la base de datos
router.get("/generatedata", mocksController.getGeneratedData);  

export default router;