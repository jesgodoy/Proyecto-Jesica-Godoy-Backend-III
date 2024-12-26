# Adoptme 🐾

Es un protecto, basado en el codigo proporcionado por coderhouse, el mismo es un sistema de generación de datos simulados para usuarios y mascotas con capacidades de registro y gestión de base de datos. se busca implentar en el codigo mejoras y nuevas funcionalidades

## 🚀 Características

- **Generación de Datos Simulados**: Crea datos falsos para usuarios y mascotas
- **Sistema de Registro**: Los eventos importantes se registran según el entorno (desarrollo/producción)
- **Operaciones de Base de Datos**: Almacena datos generados de usuarios y mascotas

## ⚡ Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/mocks/mockingpets` | Genera 100 mascotas simuladas |
| GET | `/api/mocks/mockingusers` | Genera 50 usuarios simulados |
| POST | `/api/mocks/generateData` | Genera y guarda usuarios y mascotas en la base de datos |

## Vínculo a Docker Hub: 
**mi perfil de DockerHub**
 ```bash
   < https://hub.docker.com/u/jesicag7 >
   ```
   
**Imagen del Proyecto:**
 ```bash
   < https://hub.docker.com/r/jesicag7/backend3jesigodoy >
   ```


## 💻 Configuración y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone <https://github.com/jesgodoy/Proyecto-Jesica-Godoy-Backend-III.git>
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear archivo `.env` con los parámetros necesarios

4. **Iniciar el servidor:**
   ```bash
   npm start
   ```

5. **Probar endpoints:**
   Usar Postman o herramientas similares para probar:
   -  `/api/mocks/mockingpets`
   -  `/api/mocks/mockingusers`
   -  `/api/mocks/generateData`


## 🛠 Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **Mongoose**: ORM para MongoDB
- **Faker.js**: Biblioteca para generación de datos de prueba
- **bcrypt**: Biblioteca para encriptación de contraseñas
- **Supertest**: Herramienta para realizar pruebas HTTP.
- **Chai**: Biblioteca de aserciones para pruebas unitarias.
- **Mocha**: Framework de pruebas para Node.js.