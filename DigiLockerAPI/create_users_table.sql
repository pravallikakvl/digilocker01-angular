-- Create users table for DigiLocker application
-- Run this in your CockroachDB database: kemis_db

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    mobile_number VARCHAR(15),
    date_of_birth DATE,
    gender VARCHAR(10),
    student_id VARCHAR(50),
    user_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);

-- Create index on role for filtering
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Insert sample data
INSERT INTO users (email, first_name, last_name, role, mobile_number, date_of_birth, gender, student_id, user_id, is_active)
VALUES 
    ('rahul@student.edu', 'Rahul', 'Kumar', 'student', '9876543210', '2000-05-15', 'Male', 'STU001', 'STUDENT20241101001', true),
    ('admin@delhiuniversity.edu', 'Delhi', 'University', 'institute', '9876543211', NULL, 'Other', NULL, 'INSTITUTE20241101001', true)
ON CONFLICT (email) DO NOTHING;
