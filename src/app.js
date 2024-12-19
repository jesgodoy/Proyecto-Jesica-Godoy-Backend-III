import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'; // Asegúrate de importar el router de mocks


dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


// Registrar las rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter); // Aquí registramos las rutas de mocks

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});