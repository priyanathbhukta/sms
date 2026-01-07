-- =====================================================
-- SMS Core Service - Sample Test Data
-- This file loads automatically on application startup
-- =====================================================

-- Note: Passwords are BCrypt encoded. Default password for all users is: Password@123
-- BCrypt hash for "Password@123" = $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

-- =====================================================
-- ADMIN USER (email: admin@sms.edu.in)
-- =====================================================
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
VALUES (1, 'admin@sms.edu.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Admin', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CLASSES
-- =====================================================
INSERT INTO class_entity (id, class_name, section, academic_year, created_at, updated_at)
VALUES 
    (1, 'Class 10', 'A', '2025-2026', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Class 10', 'B', '2025-2026', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Class 9', 'A', '2025-2026', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SUBJECTS
-- =====================================================
INSERT INTO subject (id, subject_name, subject_code, created_at, updated_at)
VALUES 
    (1, 'Mathematics', 'MATH101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'English', 'ENG101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Physics', 'PHY101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Chemistry', 'CHEM101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Computer Science', 'CS101', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FACULTY USERS
-- =====================================================
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
VALUES 
    (2, 'john.smith.F001@sms.edu.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Smith', 'FACULTY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'jane.doe.F002@sms.edu.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Doe', 'FACULTY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO faculty (id, employee_id, department, user_id, created_at, updated_at)
VALUES 
    (1, 'F001', 'Mathematics', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'F002', 'English', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STUDENT USERS
-- =====================================================
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
VALUES 
    (4, 'alice.johnson.S001@sms.edu.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alice', 'Johnson', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'bob.wilson.S002@sms.edu.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob', 'Wilson', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 'charlie.brown.S003@sms.edu.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Charlie', 'Brown', 'STUDENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO student (id, student_id, date_of_birth, user_id, class_entity_id, created_at, updated_at)
VALUES 
    (1, 'S001', '2010-05-15', 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'S002', '2010-08-22', 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'S003', '2011-03-10', 6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- LIBRARIAN USER
-- =====================================================
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
VALUES (7, 'mary.lib.L001@sms.edu.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mary', 'Librarian', 'LIBRARIAN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO librarian (id, employee_id, user_id, created_at, updated_at)
VALUES (1, 'L001', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- LIBRARY BOOKS
-- =====================================================
INSERT INTO book (id, title, author, isbn, copies_available, created_at, updated_at)
VALUES 
    (1, 'Introduction to Algorithms', 'Thomas H. Cormen', '978-0262033848', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Clean Code', 'Robert C. Martin', '978-0132350884', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'The Pragmatic Programmer', 'David Thomas', '978-0135957059', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Physics for Scientists', 'Raymond A. Serway', '978-1133947271', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Organic Chemistry', 'Paula Y. Bruice', '978-0134042282', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COURSES
-- =====================================================
INSERT INTO course (id, course_name, course_code, credits, created_at, updated_at)
VALUES 
    (1, 'Advanced Mathematics', 'MATH201', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'English Literature', 'ENG201', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Applied Physics', 'PHY201', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- FEES STRUCTURE
-- =====================================================
INSERT INTO fees_structure (id, class_entity_id, fee_type, amount, due_date, created_at, updated_at)
VALUES 
    (1, 1, 'TUITION', 50000.00, '2026-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 1, 'LIBRARY', 2000.00, '2026-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 2, 'TUITION', 50000.00, '2026-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEQUENCE UPDATES (Reset sequences after manual inserts)
-- =====================================================
-- Note: Uncomment these for PostgreSQL to avoid ID conflicts
-- SELECT setval('users_id_seq', (SELECT MAX(id) FROM users) + 1);
-- SELECT setval('class_entity_id_seq', (SELECT MAX(id) FROM class_entity) + 1);
-- SELECT setval('subject_id_seq', (SELECT MAX(id) FROM subject) + 1);
-- SELECT setval('faculty_id_seq', (SELECT MAX(id) FROM faculty) + 1);
-- SELECT setval('student_id_seq', (SELECT MAX(id) FROM student) + 1);
-- SELECT setval('librarian_id_seq', (SELECT MAX(id) FROM librarian) + 1);
-- SELECT setval('book_id_seq', (SELECT MAX(id) FROM book) + 1);
-- SELECT setval('course_id_seq', (SELECT MAX(id) FROM course) + 1);
-- SELECT setval('fees_structure_id_seq', (SELECT MAX(id) FROM fees_structure) + 1);
