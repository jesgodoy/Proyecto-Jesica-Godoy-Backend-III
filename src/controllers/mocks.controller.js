import MockingService from '../services/mocking.js';
import User from '../dao/models/User.js';
import Pet from '../dao/models/Pet.js';

const MAX_USERS_LIMIT = 500;
const MAX_PETS_LIMIT = 800;

const getMockingUsers = async (req, res) => {
    try {
        let limit = Math.max(1, Number(req.query.users) || 50);
        limit = Math.min(limit, 500);



        const users = await MockingService.generateMockingUsers(limit);


        res.status(200).json({
            status: "success",
            requested: limit,
            payload: users,
            details: {
                totalGenerated: users.length,
                sample: users
            }
        });
    } catch (error) {
        console.error("Error al obtener usuarios simulados:", error);
        res.status(500).json({ error: "No se pudieron obtener los usuarios" });
    }
};

const getMockingPets = async (req, res) => {
    try {
        let limit = Math.max(1, Number(req.query.pets) || 100);
        limit = Math.min(limit, 800);

        const pets = await MockingService.generateMockingPets(limit);
        res.status(200).json({
            status: "success",
            requested: limit,
            payload: pets,
            details: {
                totalGenerated: pets.length,
                sample: pets
            }
        });
    } catch (error) {
        console.error("Error al obtener mascotas simuladas:", error);
        res.status(500).json({ error: "No se pudieron obtener las mascotas" });
    }
};

const generateData = async (req, res) => {
    const { users = 0, pets = 0 } = req.body;

    try {
        const numUsers = Math.max(0, Math.min(users, 500));
        const numPets = Math.max(0, Math.min(pets, 800));


        const [generatedUsers, generatedPets] = await Promise.all([
            MockingService.generateMockingUsers(numUsers),
            MockingService.generateMockingPets(numPets)
        ]);

        // Guardar las mascotas en la base de datos
        const savedPets = await Pet.insertMany(generatedPets);

        // asigno mascotas a los usuarios
        for (let user of generatedUsers) {
            user.pets = savedPets.slice(0, Math.floor(Math.random() * savedPets.length));
        }

        // Guardar los usuarios en la base de datos
        const savedUsers = await User.insertMany(generatedUsers);


        res.status(200).json({
            message: "Datos generados y guardados correctamente",
            generated: {
                users: savedUsers.length,
                pets: savedPets.length
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

// Nueva ruta GET para recuperar los usuarios y mascotas generados
const getGeneratedData = async (req, res) => {
    try {
        const users = await User.find(); 
        const pets = await Pet.find();   

        res.status(200).json({
            status: "success",
            users: users,
            pets: pets,
            details: {
                totalUsers: users.length,
                totalPets: pets.length 
            }
        });
    } catch (error) {
        console.error("Error al obtener los datos generados:", error);
        res.status(500).json({ error: "No se pudieron obtener los datos generados" });
    }
};

export default {
    getMockingUsers,
    getMockingPets,
    generateData,
    getGeneratedData 
};
