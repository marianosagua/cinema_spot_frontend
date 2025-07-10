# CinemaSpot Frontend

Este proyecto es el frontend para un Sistema de Reserva de Películas. Está construido utilizando React, TypeScript, Redux y Tailwind CSS. La aplicación permite a los usuarios navegar por películas, ver detalles, seleccionar asientos y realizar reservas, además de incluir un panel de administración completo.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Comenzando](#comenzando)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Panel de Administración](#panel-de-administración)
- [Scripts Disponibles](#scripts-disponibles)

## Características

### Funcionalidades de Usuario
- Autenticación de usuarios (inicio de sesión y registro)
- Navegar y ver detalles de películas
- Seleccionar horarios y asientos
- Realizar reservas
- Gestión del perfil de usuario
- Diseño responsive

### Panel de Administración
- Gestión completa de películas
- Administración de salas de cine
- Gestión de funciones y horarios
- Control de reservaciones
- Administración de categorías
- Gestión de usuarios
- Administración de roles
- Gestión de actores y reparto

## Tecnologías Utilizadas

- **React**: Una biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript**: Un superconjunto tipado de JavaScript que compila a JavaScript simple
- **Redux**: Un contenedor de estado predecible para aplicaciones JavaScript
- **Tailwind CSS**: Un framework CSS utility-first para desarrollo rápido de UI
- **Framer Motion**: Una biblioteca para animaciones en React
- **Axios**: Un cliente HTTP basado en promesas para el navegador y Node.js
- **Radix UI**: Un conjunto de componentes UI accesibles de bajo nivel para construir sistemas de diseño

## Comenzando

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/your-username/cinemaspot_frontend.git
   cd cinemaspot_frontend
   ```

2. Instalar dependencias:

   ```sh
   npm install
   # o
   yarn install
   ```

3. Crear un archivo `.env` en el directorio raíz y agregar tus variables de entorno:

   ```sh
   VITE_API_URL=http://your-api-url
   ```

### Ejecutar la Aplicación

Para iniciar el servidor de desarrollo:

```sh
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Estructura del Proyecto

```plaintext
src/
├── api/                    # Archivos de servicios API
│   └── services/          # Servicios específicos (auth, movies, etc.)
├── app/                   # Páginas y rutas de la aplicación
│   ├── auth/              # Páginas de autenticación
│   ├── components/        # Componentes específicos de la app
│   │   ├── MoviesAdmin.tsx
│   │   ├── RoomsAdmin.tsx
│   │   ├── ShowtimesAdmin.tsx
│   │   ├── CategoriesAdmin.tsx
│   │   ├── ReservationsAdmin.tsx
│   │   ├── UsersAdmin.tsx
│   │   ├── RolesAdmin.tsx
│   │   └── ActorsAdmin.tsx
│   ├── layout/            # Layouts de la aplicación
│   └── pages/             # Páginas principales
├── components/            # Componentes UI reutilizables
│   └── ui/               # Componentes base (button, input, etc.)
├── hooks/                 # Hooks personalizados
├── interfaces/            # Interfaces TypeScript
├── lib/                   # Funciones de utilidad
├── store/                 # Store de Redux y slices
├── index.css              # Archivo CSS global
├── main.tsx               # Punto de entrada de la aplicación
├── vite-env.d.ts          # Tipos de entorno Vite
└── App.tsx                # Componente principal App
```

## Panel de Administración

El sistema incluye un panel de administración completo con las siguientes funcionalidades:

### Módulos Disponibles
- **Películas**: Gestión completa del catálogo de películas
- **Salas de Cine**: Administración de salas y su configuración
- **Funciones**: Gestión de horarios y funciones de películas
- **Reservaciones**: Control y seguimiento de todas las reservas
- **Categorías**: Administración de categorías de películas
- **Usuarios**: Gestión de usuarios del sistema
- **Roles**: Administración de roles y permisos
- **Actores**: Gestión del reparto y actores

### Características del Panel
- **Interfaz Responsive**: Optimizada para desktop y móvil
- **Gestión CRUD**: Operaciones completas de crear, leer, actualizar y eliminar
- **Modales Interactivos**: Formularios modales para edición y creación
- **Tablas Dinámicas**: Visualización de datos con paginación
- **Validaciones**: Validaciones en tiempo real
- **Notificaciones**: Feedback visual para todas las operaciones

## Scripts Disponibles

- `npm run dev`: Iniciar el servidor de desarrollo
- `npm run build`: Construir la aplicación para producción
- `npm run lint`: Ejecutar ESLint para verificar el código
- `npm run preview`: Previsualizar la versión de producción

## Arquitectura y Optimización

### Principios de Diseño
- **Componentes Modulares**: Cada funcionalidad está encapsulada en componentes independientes
- **Separación de Responsabilidades**: Los componentes de administración están separados por dominio
- **Reutilización de Código**: Componentes UI base reutilizables
- **TypeScript**: Tipado fuerte para mayor seguridad y mejor experiencia de desarrollo

### Optimizaciones Implementadas
- **Lazy Loading**: Carga diferida de componentes para mejorar el rendimiento
- **Tree Shaking**: Eliminación de código no utilizado en producción
- **Componentes Optimizados**: Estructura modular que facilita el mantenimiento
- **Gestión de Estado Eficiente**: Uso de Redux para estado global y hooks locales para estado específico
