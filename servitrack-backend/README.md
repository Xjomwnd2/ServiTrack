# ServiTrack Backend API

A small Express + PostgreSQL API for managing customers, technicians, service requests, jobs, users, and dashboard information for the ServiTrack service business management system.

The backend provides REST API endpoints used by the ServiTrack React frontend.

## Current Project Status

**Sprint 4: Dashboard, Testing, and Finalisation**

The team is currently completing the final development and testing activities for ServiTrack.

### Sprint 4 Progress

* ✅ Dashboard API development
* ✅ Dashboard UI integration
* ✅ Database statistics
* ✅ Upcoming jobs functionality
* ✅ Frontend/backend API integration testing
* ✅ Authentication testing
* ✅ Customer functionality testing
* ✅ Service request testing
* ✅ Job functionality testing
* ✅ API and navigation testing
* 🔄 Bug fixing and regression testing
* 🔄 Authentication and security review
* 🔄 Validation and error-handling improvements
* 🔄 Documentation and README updates
* 🔄 Deployment preparation
* ⏳ Final deployment
* ⏳ Final project video

The project is currently in the final testing and preparation stage.

---

## Technology Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **JWT authentication**
* **bcrypt password hashing**
* **REST API**
* **React/Vite frontend**

---

## Setup

### 1. Configure environment variables

Copy `.env.example` to `.env` and enter your actual PostgreSQL credentials:

```bash
cp .env.example .env
```

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=servitrack
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret
PORT=5000
```

Do not commit the `.env` file to GitHub because it contains sensitive configuration information.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

For normal startup:

```bash
npm start
```

For development with automatic restart, if configured:

```bash
npm run dev
```

The backend should run at:

```text
http://localhost:5000
```

The API root can be used to confirm that the server is running.

Expected response:

```text
ServiTrack API is running!
```

### Database Connection

When the server starts successfully, it should connect to the PostgreSQL `servitrack` database.

If you see:

```text
Database connection failed
```

check the following:

* PostgreSQL service is running.
* Windows Services contains the PostgreSQL service.
* The PostgreSQL password in `.env` is correct.
* The `servitrack` database exists.
* PostgreSQL is running on port `5432`.
* The database user has permission to access the database.

You can verify the database in `psql` or pgAdmin.

---

# API Endpoints

Each resource provides REST operations appropriate to that resource.

| Resource         | Base Path               |
| ---------------- | ----------------------- |
| Customers        | `/api/customers`        |
| Technicians      | `/api/technicians`      |
| Service Requests | `/api/service-requests` |
| Jobs             | `/api/jobs`             |
| Users            | `/api/users`            |
| Dashboard        | `/api/dashboard`        |

## Customers

```text
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

Example:

```text
GET /api/customers
```

returns the customer records.

---

## Technicians

```text
GET    /api/technicians
GET    /api/technicians/:id
POST   /api/technicians
PUT    /api/technicians/:id
DELETE /api/technicians/:id
```

Technicians represent field workers who can be assigned to service jobs.

---

## Service Requests

```text
GET    /api/service-requests
GET    /api/service-requests/:id
POST   /api/service-requests
PUT    /api/service-requests/:id
DELETE /api/service-requests/:id
```

Service requests contain information about customer requests for service.

Typical information includes:

* Customer
* Request description
* Date requested
* Priority
* Status
* Assigned technician

---

## Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

Example:

```text
GET /api/jobs
```

returns jobs together with related customer and technician information where applicable.

Example:

```text
GET /api/jobs/1
```

gets job number 1.

Example:

```text
POST /api/jobs
```

creates a new job.

Example:

```text
PUT /api/jobs/1
```

updates job number 1, such as changing its status or technician assignment.

Example:

```text
DELETE /api/jobs/1
```

deletes job number 1.

---

# Dashboard API

Sprint 4 introduced the Dashboard API to provide summary information needed by the ServiTrack dashboard.

Base path:

```text
/api/dashboard
```

The dashboard is designed to provide information such as:

* Database statistics
* Service request information
* Job information
* Upcoming jobs
* Other summary information needed by the dashboard

The React frontend retrieves this information through the Dashboard API.

The dashboard API and UI are currently being tested to make sure the displayed information accurately reflects the PostgreSQL database.

---

# Important: Valid Status and Priority Values

The database uses CHECK constraints to restrict certain fields to valid values.

## Service Request Status

Valid values include:

```text
new
scheduled
in_progress
completed
```

## Job Status

Valid values include:

```text
new
scheduled
in_progress
completed
```

## Service Request Priority

Valid values are:

```text
low
medium
high
```

Sending an unsupported value can result in a database constraint error.

The application is being improved during Sprint 4 to provide better validation and clearer error handling before invalid data reaches the database.

---

# Authentication and Security

ServiTrack uses authentication to protect application resources.

Current security features include:

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Authentication middleware
* Role-based user structure
* Environment variables for sensitive configuration
* Database constraints
* Input validation and error handling

