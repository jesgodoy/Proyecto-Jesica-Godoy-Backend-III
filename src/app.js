import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'; // Asegúrate de importar el router de mocks

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cookieParser());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

// Conexión a MongoDB utilizando async/await
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1); // Sale del proceso si hay error
  }
};

connectDB(); // Conexión a la base de datos

// Registrar las rutas
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter); // Aquí registramos las rutas de mocks

// Manejo de errores (agregar un middleware de manejo de errores si es necesario)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Algo salió mal' });
});

// Función para iniciar el servidor
export const startServer = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}/`);
      resolve(server);
    });

    // Manejo de errores al iniciar el servidor
    server.on('error', (err) => {
      console.error('Error al iniciar el servidor:', err);
      reject(err);
    });
  });
};

export default app;