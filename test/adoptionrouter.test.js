import request from 'supertest';
import mongoose from 'mongoose';
import { startServer } from '../src/app.js';
import Adoption from '../src/dao/models/Adoption.js';
import User from '../src/dao/models/User.js';
import Pet from '../src/dao/models/Pet.js';
import chai from 'chai';

const expect = chai.expect;

describe("Adoption Router Functional Tests", function () {
    let server, testUser, testPet, testAdoption;

   
    const createUser = async (userData) => {
        return await User.create(userData);
    };

  
    const createPet = async (petData) => {
        return await Pet.create(petData);
    };

  
    const createAdoption = async (user, pet) => {
        return await Adoption.create({
            owner: user._id,
            pet: pet._id
        });
    };

    
    before(async function () {
        this.timeout(1000000);
        await mongoose.connect(process.env.MONGODB_URI);
        server = await startServer(8081);
    });

    // Setup before each test
    beforeEach(async function () {
        await Adoption.deleteMany({});
        await User.deleteMany({});
        await Pet.deleteMany({});

        testUser = await createUser({
            first_name: "Jesi",
            last_name: "Test",
            email: "jesitest@example.com",
            password: "password123"
        });

        testPet = await createPet({
            name: "Kovu",
            specie: "Dog",
            birthDate: new Date(),
            adopted: false
        });

        testAdoption = await createAdoption(testUser, testPet);
    });

    // Teardown after all tests
    after(async function () {
        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }
        await mongoose.disconnect();
    });

    // Test Suite for Adoption Endpoints
    describe("Adoption Endpoints", function () {

        describe("GET /api/adoptions", function () {
            it("should return all adoptions", async function () {
                const response = await request(server)
                    .get('/api/adoptions')
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body.payload).to.be.an('array');
                expect(response.body.payload).to.have.lengthOf(1);
            });
        });

        describe("GET /api/adoptions/:aid", function () {
            it("should return a specific adoption", async function () {
                const response = await request(server)
                    .get(`/api/adoptions/${testAdoption._id}`)
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body.payload).to.have.property('_id', testAdoption._id.toString());
            });

            it("should return 404 for non-existent adoption", async function () {
                const fakeId = new mongoose.Types.ObjectId();
                const response = await request(server)
                    .get(`/api/adoptions/${fakeId}`)
                    .expect(404);

                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'Adoption not found');
            });
        });

        describe("POST /api/adoptions/:uid/:pid", function () {
            it("should create a new adoption", async function () {
                const newPet = await createPet({
                    name: "NewPet",
                    specie: "Cat",
                    birthDate: new Date(),
                    adopted: false
                });

                const response = await request(server)
                    .post(`/api/adoptions/${testUser._id}/${newPet._id}`)
                    .expect(200);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body).to.have.property('message', 'Pet adopted');

                const updatedPet = await Pet.findById(newPet._id);
                expect(updatedPet.adopted).to.be.true;
            });

            it("should return 404 for non-existent user", async function () {
                const fakeUserId = new mongoose.Types.ObjectId();
                const response = await request(server)
                    .post(`/api/adoptions/${fakeUserId}/${testPet._id}`)
                    .expect(404);

                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'user Not found');
            });

            it("should return 404 for non-existent pet", async function () {
                const fakePetId = new mongoose.Types.ObjectId();
                const response = await request(server)
                    .post(`/api/adoptions/${testUser._id}/${fakePetId}`)
                    .expect(404);

                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'Pet not found');
            });

            it("should return 400 for already adopted pet", async function () {
                const adoptedPet = await createPet({
                    name: "AdoptedPet",
                    specie: "Dog",
                    birthDate: new Date(),
                    adopted: true
                });

                const response = await request(server)
                    .post(`/api/adoptions/${testUser._id}/${adoptedPet._id}`)
                    .expect(400);

                expect(response.body).to.have.property('status', 'error');
                expect(response.body).to.have.property('error', 'Pet is already adopted');
            });
        });
    });

    // Test Suite for Pet Endpoints
    describe("Pet Endpoints", function () {

        describe("POST /api/pets", function () {
            it("should create a pet correctly", async () => {
                const petData = {
                    name: "Api", 
                    specie: "Pichicho", 
                    birthDate: "2021-03-10"
                };

                const { statusCode, body } = await request(server).post("/api/pets").send(petData); 
                expect(statusCode).to.equal(200);
                expect(body.payload).to.have.property("_id"); 
            });

            it("should create a pet with 'adopted' set to false by default", async () => {
                const newPet = {
                    name: "Rex", 
                    specie: "Perro", 
                    birthDate: "2021-01-01"
                };

                const { statusCode, body } = await request(server).post("/api/pets").send(newPet); 
                expect(statusCode).to.equal(200); 
                expect(body.payload).to.have.property("adopted").that.equals(false); 
            });

            it("should return 400 if name is missing", async () => {
                const petWithoutName = {
                    specie: "Gato", 
                    birthDate: "2020-05-15"
                };

                const { statusCode } = await request(server).post("/api/pets").send(petWithoutName); 
                expect(statusCode).to.equal(400);
            });
        });

        describe("GET /api/pets", function () {
            it("should return an array of pets", async () => {
                const { statusCode, body } = await request(server).get("/api/pets"); 
                expect(statusCode).to.equal(200);
                expect(body).to.have.property("payload").that.is.an("array"); 
            });
        });

        describe("DELETE /api/pets/:id", function () {
            it("should delete the pet by ID", async () => {
                const newPet = {
                    name: "Betun", 
                    specie: "Perro",
                    birthDate: "2023-02-20"
                };

                const { body: { payload: { _id } } } = await request(server).post("/api/pets").send(newPet); 

                const { statusCode } = await request(server).delete(`/api/pets/${_id}`); 
                expect(statusCode).to.equal(200); 

                const deletedPet = await Pet.findById(_id);
                expect(deletedPet).to.be.null;
            });
        });
    });

    // Test Suite for User Endpoints
    describe("User Endpoints", function () {
        describe("POST /api/users", function () {
            it("should create a new user", async function () {
                const newUser = {
                    first_name: "New",
                    last_name: "User",
                    email: "newuser@example.com",
                    password: "newpassword123"
                };

                const response = await request(server)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201);

                expect(response.body).to.have.property('status', 'success');
                expect(response.body.payload).to.have.property('_id');
                expect(response.body.payload.email).to.equal(newUser.email);
            });
        });
    });
});

