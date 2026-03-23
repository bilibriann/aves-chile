# 🦅 Aves Chile API

API REST escalable y robusta construida con **NestJS** y **MongoDB** para gestionar información sobre la biodiversidad de aves de Chile. Proporciona endpoints para buscar, crear y administrar recursos de aves y usuarios con documentación automática en Swagger.

## 📋 Características

- 🏗️ **Arquitectura escalable** - Basada en NestJS, framework modular para Node.js
- 🗄️ **MongoDB integrado** - Persistencia de datos con Mongoose ODM
- 📚 **Documentación Swagger** - API autodocumentada con Swagger/OpenAPI
- ✅ **Validación automática** - DTOs y class-validator para validación de entradas
- 🧪 **Tests completos** - Jest para unit tests y e2e tests
- 🔍 **Búsqueda avanzada** - Filtros y búsqueda por atributos de aves
- 📝 **Gestión de usuarios** - Sistema de usuarios para tracking
- 🐳 **Docker ready** - Dockerfile y docker-compose incluidos
- 🛡️ **Type-safe** - Completamente tipado con TypeScript

## 🛠️ Requisitos Previos

- **Node.js** >= 18
- **npm** >= 9 o **yarn** >= 3
- **MongoDB** >= 5.0 (local o Atlas)
- **Docker & Docker Compose** (opcional, para containerización)

## 📦 Instalación

1. **Clonar el repositorio**

   ```bash
   cd aves-chile
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env
   cat > .env << EOF
   MONGODB_URI=mongodb://localhost:27017/aves-chile
   NODE_ENV=development
   PORT=3001
   EOF
   ```

## 🚀 Desarrollo

```bash
# Iniciar en modo desarrollo (watch mode)
npm run start:dev

# Iniciar en modo debug
npm run start:debug

# Build del proyecto
npm build
```

El servidor estará disponible en `http://localhost:3001`

**Documentación Swagger:** `http://localhost:3001/api/docs`

## 🐳 Docker

```bash
# Construir y ejecutar con docker-compose
docker-compose up --build

# Solo construir la imagen
docker build -t aves-chile .

# Ejecutar contenedor
docker run -p 3001:3001 --env-file .env aves-chile
```

## 🧪 Testing

```bash
# Ejecutar unit tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Cobertura de tests
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

## 📂 Estructura del Proyecto

```
src/
├── aves/
│   ├── controller/
│   │   └── aves.controller.ts      # Endpoints de aves
│   ├── service/
│   │   └── aves.service.ts         # Lógica de negocio
│   ├── schemas/
│   │   └── ave.schema.ts           # Definitions Mongoose
│   ├── types/
│   │   └── aves.types.ts           # Tipos TypeScript
│   ├── dto/
│   │   └── buscar-ave.dto.ts       # DTO de búsqueda
│   └── aves.module.ts              # Módulo de aves
├── usuarios/
│   ├── usuarios.controller.ts       # Endpoints de usuarios
│   ├── usuarios.service.ts          # Lógica de usuarios
│   ├── usuarios.module.ts           # Módulo de usuarios
│   ├── dto/
│   │   └── crear-usuario.dto.ts     # DTO de usuario
│   └── schemas/
│       └── usuario.schema.ts        # Schema de usuario
├── app.controller.ts                # Controlador principal
├── app.service.ts                   # Servicio principal
├── app.module.ts                    # Módulo raíz
└── main.ts                          # Punto de entrada

test/
└── app.e2e-spec.ts                 # Tests e2e
```

## 🔌 Endpoints Principales

### Aves

- `GET /aves` - Obtener todas las aves
- `GET /aves/:id` - Obtener ave por ID
- `POST /aves` - Crear nueva ave
- `PUT /aves/:id` - Actualizar ave
- `DELETE /aves/:id` - Eliminar ave
- `POST /aves/search` - Búsqueda avanzada con filtros

### Usuarios

- `GET /usuarios` - Listar usuarios
- `GET /usuarios/:id` - Obtener usuario
- `POST /usuarios` - Crear usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

## 📚 Dependencias Principales

| Dependencia      | Versión | Propósito           |
| ---------------- | ------- | ------------------- |
| @nestjs/core     | ^11.0.1 | Framework core      |
| @nestjs/mongoose | ^11.0.4 | MongoDB integration |
| mongoose         | ^9.2.4  | ODM para MongoDB    |
| @nestjs/swagger  | ^11.2.6 | Documentación API   |
| class-validator  | ^0.14.4 | Validación de DTOs  |
| axios            | ^1.13.6 | HTTP client         |

## 🌐 Variables de Entorno

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/aves-chile
DATABASE_NAME=aves-chile

# Servidor
NODE_ENV=development
PORT=3001

# Swagger
SWAGGER_TITLE=Aves Chile API
SWAGGER_VERSION=1.0.0
SWAGGER_PATH=/api/docs
```

