# ShelfSpot E-Commerce Platform

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
    *   Ensure your PostgreSQL server is running and you have created the specified database. The backend server will attempt to create the `products` table automatically if it doesn't exist. **Crucially, the backend server needs these variables to connect to your database. If it can't connect, it might start but API calls will fail, or it might crash.**

4.  **Configure Frontend Environment Variables (Optional but Recommended):**
    *   A `.env.local` file is provided with `NEXT_PUBLIC_API_URL=http://localhost:3001/api`. This tells the Next.js frontend where to find the backend API. If your backend runs on a different port or URL, update this file accordingly.

## Running the Application

You need to run both the backend server and the frontend development server simultaneously, typically in two separate terminal windows.

1.  **Start the Backend Server (Express.js):**
    Open a terminal and run:
    ```bash
    npm run server:dev
    ```
    This will start the Express.js backend, typically on `http://localhost:3001`. 
    **Monitor this terminal output closely!**
    *   It should confirm:
        *   `🚀 Express server listening on port 3001`
        *   `   Frontend should connect to: http://localhost:3001/api`
        *   `✅ Connected to PostgreSQL database successfully!` (or an error message if not)
        *   `✅ Products table checked/created successfully.` (or an error)
    *   If you see errors related to PostgreSQL connection or environment variables, resolve them first.
    *   **Keep this terminal window open while using the application.** If you close it, the backend stops, and the frontend will show "Error fetching products" or "NetworkError".

2.  **Start the Frontend Development Server (Next.js):**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, typically on `http://localhost:9002` (as per your `package.json` scripts).

3.  **Access the Application:**
    Open your web browser and navigate to the Next.js frontend URL (e.g., `http://localhost:9002`).

## Troubleshooting "Error fetching products" / "Failed to fetch" / "NetworkError"

This error usually means the Next.js frontend cannot communicate with the Express.js backend. Here's a checklist:

*   **Is the backend server (Express.js) ACTUALLY running?** 
    *   **This is the most common cause.** Go back to the terminal where you ran `npm run server:dev`. 
    *   Is it still running? Or did it crash due to an error (e.g., database connection issues, code error)? 
    *   Look for messages like `🚀 Express server listening on port 3001`. If you don't see this, or see error messages, the backend is not ready.
    *   **Restart it if necessary:** `npm run server:dev`.

*   **Is the PostgreSQL database running and accessible?** 
    *   Check your backend server logs (from `npm run server:dev`) for any database connection errors (e.g., "Failed to connect to PostgreSQL", "password authentication failed"). 
    *   Ensure your credentials in the main `.env` file (used by the backend) are correct and your PostgreSQL server is active.

*   **Are both servers on the correct URLs/ports?**
    *   **Backend:** The Express server should be running on the port specified in its `.env` (default 3001). The backend terminal output will confirm this: `🚀 Express server listening on port [YOUR_PORT]`.
    *   **Frontend API URL:** The Next.js frontend uses `NEXT_PUBLIC_API_URL` to know where the backend is. This is set in `src/app/page.tsx` (defaults to `http://localhost:3001/api`) and can be overridden by a `.env.local` file in your project root. Make sure this URL exactly matches where your backend server is running and listening for API requests (e.g., `http://localhost:3001/api`).
    *   If you changed the `PORT` in the backend's `.env` file (e.g., to 3002), you *must* also update `NEXT_PUBLIC_API_URL` in the frontend (e.g., in `.env.local`) to `http://localhost:3002/api`.

*   **Check Browser Developer Console:** Open your browser's developer tools (usually F12), go to the "Console" and "Network" tabs.
    *   **Console:** Look for more detailed error messages. CORS errors might appear here if the `cors()` middleware in `server/index.js` isn't working as expected (though unlikely with the default setup).
    *   **Network Tab:** When the error occurs, find the failing request (e.g., to `/api/products`). Check its status code and response. If the status is `(failed)` or shows a network-related error, it strongly points to the server not being reachable.

*   **Firewall or Network Issues:** Ensure no firewall is blocking communication between the frontend and backend, especially if they are on different machines or in containerized environments (though for local development, this is rare).

*   **Backend API Endpoint Correctness:**
    *   The backend `server/index.js` defines `/api/products`. The frontend calls this. If this path is mismatched, it will fail. The server startup log `Frontend should connect to: http://localhost:[PORT]/api` helps confirm the base API path.

**Key takeaway:** The most frequent reason for "NetworkError" or "Failed to fetch" is that the backend server process (`npm run server:dev`) is not running, has crashed, or is not accessible at the URL the frontend is trying to reach. Always check the backend server's terminal first.

## Available Scripts

- `npm run dev`: Starts the Next.js development server (Turbopack, port 9002).
- `npm run server`: Starts the Express.js backend server.
- `npm run server:dev`: Starts the Express.js backend server with Nodemon for auto-restarts. **Use this for development.**
- `npm run build`: Builds the Next.js application for production.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Lints the project files.
- `npm run typecheck`: Runs TypeScript type checking.

To get started with development, take a look at `src/app/page.tsx` for the frontend and `server/index.js` for the backend.
