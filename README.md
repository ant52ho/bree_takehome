# Bree Takehome Project

This project consists of a full-stack application with a TypeScript/Node.js backend and a React/TypeScript frontend.

## Project Structure

```
.
├── backend/         # Node.js/TypeScript backend
├── frontend/        # React/TypeScript frontend
└── README.md
```

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables similar to the sample env file in backend/.sample.env

4. Set up the database:

In the backend folder, run:

```bash
   docker-compose up
```

5. Start the development server:
   ```bash
   npm run dev
   ```

A list of endpoints will be available for you to test with. Due to authentication, you may need to generate customer/admin JWT tokens yourself, and insert them into headers on Postman.

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory using the frontend/.sample.env file

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at the url outputted in the terminal

NOTE: JWT token authentication is required on certain routes. If testing the backend without the frontend, you'll need to include extra request headers or modify the serverless.yml file to temporarily disable authentication.
