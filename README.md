# Fullstack App with NestJS, Next.js, and PostgreSQL

This project is a fullstack application with a NestJS backend, a Next.js frontend, and a PostgreSQL database.

## Prerequisites

- Node.js (v20 or later)
- npm
- Docker
- Docker Compose

## Getting Started

### 1. Start the database

The database runs in a Docker container. To start it, run the following command from the root of the project:

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432.

### 2. Set up the backend

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
npm install
```

To run the backend in development mode, run:

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`.

### 3. Set up the frontend

Navigate to the `frontend` directory and install the dependencies:

```bash
cd frontend
npm install
```

To run the frontend in development mode, run:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

### Environment Variables

The frontend and backend require some environment variables to be set.

#### Backend

The backend requires the `DATABASE_URL` environment variable to be set. When running locally, this should be:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nest?schema=public
```

You can set this in a `.env` file in the `backend` directory.

#### Frontend

The frontend requires the `NEXT_PUBLIC_API_URL` environment variable to be set. When running locally, this should be:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

You can set this in a `.env.local` file in the `frontend` directory.