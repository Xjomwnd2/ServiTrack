# ServiTrack Backend API

A small Express + PostgreSQL API for managing customers, technicians, service requests, and jobs.

## Setup

1. Copy `.env.example` to `.env` and fill in your real PostgreSQL password:
   ```
   cp .env.example .env
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
   You should see:
   ```
   Connected to PostgreSQL database: servitrack
   ServiTrack API listening on http://localhost:3000
   ```

If you see "Database connection failed," double check:
- PostgreSQL service is running (Windows Services → postgresql-x64-18)
- The password in `.env` matches your actual PostgreSQL password
- `servitrack` database exists (`\l` in psql, or check pgAdmin)

## Endpoints

Each resource supports the same 5 actions: **list**, **get one**, **create**, **update**, **delete**.

| Resource | Base path |
|---|---|
| Customers | `/api/customers` |
| Technicians | `/api/technicians` |
| Service Requests | `/api/service-requests` |
| Jobs | `/api/jobs` |
| Users (staff/admin accounts) | `/api/users` |

Example:
- `GET /api/jobs` — list all jobs, with customer and technician names joined in
- `GET /api/jobs/1` — get job #1
- `POST /api/jobs` — create a job (JSON body)
- `PUT /api/jobs/1` — update job #1 (e.g. reassign technician or change status)
- `DELETE /api/jobs/1` — delete job #1

## Important: valid status/priority values

Your database has CHECK constraints restricting these fields:

- `service_requests.status` / `jobs.status`: `'new'`, `'scheduled'`, `'in_progress'`, `'completed'`
- `service_requests.priority`: `'low'`, `'medium'`, `'high'`

Sending any other value will return a 500 error with a `detail` field explaining the constraint violation.

## Testing with curl

```bash
# List all jobs
curl http://localhost:3000/api/jobs

# Create a customer
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","phone":"0700111222","email":"jane@example.com"}'
```

## Notes on `users` vs `technicians`

These are two separate tables with different purposes:
- **`technicians`** — field workers assigned to jobs (has `specialization`, `status`)
- **`users`** — staff/admin login accounts for the app itself (has `role`: e.g. `admin`, `dispatcher`, `staff`)

Do not use `role = 'technician'` in `users` anymore — technicians live in their own table now.
