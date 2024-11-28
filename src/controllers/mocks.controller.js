import MockingService from '../services/mocking.js';
import User from '../dao/models/User.js';  // Asegúrate de que estos estén correctamente importados
import Pet from '../dao/models/Pet.js';

const MAX_USERS_LIMIT = 500;  // Límite máximo de usuarios
const MAX_PETS_LIMIT = 800;   // Límite máximo de mascotas

// Función para obtener usuarios simulados
const getMockingUsers = async (req, res) => {
    try {
        // Obtener el número de usuarios a generar desde la query string (con valor por defecto 50)
        let limit = Math.max(1, Number(req.query.users) || 50); // Asegúrate de que siempre haya al menos 1 usuario
        limit = Math.min(limit, 500); // Limitar a un máximo de 500 usuarios

        console.log(`Generando ${limit} usuarios...`);  // Verifica que estamos recibiendo el valor correcto

        const users = await MockingService.generateMockingUsers(limit);  // Genera los usuarios

        // Muestra los usuarios generados en la consola
        console.log("Usuarios generados:", users); 

        res.status(200).json({
            status: "success",
            requested: limit,
            payload: users,  // Devuelve los usuarios generados
            details: {
                totalGenerated: users.length,  // Cantidad total de usuarios generados
                sample: users  // Muestra una muestra de los usuarios generados
            }
        });
    } catch (error) {
        console.error("Error al obtener usuarios simulados:", error);
        res.status(500).json({ error: "No se pudieron obtener los usuarios" });
    }
};

// Función para obtener mascotas simuladas
const getMockingPets = async (req, res) => {
    try {
        // Obtener el número de mascotas a generar desde la query string (con valor por defecto 100)
        let limit = Math.max(1, Number(req.query.pets) || 100); // Asegúrate de que siempre haya al menos 1 mascota
        limit = Math.min(limit, 800); // Limitar a un máximo de 800 mascotas

        console.log(`Generando ${limit} mascotas...`);  // Verifica que estamos recibiendo el valor correcto

        const pets = await MockingService.generateMockingPets(limit);  // Genera las mascotas

        // Muestra las mascotas generadas en la consola
        console.log("Mascotas generadas:", pets);

        res.status(200).json({
            status: "success",
            requested: limit,
            payload: pets,  // Devuelve las mascotas generadas
            details: {
                totalGenerated: pets.length,  // Cantidad total de mascotas generadas
                sample: pets  // Muestra una muestra de las mascotas generadas
            }
        });
    } catch (error) {
        console.error("Error al obtener mascotas simuladas:", error);
        res.status(500).json({ error: "No se pudieron obtener las mascotas" });
    }
};

const generateData = async (req, res) => {
    // Obtener los parámetros 'users' y 'pets' del cuerpo de la solicitud
    const { users = 0, pets = 0 } = req.body;

    console.log(`Datos recibidos: usuarios = ${users}, mascotas = ${pets}`);

    try {
        const numUsers = Math.max(0, Math.min(users, 500));  // Limitar a un máximo de 500 usuarios
        const numPets = Math.max(0, Math.min(pets, 800));    // Limitar a un máximo de 800 mascotas

        console.log(`Generando ${numUsers} usuarios y ${numPets} mascotas`);

        // Generar usuarios y mascotas de manera asincrónica
        const [generatedUsers, generatedPets] = await Promise.all([
            MockingService.generateMockingUsers(numUsers),
            MockingService.generateMockingPets(numPets)
        ]);

        // Guardar las mascotas en la base de datos
        const savedPets = await Pet.insertMany(generatedPets);

        // Asignar las mascotas guardadas a los usuarios
        for (let user of generatedUsers) {
            // Asignar un conjunto aleatorio de mascotas a cada usuario
            user.pets = savedPets.slice(0, Math.floor(Math.random() * savedPets.length));
        }

        // Guardar los usuarios en la base de datos
        const savedUsers = await User.insertMany(generatedUsers);

        console.log("Usuarios generados:", savedUsers);
        console.log("Mascotas generadas:", savedPets);

        // Devolver la respuesta con los datos generados
        res.status(200).json({
            message: "Datos generados y guardados correctamente",
            generated: {
                users: savedUsers.length,
                pets: savedPets.length,
            },
            details: {
                userSample: savedUsers,
                petSample: savedPets,
                totalUsers: savedUsers.length,
                totalPets: savedPets.length
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
    generateData, // Exporta la función generateData
};
