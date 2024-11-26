import MockingService from "../services/mocking.js";

// Definir un límite máximo para la cantidad de usuarios y mascotas
const MAX_USERS_LIMIT = 500;  // Máximo de 500 usuarios
const MAX_PETS_LIMIT = 800;   // Máximo de 800 mascotas

// Función para obtener mascotas simuladas
const getMockingPets = async (req, res) => {
    try {
        let limit = Math.max(1, Number(req.query.pets) || 100); // Limitar con un valor mínimo de 1
        limit = Math.min(limit, MAX_PETS_LIMIT); // Aplicar límite máximo

        const pets = await MockingService.generateMockingPets(limit); // Generar solo la cantidad solicitada

        res.status(200).json({
            status: "success",
            requested: limit,
            payload: pets, // Devolver todas las mascotas generadas
            details: {
                totalGenerated: pets.length,
                sample: pets // Incluir todas las mascotas generadas
            }
        });
    } catch (error) {
        console.error("Error al obtener mascotas simuladas:", error);
        res.status(500).json({ error: "No se pudieron obtener las mascotas" });
    }
};

// Función para obtener usuarios simulados
const getMockingUsers = async (req, res) => {
    try {
        let limit = Math.max(1, Number(req.query.users) || 50); // Limitar con un valor mínimo de 1
        limit = Math.min(limit, MAX_USERS_LIMIT); // Aplicar límite máximo

        const users = await MockingService.generateMockingUsers(limit); // Generar solo la cantidad solicitada

        res.status(200).json({
            status: "success",
            requested: limit,
            payload: users, // Devolver todos los usuarios generados
            details: {
                totalGenerated: users.length,
                sample: users // Incluir todos los usuarios generados
            }
        });
    } catch (error) {
        console.error("Error al obtener usuarios simulados:", error);
        res.status(500).json({ error: "No se pudieron obtener los usuarios" });
    }
};

const generateData = async (req, res) => {
    const { users = 0, pets = 0 } = req.query;

    try {
        // Validación de valores pasados en los parámetros de la consulta
        const numUsers = Math.max(0, Math.min(parseInt(users) || 0, MAX_USERS_LIMIT)); 
        const numPets = Math.max(0, Math.min(parseInt(pets) || 0, MAX_PETS_LIMIT)); 

        console.log(`Generando ${numUsers} usuarios y ${numPets} mascotas`);

        // Generar usuarios y mascotas de acuerdo a los valores pasados
        const [generatedUsers, generatedPets] = await Promise.all([
            MockingService.generateMockingUsers(numUsers),
            MockingService.generateMockingPets(numPets),
        ]);

        console.log(`Usuarios generados: ${generatedUsers.length}, Mascotas generadas: ${generatedPets.length}`);

        res.status(200).json({
            message: "Datos generados exitosamente",
            generated: {
                users: generatedUsers.length,
                pets: generatedPets.length,
            },
            details: {
                userSample: generatedUsers,  // Devolver todos los usuarios generados
                petSample: generatedPets,    // Devolver todas las mascotas generadas
                totalUsers: generatedUsers.length,
                totalPets: generatedPets.length
            }
        });
    } catch (error) {
        console.error("Error al generar los datos:", error);
        res.status(500).json({ error: "No se pudieron generar los datos" });
    }
};

export default {
    getMockingUsers,
    getMockingPets,
    generateData, // Para POST y GET
};
