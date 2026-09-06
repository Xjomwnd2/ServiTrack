# ServiTrack

> A full-stack service business management system for managing customers and service requests.

![Project Status](https://img.shields.io/badge/status-in%20development-orange)
![Frontend](https://img.shields.io/badge/frontend-React-blue)
![Backend](https://img.shields.io/badge/backend-Express-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)

## Overview

**ServiTrack** is a full-stack web application designed to help small service businesses organize and manage their daily operations from one centralized system.

The application is intended for businesses such as:

* Repair services
* Plumbing businesses
* Electrical service providers
* Cleaning businesses
* IT support services
* Maintenance companies
* Appliance repair businesses

ServiTrack currently provides secure user authentication, customer management, service request management, and a business dashboard.

This project is being developed as a **CSE 499 Senior Project**.

---

## Problem Statement

Many small service businesses manage customer information and service requests using notebooks, spreadsheets, text messages, or multiple applications.

This can make it difficult to:

* Keep customer information organized
* Track service requests
* Monitor work progress
* Manage business activities efficiently
* Access important information from one location

**ServiTrack addresses this problem by providing a centralized web application for managing service business operations.**

---

## Current Features

### Authentication

ServiTrack currently supports:

* User registration
* User login
* JWT authentication
* Protected API routes
* User logout
* Persistent login using browser local storage

Passwords are securely hashed using **bcrypt**.

---

### Customer Management

Authenticated users can:

* Add customers
* View customers
* Edit customer information
* Delete customers
* Search customers

Customer records include:

* Name
* Phone number
* Email address
* Address
* Notes

---

### Service Request Management

Authenticated users can:

* Create service requests
* View service requests
* Delete service requests

Service requests include:

* Customer
* Service description
* Date requested
* Priority
* Status
* Assigned technician
* Notes

Supported priority levels include:

* Low
* Medium
* High
* Urgent

Service request statuses include:

* New
* Scheduled
* In Progress
* Completed
* Cancelled

---

### Dashboard

The application currently includes a dashboard displaying:

* Total customers
* New requests
* Scheduled jobs
* Completed jobs
* Upcoming appointments

Customer statistics are currently connected to live customer data.

Additional dashboard functionality is planned for future development.

---

## Planned Features

The following features are part of the ServiTrack project plan and database design but are still under development:

* Job management
* Job scheduling
* Technician management
* Job assignment
* Job status tracking
* Advanced dashboard statistics
* Search and filtering
* Service history
* Reports
* Deployment

---

# Technology Stack

## Frontend

The frontend is built with:

* React
* Vite
* JavaScript
* HTML
* CSS

### Frontend Dependencies

* React
* React DOM

### Development Tools

* Vite
* OXLint

---

## Backend

The backend is built with:

* Node.js
* Express.js

The backend provides REST API endpoints for:

* Authentication
* Customers
* Service Requests

---

## Database

ServiTrack uses:

* PostgreSQL

The database schema currently includes tables for:

* Users
* Customers
* Service Requests
* Jobs
* Job Status History

---

## Security

ServiTrack currently uses:

* bcrypt for password hashing
* JSON Web Tokens (JWT)
* Authentication middleware
* Protected API routes
* Environment variables for configuration

---

# Project Architecture

```text
                    SERVITRACK

                         │
          ┌──────────────┴──────────────┐
          │                             │

     React Frontend                Express Backend
          │                             │
          │                         REST API
          │                             │
          └──────────────┬──────────────┘
                         │

                    PostgreSQL
```

### Application Flow

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP Requests
 ▼
Express REST API
 │
 │ SQL Queries
 ▼
PostgreSQL Database
```

---

# Project Structure

The current project structure is:

```text
ServiTrack/
│
├── client/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── ServiceRequests.jsx
│   │   │
│   │   └── assets/
│   │       ├── hero.png
│   │       ├── react.svg
│   │       └── vite.svg
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .gitignore
│
├── database/
│   │
│   └── schema.sql
│
├── docs/
│
├── server/
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   └── serviceRequestController.js
│   │
│   ├── db/
│   │   └── index.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── customerModel.js
│   │   ├── serviceRequestModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   └── serviceRequestRoutes.js
│   │
│   ├── .env
│   ├── index.js
│   ├── load-schema.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# Installation

## Prerequisites

Before running ServiTrack, install the following:

* Node.js
* npm
* PostgreSQL
* Git

Verify Node.js and npm:

```bash
node --version
npm --version
```

Verify PostgreSQL:

```bash
psql --version
```

---

# Clone the Repository

Clone the ServiTrack repository:

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd ServiTrack
```

---

# Database Setup

## 1. Create the PostgreSQL Database

Create a PostgreSQL database named:

```text
servitrack
```

For example:

```sql
CREATE DATABASE servitrack;
```

---

## 2. Configure Environment Variables

Navigate to the server directory:

```bash
cd server
```

Create a `.env` file.

Use the following format:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=servitrack
DB_USER=postgres
DB_PASSWORD=your_database_password

JWT_SECRET=your_secret_key
```

> **Important:** Never commit your actual `.env` file or database password to GitHub.

---

## 3. Load the Database Schema

From the server directory:

```bash
node load-schema.js
```

This creates the ServiTrack database tables and indexes.

---

# Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

You should see a message similar to:

```text
ServiTrack server running on http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Vite will display the local development URL.

Typically:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# Running ServiTrack

ServiTrack requires both the backend and frontend servers to run.

## Terminal 1 — Backend

```bash
cd ServiTrack/server
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Terminal 2 — Frontend

```bash
cd ServiTrack/client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# API Endpoints

## Authentication

### Register User

```text
POST /api/auth/register
```

### Login

```text
POST /api/auth/login
```

### Protected Route Test

```text
GET /api/auth/protected-test
```

This route requires a valid JWT token.

---

# Customer API

All customer routes require authentication.

### Create Customer

```text
POST /api/customers
```

### Get Customers

```text
GET /api/customers
```

### Search Customers

```text
GET /api/customers?search=customer-name
```

### Get Customer

```text
GET /api/customers/:id
```

### Update Customer

```text
PUT /api/customers/:id
```

### Delete Customer

```text
DELETE /api/customers/:id
```

---

# Service Request API

All service request routes require authentication.

### Create Service Request

```text
POST /api/service-requests
```

### Get Service Requests

```text
GET /api/service-requests
```

### Get Service Request

```text
GET /api/service-requests/:id
```

### Update Service Request

```text
PUT /api/service-requests/:id
```

### Delete Service Request

```text
DELETE /api/service-requests/:id
```

---

# Authentication Flow

ServiTrack uses JWT authentication.

The authentication process works as follows:

```text
1. User enters email and password
            │
            ▼
2. React sends login request
            │
            ▼
3. Express validates credentials
            │
            ▼
4. Password is verified with bcrypt
            │
            ▼
5. JWT token is created
            │
            ▼
6. Token is returned to React
            │
            ▼
7. Token is stored in localStorage
            │
            ▼
8. Protected API requests include the token
```

---

# Database Schema

## Users

Stores authenticated application users.

Fields include:

* user_id
* full_name
* email
* password_hash
* role
* created_at

Supported roles:

* Admin
* Manager
* Technician

---

## Customers

Stores customer information.

Fields include:

* customer_id
* name
* phone
* email
* address
* notes
* created_at
* updated_at

---

## Service Requests

Stores customer service requests.

Fields include:

* request_id
* customer_id
* description
* date_requested
* priority
* status
* assigned_technician_id
* notes

---

## Jobs

The Jobs table is included in the database schema for future job scheduling functionality.

Fields include:

* job_id
* request_id
* customer_id
* technician_id
* job_description
* scheduled_date
* scheduled_time
* location
* status

---

## Job Status History

Stores job status changes.

Fields include:

* history_id
* job_id
* status
* changed_by
* changed_at
* notes

---

# Development Status

## Completed

* [x] GitHub repository
* [x] React frontend setup
* [x] Vite configuration
* [x] Express backend setup
* [x] PostgreSQL database schema
* [x] Database connection configuration
* [x] User authentication
* [x] Password hashing
* [x] JWT authentication
* [x] Protected API routes
* [x] Customer CRUD operations
* [x] Customer search
* [x] Service request creation
* [x] Service request listing
* [x] Service request deletion
* [x] Basic dashboard
* [x] Team Git workflow

## In Progress

* [ ] Job management
* [ ] Job scheduling
* [ ] Technician management
* [ ] Job assignment
* [ ] Job status tracking
* [ ] Dynamic dashboard statistics
* [ ] Advanced filtering
* [ ] Testing
* [ ] Responsive improvements
* [ ] Deployment

---

# Development Plan

## Sprint 1 — Foundation

Completed:

* GitHub repository setup
* React setup
* Express setup
* PostgreSQL connection
* Database schema
* Basic navigation
* Team collaboration setup

---

## Sprint 2 — Authentication and Customers

Current work includes:

* User registration
* Login
* JWT authentication
* Protected routes
* Customer CRUD
* Customer search

---

## Sprint 3 — Service Requests and Jobs

Planned work:

* Complete service request management
* Job management
* Job scheduling
* Technician assignment
* Job status tracking

---

## Sprint 4 — Finalization

Planned work:

* Dashboard improvements
* Search and filtering
* Testing
* Bug fixing
* Responsive design
* Documentation
* Deployment
* Final project presentation

---

# Team Collaboration

ServiTrack is developed as a team project using Git and GitHub.

Team members should:

1. Pull the latest changes before starting work.
2. Create feature branches when appropriate.
3. Make meaningful commits.
4. Push changes regularly.
5. Communicate changes with the team.
6. Review code when appropriate.

---

## Recommended Git Workflow

Before starting work:

```bash
git pull origin main
```

Check the current branch:

```bash
git branch
```

Create a feature branch:

```bash
git checkout -b feature/feature-name
```

After making changes:

```bash
git add .
```

Create a meaningful commit:

```bash
git commit -m "Add customer search functionality"
```

Push the branch:

```bash
git push origin feature/feature-name
```

---

# Testing

The team plans to test:

* User registration
* User login
* JWT authentication
* Protected routes
* Customer creation
* Customer editing
* Customer deletion
* Customer search
* Service request creation
* Service request updates
* Service request deletion
* API endpoints
* Form validation
* Database operations

---

# Target Users

ServiTrack is designed for small service businesses that need a simple way to manage:

* Customers
* Service requests
* Jobs
* Technicians
* Business activities

The project focuses on providing useful business management functionality without the complexity of large enterprise systems.

---

# Project Vision

Our vision is to create a simple, reliable, and user-friendly management system that helps small service businesses organize their customers and service operations.

ServiTrack aims to provide one centralized place for managing customer information, service requests, jobs, schedules, technicians, and business progress.

---

# Contributors

### Joel Ndiba Mwaura

* Project Team Member
* Full-Stack Developer

### Jamoah

* Project Team Member
* Developer

---

# Favorite Quotes

> "Success is the sum of small efforts, repeated day in and day out." — Robert Collier

> Each team member contributes a favorite quote to this README as part of the CSE 499 Git Setup activity.

---

# Course Information

**Course:** CSE 499 — Senior Project

**Project:** ServiTrack

**Project Type:** Full-Stack Web Application

**Development Method:** Agile Sprint Development

---

# License

This project is licensed under the license included in the repository.

---

# Project Status

🚧 **Active Development**

ServiTrack is currently under development as part of the CSE 499 Senior Project.
