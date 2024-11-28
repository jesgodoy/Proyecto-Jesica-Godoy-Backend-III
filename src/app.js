import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'; // Asegúrate de importar el router de mocks

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

// Registrar las rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter); // Aquí registramos las rutas de mocks

// Conexión a la base de datos
mongoose.connect('mongodb+srv://jesigodoyprogramacion:Coderbackend@cluster0.4rbfc.mongodb.net/Adoptme?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("Conectado a MongoDB"))
    .catch(error => console.error("Error de conexión a MongoDB:", error));

app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});