-- ============================================
-- ServiTrack Database Schema
-- CSE 499 Senior Project
-- ============================================

-- USERS
-- Stores business users and technicians.
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'technician',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('admin', 'manager', 'technician'))
);


-- CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- SERVICE REQUESTS
CREATE TABLE IF NOT EXISTS service_requests (
    request_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    date_requested DATE NOT NULL DEFAULT CURRENT_DATE,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    assigned_technician_id INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT service_requests_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT service_requests_technician_fk
        FOREIGN KEY (assigned_technician_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT service_requests_priority_check
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

    CONSTRAINT service_requests_status_check
        CHECK (
            status IN (
                'new',
                'scheduled',
                'in_progress',
                'completed',
                'cancelled'
            )
        )
);


-- JOBS
CREATE TABLE IF NOT EXISTS jobs (
    job_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    technician_id INTEGER,
    job_description TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    location TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT jobs_request_fk
        FOREIGN KEY (request_id)
        REFERENCES service_requests(request_id)
        ON DELETE CASCADE,

    CONSTRAINT jobs_customer_fk
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT jobs_technician_fk
        FOREIGN KEY (technician_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT jobs_status_check
        CHECK (
            status IN (
                'new',
                'scheduled',
                'in_progress',
                'completed',
                'cancelled'
            )
        )
);


-- JOB STATUS HISTORY
-- Keeps a record whenever a job's status changes.
CREATE TABLE IF NOT EXISTS job_status_history (
    history_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL,
    changed_by INTEGER,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    CONSTRAINT history_job_fk
        FOREIGN KEY (job_id)
        REFERENCES jobs(job_id)
        ON DELETE CASCADE,

    CONSTRAINT history_user_fk
        FOREIGN KEY (changed_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    CONSTRAINT history_status_check
        CHECK (
            status IN (
                'new',
                'scheduled',
                'in_progress',
                'completed',
                'cancelled'
            )
        )
);


-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_customers_name
    ON customers(name);

CREATE INDEX IF NOT EXISTS idx_customers_email
    ON customers(email);

CREATE INDEX IF NOT EXISTS idx_service_requests_customer
    ON service_requests(customer_id);

CREATE INDEX IF NOT EXISTS idx_service_requests_status
    ON service_requests(status);

CREATE INDEX IF NOT EXISTS idx_service_requests_priority
    ON service_requests(priority);

CREATE INDEX IF NOT EXISTS idx_jobs_customer
    ON jobs(customer_id);

CREATE INDEX IF NOT EXISTS idx_jobs_technician
    ON jobs(technician_id);

CREATE INDEX IF NOT EXISTS idx_jobs_status
    ON jobs(status);

CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date
    ON jobs(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_job_status_history_job
    ON job_status_history(job_id);