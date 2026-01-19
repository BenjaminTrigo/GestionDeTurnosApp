-- Active: 1768410033872@@127.0.0.1@5432
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'CLIENT'
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10, 2),
    ALTER TABLE services ADD COLUMN is_active BOOLEAN DEFAULT true
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    users_id INTEGER REFERENCES users(id),
    services_id INTEGER REFERENCES services(id),
    appointments_date DATE NOT NULL,
    appointments_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING'
);