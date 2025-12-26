# SMS Core Service - Postman Testing Guide

## Overview
Complete guide for testing SMS application endpoints in Postman with all regex patterns, input formats, and test cases.

---

## Table of Contents
1. [Email Format Validation Rules](#email-format-validation-rules)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Class Management Endpoints](#class-management-endpoints)
4. [Subject Management Endpoints](#subject-management-endpoints)
5. [Attendance Endpoints](#attendance-endpoints)
6. [Postman Collection Structure](#postman-collection-structure)
7. [Test Scenarios](#test-scenarios)

---

## Email Format Validation Rules

### Student Email Format
**Regex:** `^[a-zA-Z]+\.[a-zA-Z]+\.\d{4}@sms\.edu\.in$`

**Pattern:** `{FirstName}.{LastName}.{RollNumber4Digits}@sms.edu.in`

**Valid Examples:**
- `john.doe.2024@sms.edu.in`
- `alice.smith.2025@sms.edu.in`
- `bob.johnson.2023@sms.edu.in`
- `sarah.williams.2026@sms.edu.in`

**Invalid Examples:**
- `john.doe.24@sms.edu.in` ❌ (only 2 digits)
- `john.doe.20245@sms.edu.in` ❌ (5 digits)
- `john_doe.2024@sms.edu.in` ❌ (underscore not allowed)
- `john.doe.2024@sms.com` ❌ (wrong domain)
- `john.2024@sms.edu.in` ❌ (missing last name)

---

### Faculty Email Format
**Regex:** `^[a-zA-Z]+\.[a-zA-Z]+\.\d{3}@sms\.edu\.in$`

**Pattern:** `{FirstName}.{LastName}.{FacultyId3Digits}@sms.edu.in`

**Valid Examples:**
- `james.brown.001@sms.edu.in`
- `emily.davis.102@sms.edu.in`
- `michael.taylor.999@sms.edu.in`
- `jessica.anderson.456@sms.edu.in`

**Invalid Examples:**
- `james.brown.01@sms.edu.in` ❌ (only 2 digits)
- `james.brown.0012@sms.edu.in` ❌ (4 digits)
- `james_brown.001@sms.edu.in` ❌ (underscore not allowed)
- `james.brown.001@sms.com` ❌ (wrong domain)

---

### Admin Email Format
**Regex:** `^[a-zA-Z0-9._%+-]+@sms\.admin\.in$`

**Pattern:** `{AnyValidEmailPrefix}@sms.admin.in`

**Valid Examples:**
- `admin@sms.admin.in`
- `john.smith@sms.admin.in`
- `admin_user@sms.admin.in`
- `admin123@sms.admin.in`
- `a.b+test@sms.admin.in`

**Invalid Examples:**
- `admin@sms.edu.in` ❌ (wrong domain)
- `admin@gmail.com` ❌ (not admin domain)
- `admin sms@sms.admin.in` ❌ (space not allowed)

---

## Authentication Endpoints

### Base URL
```
http://localhost:8080/api/auth
```

---

### 1. Register Student

**Endpoint:** `POST /api/auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe.2024@sms.edu.in",
  "password": "SecurePassword123",
  "role": "STUDENT",
  "additionalId": "2024",
  "department": null
}
```

**Valid Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request) - Invalid Email:**
```json
{
  "token": null,
  "message": "Invalid Email format for role: STUDENT"
}
```

**Error Response (400 Bad Request) - Email Already Exists:**
```json
{
  "token": null,
  "message": "Email already exists!"
}
```

**Error Response (400 Bad Request) - Empty Fields:**
```json
{
  "token": null,
  "message": "Email cannot be empty"
}
```

**Test Cases:**
| Case | Email | Password | FirstName | LastName | Expected Status |
|------|-------|----------|-----------|----------|-----------------|
| Valid Student | john.doe.2024@sms.edu.in | Pass123! | John | Doe | 200 |
| Invalid Email Format | john.doe.24@sms.edu.in | Pass123! | John | Doe | 400 |
| Empty Email | (empty) | Pass123! | John | Doe | 400 |
| Empty Password | john.doe.2024@sms.edu.in | (empty) | John | Doe | 400 |
| Empty FirstName | john.doe.2024@sms.edu.in | Pass123! | (empty) | Doe | 400 |
| Duplicate Email | john.doe.2024@sms.edu.in | Pass123! | John | Doe | 400 |

---

### 2. Register Faculty

**Endpoint:** `POST /api/auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "James",
  "lastName": "Brown",
  "email": "james.brown.001@sms.edu.in",
  "password": "FacultyPass123",
  "role": "FACULTY",
  "additionalId": "001",
  "department": "Computer Science"
}
```

**Valid Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request) - Invalid Email:**
```json
{
  "token": null,
  "message": "Invalid Email format for role: FACULTY"
}
```

**Test Cases:**
| Case | Email | FacultyId | Department | Expected Status |
|------|-------|-----------|------------|-----------------|
| Valid Faculty | james.brown.001@sms.edu.in | 001 | CS | 200 |
| Invalid Email (4 digits) | james.brown.0012@sms.edu.in | 0012 | CS | 400 |
| Invalid Email (2 digits) | james.brown.01@sms.edu.in | 01 | CS | 400 |
| Missing Department | james.brown.001@sms.edu.in | 001 | (empty) | 200* |

---

### 3. Register Admin

**Endpoint:** `POST /api/auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin.user@sms.admin.in",
  "password": "AdminPass123",
  "role": "ADMIN",
  "additionalId": null,
  "department": null
}
```

**Valid Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Test Cases:**
| Case | Email | Format Validation |
|------|-------|-------------------|
| Valid Admin 1 | admin@sms.admin.in | ✅ |
| Valid Admin 2 | john.smith@sms.admin.in | ✅ |
| Valid Admin 3 | admin_user@sms.admin.in | ✅ |
| Invalid Domain | admin@sms.edu.in | ❌ 400 |
| Invalid Domain | admin@gmail.com | ❌ 400 |

---

### 4. Login

**Endpoint:** `POST /api/auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "john.doe.2024@sms.edu.in",
  "password": "SecurePassword123"
}
```

**Valid Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Successful"
}
```

**Error Response (401 Unauthorized) - Invalid Password:**
```json
{
  "token": null,
  "message": "Invalid password"
}
```

**Error Response (401 Unauthorized) - User Not Found:**
```json
{
  "token": null,
  "message": "User not found"
}
```

**Test Cases:**
| Case | Email | Password | Expected Status |
|------|-------|----------|-----------------|
| Valid Login | john.doe.2024@sms.edu.in | SecurePassword123 | 200 |
| Wrong Password | john.doe.2024@sms.edu.in | WrongPassword | 401 |
| Non-existent User | nonexistent@sms.edu.in | Pass123 | 401 |
| Empty Email | (empty) | Pass123 | 400 |
| Empty Password | john.doe.2024@sms.edu.in | (empty) | 400 |

---

## Class Management Endpoints

### Base URL
```
http://localhost:8080/api/classes
```

---

### 1. Create Class

**Endpoint:** `POST /api/classes`

**Authorization:** Bearer Token (ADMIN role required)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Request Body:**
```json
{
  "grade": "10",
  "section": "A",
  "year": 2024
}
```

**Valid Response (200 OK):**
```json
{
  "id": 1,
  "grade": "10",
  "section": "A",
  "year": 2024
}
```

**Error Response (400 Bad Request) - Null Grade:**
```json
null
```

**Error Response (400 Bad Request) - Duplicate Class:**
```json
null
```

**Test Cases:**
| Case | Grade | Section | Year | Expected Status |
|------|-------|---------|------|-----------------|
| Valid Class | 10 | A | 2024 | 200 |
| Null Grade | (null) | A | 2024 | 400 |
| Empty Section | 10 | (empty) | 2024 | 400 |
| Invalid Year (0) | 10 | A | 0 | 400 |
| Negative Year | 10 | A | -1 | 400 |
| Duplicate | 10 | A | 2024 | 400 |

---

### 2. Get All Classes

**Endpoint:** `GET /api/classes`

**Authorization:** Bearer Token (ADMIN or FACULTY)

**Headers:**
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Valid Response (200 OK):**
```json
[
  {
    "id": 1,
    "grade": "10",
    "section": "A",
    "year": 2024
  },
  {
    "id": 2,
    "grade": "10",
    "section": "B",
    "year": 2024
  }
]
```

---

### 3. Get Class by ID

**Endpoint:** `GET /api/classes/{id}`

**Authorization:** Bearer Token (ADMIN or FACULTY)

**Headers:**
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Path Parameters:**
```
id = 1
```

**Valid Response (200 OK):**
```json
{
  "id": 1,
  "grade": "10",
  "section": "A",
  "year": 2024
}
```

**Error Response (404 Not Found):**
```json
"Class not found with id: 999"
```

---

### 4. Assign Student to Class

**Endpoint:** `PUT /api/classes/{classId}/students/{studentId}`

**Authorization:** Bearer Token (ADMIN role required)

**Headers:**
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Path Parameters:**
```
classId = 1
studentId = 5
```

**Valid Response (200 OK):**
```json
"Student assigned to class successfully."
```

**Error Response (404 Not Found) - Class Not Found:**
```json
"Class not found with id: 999"
```

**Error Response (404 Not Found) - Student Not Found:**
```json
"Student not found with id: 999"
```

---

### 5. Assign Student to Class (Alternative Admin Endpoint)

**Endpoint:** `PUT /api/admin/assign/{studentId}/{classId}`

**Authorization:** Bearer Token (ADMIN role required)

**Headers:**
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Path Parameters:**
```
studentId = 5
classId = 1
```

**Valid Response (200 OK):**
```json
"Student assigned successfully"
```

---

## Subject Management Endpoints

### Base URL
```
http://localhost:8080/api/subjects
```

---

### 1. Create Subject

**Endpoint:** `POST /api/subjects`

**Authorization:** Bearer Token (ADMIN role required)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Request Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "classId": 1,
  "facultyId": 1
}
```

**Valid Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mathematics",
  "code": "MATH101",
  "classEntity": {
    "id": 1,
    "grade": "10",
    "section": "A",
    "year": 2024
  },
  "faculty": {
    "id": 1,
    "firstName": "James",
    "lastName": "Brown"
  }
}
```

**Error Response (400 Bad Request) - Null Name:**
```json
null
```

**Error Response (404 Not Found) - Class Not Found:**
```json
"Class not found"
```

**Error Response (404 Not Found) - Faculty Not Found:**
```json
"Faculty not found"
```

**Test Cases:**
| Case | Name | Code | ClassId | FacultyId | Expected Status |
|------|------|------|---------|-----------|-----------------|
| Valid Subject | Mathematics | MATH101 | 1 | 1 | 200 |
| Null Name | (null) | MATH101 | 1 | 1 | 400 |
| Empty Code | Physics | (empty) | 1 | 1 | 400 |
| Invalid ClassId (0) | Chemistry | CHEM101 | 0 | 1 | 400 |
| Invalid FacultyId (-1) | Biology | BIO101 | 1 | -1 | 400 |
| Non-existent Class | English | ENG101 | 999 | 1 | 404 |
| Non-existent Faculty | History | HIS101 | 1 | 999 | 404 |

---

### 2. Get All Subjects

**Endpoint:** `GET /api/subjects`

**Authorization:** Bearer Token (ADMIN or FACULTY)

**Headers:**
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Valid Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Mathematics",
    "code": "MATH101",
    "classEntity": {
      "id": 1,
      "grade": "10",
      "section": "A",
      "year": 2024
    },
    "faculty": {
      "id": 1,
      "firstName": "James",
      "lastName": "Brown"
    }
  }
]
```

---

### 3. Get Subject by ID ⭐ NEW ENDPOINT

**Endpoint:** `GET /api/subjects/{id}`

**Authorization:** Bearer Token (ADMIN or FACULTY)

**Headers:**
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Path Parameters:**
```
id = 1
```

**Valid Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mathematics",
  "code": "MATH101",
  "classEntity": {
    "id": 1,
    "grade": "10",
    "section": "A",
    "year": 2024
  },
  "faculty": {
    "id": 1,
    "firstName": "James",
    "lastName": "Brown"
  }
}
```

**Error Response (404 Not Found):**
```json
"Subject not found with id: 999"
```

---

## Attendance Endpoints

### Base URL
```
http://localhost:8080/api/attendance
```

---

### 1. Mark Attendance

**Endpoint:** `POST /api/attendance/mark`

**Authorization:** Bearer Token (FACULTY role required)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Request Body:**
```json
{
  "studentId": 5,
  "subjectId": 1,
  "date": "2024-12-23",
  "isPresent": true
}
```

**Valid Response (200 OK):**
```json
"Attendance marked successfully"
```

**Error Response (400 Bad Request) - Invalid StudentId:**
```json
"Student ID must be valid"
```

**Error Response (400 Bad Request) - Null Date:**
```json
"Date cannot be null"
```

**Error Response (400 Bad Request) - Duplicate Attendance:**
```json
"Attendance already marked for this date."
```

**Error Response (404 Not Found) - Student Not Found:**
```json
"Student not found"
```

**Test Cases:**
| Case | StudentId | SubjectId | Date | IsPresent | Expected Status |
|------|-----------|-----------|------|-----------|-----------------|
| Valid Mark | 5 | 1 | 2024-12-23 | true | 200 |
| Valid Mark (Absent) | 5 | 1 | 2024-12-22 | false | 200 |
| Null StudentId | (null) | 1 | 2024-12-23 | true | 400 |
| Zero StudentId | 0 | 1 | 2024-12-23 | true | 400 |
| Negative StudentId | -1 | 1 | 2024-12-23 | true | 400 |
| Invalid SubjectId | 5 | 0 | 2024-12-23 | true | 400 |
| Null Date | 5 | 1 | (null) | true | 400 |
| Duplicate Entry | 5 | 1 | 2024-12-23 | true | 400 |

---

### 2. Get Student Attendance

**Endpoint:** `GET /api/attendance/student/{studentId}`

**Authorization:** Bearer Token (ADMIN, FACULTY, or STUDENT)

**Headers:**
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

**Path Parameters:**
```
studentId = 5
```

**Valid Response (200 OK):**
```json
[
  {
    "id": 1,
    "student": {
      "id": 5,
      "firstName": "John",
      "lastName": "Doe"
    },
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101"
    },
    "date": "2024-12-23",
    "isPresent": true
  },
  {
    "id": 2,
    "student": {
      "id": 5,
      "firstName": "John",
      "lastName": "Doe"
    },
    "subject": {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101"
    },
    "date": "2024-12-22",
    "isPresent": false
  }
]
```

**Error Response (404 Not Found):**
```json
"Student not found"
```

---

## Postman Collection Structure

### Collection Organization
```
📁 SMS Core Service
├── 📁 Authentication
│   ├── Register Student
│   ├── Register Faculty
│   ├── Register Admin
│   └── Login
├── 📁 Classes
│   ├── Create Class
│   ├── Get All Classes
│   ├── Get Class by ID
│   └── Assign Student to Class
├── 📁 Subjects
│   ├── Create Subject
│   ├── Get All Subjects
│   └── Get Subject by ID ⭐
└── 📁 Attendance
    ├── Mark Attendance
    └── Get Student Attendance
