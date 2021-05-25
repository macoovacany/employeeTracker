
-- SEED VALUES 
INSERT INTO DEPARTMENTS (DEPARTMENT_NAME) VALUES
('Sales'), ('Legal'), ('Marketing'), ('Engineering'), ('Office Support'), ('Finance');

-- new database so the harc coded values for the relative ids __should__ be correct
INSERT INTO ROLES (TITLE, SALARY, DEPARTMENT_ID) VALUES
('Sales Lead', 10000, 1), ('Salesperson', 80000, 1), 
('Lead Engineer', 15000, 4), ('Engineer', 120000, 4), 
('Accountant', 125000, 6), ('Legal Team Lead', 250000, 2), 
('Lawyer', 190000, 2);



INSERT INTO EMPLOYEES (FIRST_NAME, LAST_NAME, ROLES_ID, MANAGER_ID) VALUES
('Alana', 'Crofts', 1, NULL), 
('Rebecca', 'Barton',3 , NULL),
('Maddison', 'Weatherly', 6, NULL), 
('John', 'Doe', 2, 1),  
('Mike', 'Chan', 4, 2), 
('Ashley', 'Rodriguez', 5, NULL),
('Sarah', 'Lourd', 7, 3), 
('Kevin', 'Tupik',7 ,3), 
('Malia', 'Brown', 7, 3), 
('Tom', 'Allen', 7, 3), 
('Jayden', 'Isaachsen', 5, NULL), 
('Hamish', 'Gregg', 2, 1);
