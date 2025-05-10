# Firebase Studio - ShelfSpot E-Commerce Platform

This is a Next.js and Express.js application for a mini e-commerce platform.

## Project Structure

- `src/app/`: Next.js frontend application (App Router)
- `src/components/`: Reusable React components for the frontend
- `src/ai/`: Genkit AI flows
- `server/`: Express.js backend server
- `.env`: Environment variables for the backend (PostgreSQL connection, server port)
- `.env.local`: Environment variables for the frontend (API URL)

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- PostgreSQL server installed and running

## Setup Instructions

1.  **Clone the repository (if applicable) and navigate into the project directory.**

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Backend Environment Variables:**
    *   Rename or copy the `.env.example` file to `.env` if it exists, or create a new `.env` file in the project root.
    *   Update the `.env` file with your PostgreSQL database connection details:
        ```env
        PGUSER=your_postgres_user
        PGHOST=localhost
        PGDATABASE=your_postgres_database
        PGPASSWORD=your_postgres_password
        PGPORT=5432

        # Optional: Specify a port for the Express server, defaults to 3001
        # PORT=3001
        ```
    *   Ensure your PostgreSQL server is running and you have created the specified database. The backend server will attempt to create the `products` table automatically if it doesn't exist.

4.  **Configure Frontend Environment Variables (Optional but Recommended):**
    *   A `.env.local` file is provided with `NEXT_PUBLIC_API_URL=http://localhost:3001/api`. This tells the Next.js frontend where to find the backend API. If your backend runs on a different port or URL, update this file accordingly.

## Running the Application

You need to run both the backend server and the frontend development server simultaneously, typically in two separate terminal windows.

1.  **Start the Backend Server (Express.js):**
    Open a terminal and run:
    ```bash
    npm run server:dev
    # or for production-like start without nodemon:
    # npm run server
    ```
    This will start the Express.js backend, typically on `http://localhost:3001`. Check the terminal output to confirm it has started successfully and connected to the PostgreSQL database.

2.  **Start the Frontend Development Server (Next.js):**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002` (as per your `package.json` scripts).

3.  **Access the Application:**
    Open your web browser and navigate to the Next.js frontend URL (e.g., `http://localhost:9002`).

## Troubleshooting "Error fetching products" / "Failed to fetch"

This error usually means the Next.js frontend cannot communicate with the Express.js backend. Here's a checklist:

*   **Is the backend server running?** Ensure you have successfully started the Express server (`npm run server:dev`) in a separate terminal and that it hasn't crashed due to errors (e.g., database connection issues).
*   **Is the PostgreSQL database running and accessible?** Check your backend server logs for any database connection errors. Ensure your credentials in `.env` are correct.
*   **Are both servers on the correct ports?**
    *   The backend should be running on the port specified in `.env` (or default 3001).
    *   The frontend's `NEXT_PUBLIC_API_URL` (in `.env.local` or defaulted in `src/app/page.tsx`) must point to the correct backend URL and port (e.g., `http://localhost:3001/api`).
*   **Check for CORS issues:** The backend `server/index.js` includes `app.use(cors());` which should generally allow requests from your Next.js dev server. If you see CORS errors in the browser console, this might need further investigation, but it's less likely with the current setup.
*   **Firewall or Network Issues:** Ensure no firewall is blocking communication between the frontend and backend, especially if they are on different machines or in containerized environments (though for local development, this is rare).

## Available Scripts

- `npm run dev`: Starts the Next.js development server (Turbopack, port 9002).
- `npm run server`: Starts the Express.js backend server.
- `npm run server:dev`: Starts the Express.js backend server with Nodemon for auto-restarts.
- `npm run build`: Builds the Next.js application for production.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Lints the project files.
- `npm run typecheck`: Runs TypeScript type checking.

To get started with development, take a look at `src/app/page.tsx` for the frontend and `server/index.js` for the backend.
```