```

---

## Postman Environment Setup

### Create Environment Variables

```json
{
  "name": "SMS Local Development",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:8080"
    },
    {
      "key": "student_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "faculty_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "admin_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "class_id",
      "value": "1",
      "type": "string"
    },
    {
      "key": "subject_id",
      "value": "1",
      "type": "string"
    },
    {
      "key": "student_id",
      "value": "5",
      "type": "string"
    },
    {
      "key": "faculty_id",
      "value": "1",
      "type": "string"
    }
  ]
}
```

---

## Test Scenarios

### Scenario 1: Complete Student Registration and Login Flow

**Steps:**
1. Register Student with valid email format
2. Login with registered credentials
3. Save token as `{{student_token}}`

**Requests:**
```
POST {{base_url}}/api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe.2024@sms.edu.in",
  "password": "SecurePassword123",
  "role": "STUDENT"
}

POST {{base_url}}/api/auth/login
Body: {
  "email": "john.doe.2024@sms.edu.in",
  "password": "SecurePassword123"
}
```

**Expected Results:**
- ✅ Register returns 200 with token
- ✅ Login returns 200 with token
- ✅ Tokens are valid JWTs

---

### Scenario 2: Complete Faculty Registration and Subject Creation

**Steps:**
1. Register Faculty with valid email format
2. Login to get faculty token
3. Create a Class (as admin)
4. Create Subject and assign to Faculty

**Requests:**
```
POST {{base_url}}/api/auth/register
Body: {
  "firstName": "James",
  "lastName": "Brown",
  "email": "james.brown.001@sms.edu.in",
  "password": "FacultyPass123",
  "role": "FACULTY",
  "department": "Computer Science"
}

