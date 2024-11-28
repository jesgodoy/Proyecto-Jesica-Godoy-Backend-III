import { faker } from "@faker-js/faker"; 
import { createHash } from "../utils/index.js"; 

class MockingService {

 
    static async generateMockingPets(num) {
        if (num <= 0) {
            return []; 
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

 
    static async generateMockingUsers(num) {
        if (num <= 0) {
            return []; 
        }

        const users = []; 
        for (let i = 0; i < num; i++) {
            const passwordHash = await createHash("coder123");
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

