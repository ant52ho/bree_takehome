-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE application_state AS ENUM ('open', 'cancelled', 'rejected', 'outstanding', 'repaid');
CREATE TYPE disbursement_state AS ENUM ('pending', 'disbursed', 'cancelled');
CREATE TYPE transaction_type AS ENUM ('disbursement', 'repayment', 'fee', 'tip');

-- Create users table
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    credit_limit DECIMAL(10,2) NOT NULL,
    user_role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create applications table
CREATE TABLE applications (
    application_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id),
    application_state application_state NOT NULL,
    requested_amount DECIMAL(10,2) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for applications
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create transactions table
CREATE TABLE transactions (
    transaction_id VARCHAR(255) PRIMARY KEY,
    application_id VARCHAR(255) REFERENCES applications(application_id),
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for transactions
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create disbursements table
CREATE TABLE disbursements (
    disbursement_id VARCHAR(255) PRIMARY KEY,
    application_id VARCHAR(255) REFERENCES applications(application_id),
    amount DECIMAL(10,2) NOT NULL,
    disbursement_state disbursement_state NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for disbursements
CREATE TRIGGER update_disbursements_updated_at
    BEFORE UPDATE ON disbursements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    

-- create indices
-- Primary Keys (always)
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_applications_application_id ON applications(application_id);
CREATE INDEX idx_disbursements_state ON disbursements(disbursement_state);

-- Foreign Keys (frequently queried)
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_transactions_application_id ON transactions(application_id);
CREATE INDEX idx_disbursements_application_id ON disbursements(application_id);

-- Composite Index for common query pattern
CREATE INDEX idx_applications_user_created ON applications(user_id, created_at DESC);

-- for scheduling, will be used frequently with scale
CREATE INDEX idx_applications_state_due_date ON applications(application_state, due_date);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- we frequently need to aggregate when summing up outstanding balance
CREATE INDEX idx_transactions_type_application ON transactions(transaction_type, application_id);