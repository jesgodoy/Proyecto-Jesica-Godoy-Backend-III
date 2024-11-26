import { faker } from "@faker-js/faker"; 
import { createHash } from "../utils/index.js"; // Asegúrate de que la función createHash esté correctamente implementada

class MockingService {
    
    // Generar mascotas simuladas
    static async generateMockingPets(num) {
        if (num <= 0) {
            return []; // Si el número es 0 o negativo, devuelve un arreglo vacío
        }

        const pets = []; 
        for (let i = 0; i < num; i++) {
            pets.push({
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                adopted: false
            });
        }
        return pets; 
    }

    // Generar usuarios simulados
    static async generateMockingUsers(num) {
        if (num <= 0) {
            return []; // Si el número es 0 o negativo, devuelve un arreglo vacío
        }

        const users = []; 
        for (let i = 0; i < num; i++) {
            const passwordHash = await createHash("coder123"); // Usar await si es necesario
            users.push({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(), 
                password: passwordHash,
                role: faker.helpers.arrayElement(["user", "admin"]),
                pets: []
            });
        }
        return users; 
    }
}

export default MockingService;