POST {{base_url}}/api/classes
Headers: Authorization: Bearer {{admin_token}}
Body: {
  "grade": "10",
  "section": "A",
  "year": 2024
}

POST {{base_url}}/api/subjects
Headers: Authorization: Bearer {{admin_token}}
Body: {
  "name": "Mathematics",
  "code": "MATH101",
  "classId": 1,
  "facultyId": 1
}
```

---

### Scenario 3: Complete Attendance Flow

**Steps:**
1. Register student and faculty
2. Create class
3. Create subject
4. Assign student to class
5. Mark attendance
6. View attendance

**Requests:**
```
POST {{base_url}}/api/attendance/mark
Headers: Authorization: Bearer {{faculty_token}}
Body: {
  "studentId": 5,
  "subjectId": 1,
  "date": "2024-12-23",
  "isPresent": true
}

GET {{base_url}}/api/attendance/student/5
Headers: Authorization: Bearer {{student_token}}
```

---

### Scenario 4: Input Validation Testing

**Test All Invalid Inputs:**

1. **Empty Email Registration**
   ```
   POST {{base_url}}/api/auth/register
   Body: { "email": "", "password": "Pass123", ... }
   Expected: 400 Bad Request
   ```

2. **Invalid Student Email Format**
   ```
   POST {{base_url}}/api/auth/register
   Body: { "email": "john.doe.24@sms.edu.in", "role": "STUDENT", ... }
   Expected: 400 Bad Request (only 2 digits)
   ```

3. **Invalid Faculty Email Format**
   ```
   POST {{base_url}}/api/auth/register
   Body: { "email": "james.brown.0012@sms.edu.in", "role": "FACULTY", ... }
   Expected: 400 Bad Request (4 digits)
   ```

4. **Invalid Class Year**
   ```
   POST {{base_url}}/api/classes
   Body: { "grade": "10", "section": "A", "year": 0 }
   Expected: 400 Bad Request
   ```

5. **Invalid Attendance StudentId**
   ```
   POST {{base_url}}/api/attendance/mark
   Body: { "studentId": 0, "subjectId": 1, ... }
   Expected: 400 Bad Request
   ```

---

### Scenario 5: Error Handling Testing

**Test All Error Scenarios:**

1. **Duplicate Email Registration**
   ```
   POST {{base_url}}/api/auth/register
   Body: { "email": "john.doe.2024@sms.edu.in", ... }
   (Register twice with same email)
   Expected: 400 Bad Request "Email already exists!"
   ```

2. **Invalid Login Credentials**
   ```
   POST {{base_url}}/api/auth/login
   Body: { "email": "john.doe.2024@sms.edu.in", "password": "WrongPassword" }
   Expected: 401 Unauthorized "Invalid password"
   ```

3. **Resource Not Found - Class**
   ```
   GET {{base_url}}/api/classes/999
   Expected: 404 Not Found "Class not found with id: 999"
   ```

4. **Resource Not Found - Subject**
   ```
   GET {{base_url}}/api/subjects/999
   Expected: 404 Not Found "Subject not found with id: 999"
   ```

5. **Duplicate Attendance Entry**
   ```
   POST {{base_url}}/api/attendance/mark
   Body: { "studentId": 5, "subjectId": 1, "date": "2024-12-23", ... }
   (Mark attendance twice for same date)
   Expected: 400 Bad Request "Attendance already marked for this date."
   ```

---

## Email Validation Quick Reference

### Copy-Paste Ready Examples

**Students (4-digit roll numbers):**
```
alice.johnson.2024@sms.edu.in
bob.smith.2025@sms.edu.in
charlie.williams.2023@sms.edu.in
diana.brown.2026@sms.edu.in
evan.davis.2022@sms.edu.in
```

**Faculty (3-digit faculty IDs):**
```
james.wilson.001@sms.edu.in
susan.moore.002@sms.edu.in
robert.taylor.003@sms.edu.in
jennifer.anderson.004@sms.edu.in
michael.thomas.005@sms.edu.in
```

**Admins:**
```
admin@sms.admin.in
superadmin@sms.admin.in
john.admin@sms.admin.in
mary.admin@sms.admin.in
sys.admin@sms.admin.in
```

---

## Common Issues & Solutions

### Issue 1: "Email cannot be empty"
**Cause:** Validation added to prevent null/empty emails
**Solution:** Ensure email field is provided and not empty

### Issue 2: "Invalid Email format for role: STUDENT"
**Cause:** Email doesn't match regex pattern
**Solution:** Use format `firstname.lastname.4digits@sms.edu.in`

### Issue 3: "Email already exists!"
**Cause:** Trying to register with same email twice
**Solution:** Use a different email, or login instead of registering

### Issue 4: 401 Unauthorized
**Cause:** Missing or invalid JWT token
**Solution:** Get token from login endpoint and include in Authorization header

### Issue 5: "Student ID must be valid"
**Cause:** StudentId is null, zero, or negative
**Solution:** Use valid positive integer for student ID

### Issue 6: "Date cannot be null"
**Cause:** Date field is missing or null
**Solution:** Include date in format `YYYY-MM-DD`

---

## Headers Checklist

### For Public Endpoints (Auth)
```json
{
  "Content-Type": "application/json"
}
```

### For Protected Endpoints (Classes, Subjects, Attendance)
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

### For GET Requests
```json
{
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

---

## Response Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Invalid credentials, missing token |
| 403 | Forbidden | Insufficient permissions (wrong role) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server error |

---

## Authorization Levels

| Endpoint | ADMIN | FACULTY | STUDENT |
|----------|-------|---------|---------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| POST /classes | ✅ | ❌ | ❌ |
| GET /classes | ✅ | ✅ | ❌ |
| PUT /classes/.../students/... | ✅ | ❌ | ❌ |
| POST /subjects | ✅ | ❌ | ❌ |
| GET /subjects | ✅ | ✅ | ❌ |
| POST /attendance/mark | ❌ | ✅ | ❌ |
| GET /attendance/student/... | ✅ | ✅ | ✅* |

*STUDENT can only view their own attendance

---

## Quick Test Commands

### Using cURL (Alternative to Postman)

**Register Student:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.2024@sms.edu.in",
    "password": "SecurePassword123",
    "role": "STUDENT"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe.2024@sms.edu.in",
    "password": "SecurePassword123"
  }'
```

**Create Class (with token):**
```bash
curl -X POST http://localhost:8080/api/classes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "grade": "10",
    "section": "A",
    "year": 2024
  }'
```

---

## Notes
- All timestamps are in UTC
- JWT tokens expire (check token expiration claims)
- StudentId, ClassId, SubjectId are generated by the system
- Email validation is case-sensitive for special characters
- Passwords should be at least 8 characters (recommended)