Sprint 4 includes a final review of authentication and security to identify and correct potential issues before deployment.

---

# Testing

Full-system testing is being performed during Sprint 4.

Testing currently includes:

### Authentication

* Login
* Registration
* Protected routes
* JWT authentication

### Customer Management

* Create customer
* View customers
* Update customer
* Delete customer
* Customer search and retrieval

### Service Requests

* Create service request
* View service requests
* Update service request
* Delete service request
* Status and priority validation

### Jobs

* Create job
* View jobs
* Update job
* Delete job
* Technician assignment
* Job status changes

### Dashboard

* Dashboard API response
* Database statistics
* Upcoming jobs
* Frontend/backend integration

### General Testing

* Navigation
* API responses
* Error handling
* Validation
* Frontend/backend integration
* Regression testing

Additional regression testing will be performed after the remaining fixes are completed.

---

# Testing with curl

## List all jobs

```bash
curl http://localhost:5000/api/jobs
```

## List customers

```bash
curl http://localhost:5000/api/customers
```

## Create a customer

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","phone":"0700111222","email":"jane@example.com"}'
```

## Test the Dashboard API

```bash
curl http://localhost:5000/api/dashboard
```

If the endpoint is protected, a valid authentication token must be supplied.

---

# Users vs Technicians

`users` and `technicians` are separate tables with different purposes.

### `technicians`

Technicians are field workers who can be assigned to service jobs.

Technician information may include:

* Name
* Phone
* Specialization
* Status

### `users`

Users are staff or administrator accounts used to log into the ServiTrack application.

User accounts may have roles such as:

```text
admin
manager
technician
```

The application uses authentication and authorization to control access to protected functionality.

Technician records should be managed according to the current database design rather than creating duplicate technician information in the `users` table.

---

# Database

ServiTrack uses PostgreSQL.

Default local configuration:

```text
Database: servitrack
Host: localhost
Port: 5432
User: postgres
```

The database stores information related to:

* Users
* Customers
* Technicians
* Service requests
* Jobs

Relationships between these tables allow the application to connect customers with their service requests and jobs and to associate jobs with technicians.

---

# Project Structure

The backend is organized around controllers, models, routes, middleware, and configuration.

```text
server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── .env.example
├── index.js
├── package.json
└── README.md
```

The Dashboard functionality includes its own controller, model, and routes.

---

# Frontend Integration

The backend API is consumed by the ServiTrack React/Vite frontend.

During local development:

### Backend

```text
http://localhost:5000
```

### Frontend

```text
http://localhost:5173
```

The frontend communicates with the Express API using HTTP requests.

---

# Sprint 4 Finalisation

The Sprint 4 goal is:

> Complete all Core requirements and implement at least one Enhancement requirement.

## Core Sprint 4 Tasks

* Create Dashboard API
* Create Dashboard UI
* Display database statistics
* Display upcoming jobs
* Perform full system testing
* Fix bugs
* Review authentication and security
* Improve validation and error handling
* Update project documentation
* Update README
* Deploy the application
* Record the final project video

## Enhancement Priorities

If all Core requirements are functioning correctly, the team will implement enhancements in this order:

1. Technician Management
2. Job Assignment
3. Advanced Search and Filtering
4. Service History

---

# Current Finalisation Status

| Area                    | Status                  |
| ----------------------- | ----------------------- |
| Dashboard API           | 🔄 In progress/testing  |
| Dashboard UI            | 🔄 In progress/testing  |
| Database statistics     | ✅ Implemented           |
| Upcoming jobs           | ✅ Implemented/worked on |
| Authentication testing  | ✅ Tested                |
| Customer testing        | ✅ Tested                |
| Service request testing | ✅ Tested                |
| Job testing             | ✅ Tested                |
| API testing             | ✅ Tested                |
| Navigation testing      | ✅ Tested                |
| Bug fixing              | 🔄 In progress          |
| Security review         | 🔄 In progress          |
| Validation improvements | 🔄 In progress          |
| Error handling          | 🔄 In progress          |
| Documentation           | 🔄 In progress          |
| README                  | 🔄 Updated              |
| Deployment              | ⏳ Pending               |
| Final project video     | ⏳ Pending               |

---

# Team

## CSE 499 Team 7

* **Joel Ndiba Mwaura**
* **Jacob Amoah**

The team is working together to develop, test, document, and finalize the ServiTrack Service Business Management System.

---

# Project Goal

ServiTrack is designed to provide service businesses with a centralized system for managing:

* Customers
* Technicians
* Service requests
* Jobs
* Scheduling
* Dashboard information

The long-term goal is to provide a reliable and user-friendly system that helps service businesses organize their daily operations and make better use of their service data.

Future improvements may include:

* Technician management
* Advanced job assignment
* Advanced search and filtering
* Service history
* Scheduling calendar
* Notifications
* Reporting and analytics
* Cloud deployment
* Responsive improvements

---

**ServiTrack — CSE 499 Team 7**

*Service Business Management System*
