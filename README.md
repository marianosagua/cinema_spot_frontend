# CinemaSpot Frontend

This project is the frontend for a Movie Reservation System. It is built using React, TypeScript, Redux, and Tailwind CSS. The application allows users to browse movies, view details, select seats, and make reservations.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)

## Features

- User authentication (login and registration)
- Browse and view movie details
- Select showtimes and seats
- Make reservations
- User profile management
- Responsive design

## Technologies Used

- **React**: A JavaScript library for building user interfaces
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript
- **Redux**: A predictable state container for JavaScript apps
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **Framer Motion**: A library for animations in React
- **Axios**: A promise-based HTTP client for the browser and Node.js
- **Radix UI**: A set of low-level, accessible UI components for building design systems

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/cinemaspot_frontend.git
   cd cinemaspot_frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```sh
   VITE_API_URL=http://your-api-url
   ```

### Running the Application

To start the development server:

```sh
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```plaintext
src/
├── api/                # API service files
├── app/                # Application pages and routes
├── components/         # Reusable UI components
├── hooks/              # Custom hooks
├── interfaces/         # TypeScript interfaces
├── lib/                # Utility functions
├── store/              # Redux store and slices
├── index.css           # Global CSS file
├── main.tsx            # Application entry point
├── vite-env.d.ts       # Vite environment types
└── App.tsx             # Main App component
```

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint to lint the code
- `npm run preview`: Preview the production build
