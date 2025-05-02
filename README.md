# CinemaSpot Frontend

Este proyecto es el frontend para un Sistema de Reserva de Películas. Está construido utilizando React, TypeScript, Redux y Tailwind CSS. La aplicación permite a los usuarios navegar por películas, ver detalles, seleccionar asientos y realizar reservas.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Comenzando](#comenzando)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)

## Características

- Autenticación de usuarios (inicio de sesión y registro)
- Navegar y ver detalles de películas
- Seleccionar horarios y asientos
- Realizar reservas
- Gestión del perfil de usuario
- Diseño responsive

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
├── api/                # Archivos de servicios API
├── app/                # Páginas y rutas de la aplicación
├── components/         # Componentes UI reutilizables
├── hooks/              # Hooks personalizados
├── interfaces/         # Interfaces TypeScript
├── lib/                # Funciones de utilidad
├── store/              # Store de Redux y slices
├── index.css           # Archivo CSS global
├── main.tsx            # Punto de entrada de la aplicación
├── vite-env.d.ts       # Tipos de entorno Vite
└── App.tsx             # Componente principal App
```

## Scripts Disponibles

- `npm run dev`: Iniciar el servidor de desarrollo
- `npm run build`: Construir la aplicación para producción
- `npm run lint`: Ejecutar ESLint para verificar el código
- `npm run preview`: Previsualizar la versión de producción
