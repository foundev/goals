# Goals Tracker

A full-stack goals tracking web application featuring a FastAPI backend with SQLite storage and a React front-end styled with Material UI. Users can register, log in, create goals, and record the time spent working on each goal.

## Features

- User registration and authentication backed by JSON Web Tokens (JWT)
- Goals CRUD (create, read, update, delete) operations
- Time tracking for each goal with aggregated totals
- Responsive React interface built with Material UI components
- REST API documented via FastAPI's interactive docs

## Project Structure

```
backend/    FastAPI application and dependencies
frontend/   React application built with Vite and Material UI
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive documentation is provided at `http://localhost:8000/docs`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The front-end development server runs at `http://localhost:5173` and proxies API calls to the FastAPI backend when both are running locally.

## Environment Variables

The backend uses a static JWT secret in `backend/app/auth.py` for demonstration purposes. Update `SECRET_KEY` with a secure random value before deploying.

## Database

SQLite is used for local storage. The database file `goals.db` is created automatically in the backend directory. To reset the database, stop the server and delete `backend/goals.db`.

## Testing Accounts

1. Register a new account via the front-end or by issuing a POST request to `/auth/register`.
2. Log in with the same credentials to receive a token and interact with goals.

## Building for Production

- Backend: Configure a production ASGI server such as Uvicorn or Hypercorn behind a process manager (e.g., Gunicorn) and serve behind a reverse proxy.
- Frontend: Run `npm run build` to produce optimized assets in `frontend/dist`. Serve the static files using your preferred hosting solution and configure it to forward API requests to the backend service.

## License

This project is released under the [MIT License](LICENSE).