## 📝 Scripts Disponibles

| Script                | Descripción                     |
| --------------------- | ------------------------------- |
| `npm run start`       | Inicia en modo producción       |
| `npm run start:dev`   | Inicia en modo desarrollo       |
| `npm run start:debug` | Inicia en modo debug            |
| `npm run build`       | Compila TypeScript a JavaScript |
| `npm run test`        | Ejecuta unit tests              |
| `npm run test:watch`  | Tests en modo watch             |
| `npm run test:e2e`    | Ejecuta tests e2e               |
| `npm run format`      | Formatea código con Prettier    |

## 🔍 Ejemplos de Uso

### 1. Obtener todas las aves

```bash
curl http://localhost:3001/aves \
  -H "Content-Type: application/json"
```

**Respuesta:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Cóndor de los Andes",
    "habitat": "Montaña",
    "descripcion": "Ave rapaz de gran envergadura",
    "estado": "En peligro"
  }
]
```

### 2. Búsqueda avanzada de aves

```bash
curl -X POST http://localhost:3001/aves/search \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cóndor",
    "habitat": "montaña",
    "estado": "vulnerable"
  }'
```

### 3. Obtener ave específica

```bash
curl http://localhost:3001/aves/507f1f77bcf86cd799439011
```

### 4. Crear nueva ave

```bash
curl -X POST http://localhost:3001/aves \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Loro Tricahue",
    "habitat": "Bosque",
    "descripcion": "Ave endémica de Chile",
    "estado": "Vulnerable"
  }'
```

### 5. Actualizar ave

```bash
curl -X PUT http://localhost:3001/aves/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "Crítico"
  }'
```

### 6. Eliminar ave

```bash
curl -X DELETE http://localhost:3001/aves/507f1f77bcf86cd799439011
```

### 7. Gestión de Usuarios

**Crear usuario:**

```bash
curl -X POST http://localhost:3001/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }'
```

**Obtener usuarios:**

```bash
curl http://localhost:3001/usuarios
```

**Obtener usuario específico:**

```bash
curl http://localhost:3001/usuarios/507f1f77bcf86cd799439012
```

**Actualizar usuario:**

```bash
curl -X PUT http://localhost:3001/usuarios/507f1f77bcf86cd799439012 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.nuevo@example.com"
  }'
```

**Eliminar usuario:**

```bash
curl -X DELETE http://localhost:3001/usuarios/507f1f77bcf86cd799439012
```

## 🔌 Usando Postman

1. Importar en Postman:
   - Instalar Postman
   - Crear nueva colección "Aves Chile API"
   - Agregar requests con los ejemplos anteriores

2. Configurar URLs:
   - Base URL: `http://localhost:3001`
   - Headers: `Content-Type: application/json`

3. Guardar para reutilizar

## � IDE & Tools Recomendadas

### IDEs

- **Visual Studio Code** - Recomendado
  - Extensiones: ESLint, Prettier, Thunder Client
- **JetBrains IntelliJ IDEA** - Professional
- **WebStorm** - Especializado en Node.js

### Herramientas Testing

- **Postman** - API testing
- **Thunder Client** - VS Code extension
- **Insomnia** - REST client
- **Jest** - Incluido automáticamente

### Herramientas de Desarrollo

- **MongoDB Compass** - GUI para MongoDB
- **DBeaver** - Database management
- **Git** - Version control

## 📊 Acceder a la Documentación Swagger

Una vez que el servidor está corriendo:

1. Abre tu navegador
2. Ve a: `http://localhost:3001/api/docs`
3. Verás toda la documentación interactiva
4. Prueba los endpoints directamente desde el navegador

**Características de Swagger:**

- 📖 Documentación automática
- 🧪 Probar endpoints sin Postman
- 📋 Parámetros y respuestas documentadas
- 💾 Exportar definición OpenAPI

## 🚀 Variables de Entorno por Ambiente

### Development (.env)

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/aves-chile
PORT=3001
JWT_SECRET=tu-secret-dev
LOG_LEVEL=debug
```

### Producción (.env.production)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aves-chile
PORT=3001
JWT_SECRET=tu-secret-prod-seguro
LOG_LEVEL=error
```

## �🔍 Ejemplos de Uso

## 🐛 Troubleshooting

