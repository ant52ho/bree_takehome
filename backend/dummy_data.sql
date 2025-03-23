-- Insert sample users with different credit limits and roles
INSERT INTO users (credit_limit, user_role) VALUES
    (5000.00, 'borrower'),
    (10000.00, 'borrower'),
    (15000.00, 'borrower'),
    (20000.00, 'admin'),
    (25000.00, 'borrower');

-- Insert sample applications with various states
INSERT INTO applications (user_id, application_state, requested_amount) VALUES
    (1, 'open', 2000.00),
    (1, 'repaid', 3000.00),
    (2, 'outstanding', 5000.00),
    (3, 'rejected', 20000.00),
    (4, 'cancelled', 1000.00),
    (5, 'outstanding', 7500.00);

-- Insert sample disbursements
INSERT INTO disbursements (application_id, amount, disbursement_state, due_date) VALUES
    (2, 3000.00, 'disbursed', CURRENT_TIMESTAMP + INTERVAL '30 days'),
    (3, 5000.00, 'disbursed', CURRENT_TIMESTAMP + INTERVAL '45 days'),
    (1, 2000.00, 'pending', CURRENT_TIMESTAMP + INTERVAL '30 days'),
    (6, 7500.00, 'disbursed', CURRENT_TIMESTAMP + INTERVAL '60 days');

-- Insert sample transactions
INSERT INTO transactions (application_id, transaction_type, amount) VALUES
    -- Disbursement transactions
    (2, 'disbursement', 3000.00),
    (3, 'disbursement', 5000.00),
    (6, 'disbursement', 7500.00),
    
    -- Repayment transactions for application 2
    (2, 'repayment', 1500.00),
    (2, 'repayment', 1500.00),
    
    -- Partial repayment for application 3
    (3, 'repayment', 2000.00),
    
    -- Fee transactions
    (2, 'fee', 50.00),
    (3, 'fee', 75.00),
    (6, 'fee', 100.00);