**MongoDB connection failed:**

```bash
# Verificar que MongoDB está corriendo
mongosh
# o usar Docker
docker-compose up -d mongo
```

**Puerto 3001 ya está en uso:**

```bash
# Cambiar puerto en .env
PORT=3002
npm run start:dev
```

**Errores de compilación TypeScript:**

```bash
npm run build
```

## 📋 Checklist de Desarrollo

- [ ] Crear .env basado en .env.example
- [ ] Instalar dependencias: `npm install`
- [ ] Verificar conexión a MongoDB
- [ ] Iniciar servidor: `npm run start:dev`
- [ ] Acceder a Swagger: `localhost:3001/api/docs`
- [ ] Ejecutar tests: `npm run test`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👨‍💻 Autor

Proyecto desarrollado como catálogo de aves de Chile.

## � Deployment

### Heroku

```bash
# Crear app en Heroku
heroku create aves-chile-api

# Configurar MongoDB Atlas
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aves-chile

# Deploy
git push heroku main
```

### Railway

```bash
# Instalar CLI
npm i -g railway

# Login y deploy
railway login
railway up
```

### Azure App Service

```bash
# Crear resource group
az group create --name aves-chile --location eastus

# Deploy
az webapp up --runtime node:18 --sku B1
```

### Docker Hub

```bash
# Build y tag
docker build -t tu-usuario/aves-chile:1.0 .

# Push
docker push tu-usuario/aves-chile:1.0

# Pull y run
docker pull tu-usuario/aves-chile:1.0
docker run -p 3001:3001 tu-usuario/aves-chile:1.0
```

## 📊 Performance Tips

1. **Indexar MongoDB**

   ```bash
   # En la conexión de MongoDB, crear índices
   db.aves.createIndex({ nombre: 1 })
   db.aves.createIndex({ habitat: 1 })
   db.usuarios.createIndex({ email: 1 })
   ```

2. **Caching en endpoints**

   ```typescript
   @Get('/aves')
   @UseInterceptors(CacheInterceptor)
   async getAves() {...}
   ```

3. **Paginación**

   ```bash
   GET /aves?page=1&limit=10
   ```

4. **Compresión**
   - NestJS incluye compresión automática
   - Habilitar en producción: `NODE_ENV=production`

## 📈 Monitoreo y Logging

```bash
# Instalar Winston para logging
npm install winston

# En main.ts
import { Logger } from '@nestjs/common';
const logger = new Logger();
logger.log('API iniciada en puerto 3001');
```

## 🔐 Seguridad

### Recomendaciones Implementadas

- ✅ Validación con class-validator
- ✅ DTOs con tipado fuerte
- ✅ CORS habilitado correctamente

### Próximas mejoras

- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Helmet para headers de seguridad
- [ ] Input sanitization

```bash
# Instalar Helmet
npm install @nestjs/helmet helmet

# En main.ts
import helmet from 'helmet';
app.use(helmet());
```

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [REST API Best Practices](https://restfulapi.net)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🎓 Guía Paso a Paso para Nuevos Desarrolladores

### Día 1: Setup

1. Clonar repositorio
2. Instalar dependencias
3. Configurar MongoDB
4. Verificar servidor en `localhost:3001`

### Día 2: Exploración

1. Revisar estructura en `src/`
2. Explorar Swagger UI
3. Probar endpoints con curl/Postman
4. Revisar tests existentes

### Día 3: Primera Feature

1. Crear nuevo DTO en `src/feature/dto/`
2. Crear schema en `src/feature/schemas/`
3. Implementar servicio
4. Crear controller
5. Agregar tests

### Día 4+: Testing

1. Escribir unit tests
2. Ejecutar coverage
3. Crear e2e tests
4. Validar en localhost

## 🐛 Common Issues & Solutions

| Problema                           | Solución                                   |
| ---------------------------------- | ------------------------------------------ |
| `MongoError: connect ECONNREFUSED` | Verificar que MongoDB esté corriendo       |
| `Port 3001 already in use`         | Cambiar `PORT` en .env                     |
| `Module not found`                 | Ejecutar `npm install`                     |
| `CORS errors`                      | Verificar CORS config en `main.ts`         |
| `Swagger no visible`               | Acceder a `http://localhost:3001/api/docs` |

## 📞 Soporte

Para problemas o preguntas:

- 📧 Abre un issue en GitHub
- 💬 Consulta la documentación oficial de NestJS
- 🔍 Busca en Stack Overflow
- 🤝 Contacta a los mantenedores

---

**Desarrollado con ❤️ para la biodiversidad de Chile**
