# SMS Core Service - cURL Command Reference

Quick reference for testing endpoints using cURL (alternative to Postman)

---

## Table of Contents
1. [Setup](#setup)
2. [Authentication](#authentication)
3. [Classes](#classes)
4. [Subjects](#subjects)
5. [Attendance](#attendance)

---

## Setup

### Store Base URL and Tokens
```bash
# Set base URL
export BASE_URL="http://localhost:8080"

# After login, store tokens (replace with actual token)
export ADMIN_TOKEN="your_admin_jwt_token_here"
export FACULTY_TOKEN="your_faculty_jwt_token_here"
export STUDENT_TOKEN="your_student_jwt_token_here"
```

### Verify Application is Running
```bash
curl -X GET http://localhost:8080/actuator/health
```

---

## Authentication

### Register Student

**Valid Registration:**
```bash
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.2024@sms.edu.in",
    "password": "SecurePassword123",
    "role": "STUDENT",
    "additionalId": "2024"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

**Invalid Email (Too Few Digits):**
```bash
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.24@sms.edu.in",
    "password": "SecurePassword123",
    "role": "STUDENT"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "token": null,
  "message": "Invalid Email format for role: STUDENT"
}
```

**Empty Email Field:**
```bash
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "",
    "password": "SecurePassword123",
    "role": "STUDENT"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "token": null,
  "message": "Email cannot be empty"
}
```

---

### Register Faculty

**Valid Registration:**
```bash
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "James",
    "lastName": "Brown",
    "email": "james.brown.001@sms.edu.in",
    "password": "FacultyPass123",
    "role": "FACULTY",
    "additionalId": "001",
    "department": "Computer Science"
  }'
```

**Invalid Faculty Email (4 Digits):**
```bash
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "James",
    "lastName": "Brown",
    "email": "james.brown.0012@sms.edu.in",
    "password": "FacultyPass123",
    "role": "FACULTY",
    "department": "CS"
  }'
```

---

### Register Admin

**Valid Registration:**
```bash
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin.user@sms.admin.in",
    "password": "AdminPass123",
    "role": "ADMIN"
  }'
```

**Alternative Admin Emails:**
```bash
# Format 1
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@sms.admin.in", ...}'

# Format 2
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.smith@sms.admin.in", ...}'

# Format 3
curl -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin_user@sms.admin.in", ...}'
```

---

### Login

**Valid Login:**
```bash
curl -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe.2024@sms.edu.in",
    "password": "SecurePassword123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Successful"
}
```

**Invalid Password:**
```bash
curl -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe.2024@sms.edu.in",
    "password": "WrongPassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "token": null,
  "message": "Invalid password"
}
```

**Non-existent User:**
```bash
curl -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent.user.2024@sms.edu.in",
    "password": "SomePassword123"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "token": null,
  "message": "User not found"
}
```

---

## Classes

### Create Class

**Valid Class:**
```bash
curl -X POST "${BASE_URL}/api/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "grade": "10",
    "section": "A",
    "year": 2024
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "grade": "10",
  "section": "A",
  "year": 2024
}
```

**Invalid Year (Zero):**
```bash
curl -X POST "${BASE_URL}/api/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "grade": "10",
    "section": "A",
    "year": 0
  }'
```

**Null Grade:**
```bash
curl -X POST "${BASE_URL}/api/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "grade": null,
    "section": "A",
    "year": 2024
  }'
```

**Duplicate Class:**
```bash
# First request - succeeds
curl -X POST "${BASE_URL}/api/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{"grade": "10", "section": "A", "year": 2024}'

# Second request with same data - fails
curl -X POST "${BASE_URL}/api/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{"grade": "10", "section": "A", "year": 2024}'
```

**Expected Response (400 Bad Request):**
```json
null
```

---

### Get All Classes

**Request:**
```bash
curl -X GET "${BASE_URL}/api/classes" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response:**
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

### Get Class by ID

**Valid ID:**
```bash
curl -X GET "${BASE_URL}/api/classes/1" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response:**
```json
{
  "id": 1,
  "grade": "10",
  "section": "A",
  "year": 2024
}
```

**Non-existent ID:**
```bash
curl -X GET "${BASE_URL}/api/classes/999" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response (404 Not Found):**
```json
"Class not found with id: 999"
```

---

### Assign Student to Class

**Valid Assignment:**
```bash
curl -X PUT "${BASE_URL}/api/classes/1/students/5" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response:**
```json
"Student assigned to class successfully."
```

**Alternative Route:**
```bash
curl -X PUT "${BASE_URL}/api/admin/assign/5/1" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Non-existent Class:**
```bash
curl -X PUT "${BASE_URL}/api/classes/999/students/5" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response (404 Not Found):**
```json
"Class not found with id: 999"
```

---

## Subjects

### Create Subject

**Valid Subject:**
```bash
curl -X POST "${BASE_URL}/api/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "name": "Mathematics",
    "code": "MATH101",
    "classId": 1,
    "facultyId": 1
  }'
```

**Expected Response:**
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

**Null Name:**
```bash
curl -X POST "${BASE_URL}/api/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "name": null,
    "code": "MATH101",
    "classId": 1,
    "facultyId": 1
  }'
```

**Empty Code:**
```bash
curl -X POST "${BASE_URL}/api/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "name": "Mathematics",
    "code": "",
    "classId": 1,
    "facultyId": 1
  }'
```

**Invalid ClassId (Zero):**
```bash
curl -X POST "${BASE_URL}/api/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "name": "Mathematics",
    "code": "MATH101",
    "classId": 0,
    "facultyId": 1
  }'
```

**Non-existent Class:**
```bash
curl -X POST "${BASE_URL}/api/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -d '{
    "name": "Mathematics",
    "code": "MATH101",
    "classId": 999,
    "facultyId": 1
  }'
```

**Expected Response (404 Not Found):**
```json
"Class not found"
```

---

### Get All Subjects

**Request:**
```bash
curl -X GET "${BASE_URL}/api/subjects" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Mathematics",
    "code": "MATH101",
    "classEntity": {...},
    "faculty": {...}
  }
]
```

---

### Get Subject by ID (NEW ENDPOINT)

**Valid ID:**
```bash
curl -X GET "${BASE_URL}/api/subjects/1" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response:**
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

**Non-existent ID:**
```bash
curl -X GET "${BASE_URL}/api/subjects/999" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response (404 Not Found):**
```json
"Subject not found with id: 999"
```

---

## Attendance

### Mark Attendance

**Valid Mark (Present):**
```bash
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 5,
    "subjectId": 1,
    "date": "2024-12-23",
    "isPresent": true
  }'
```

**Expected Response:**
```json
"Attendance marked successfully"
```

**Valid Mark (Absent):**
```bash
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 5,
    "subjectId": 1,
    "date": "2024-12-22",
    "isPresent": false
  }'
```

**Invalid StudentId (Zero):**
```bash
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 0,
    "subjectId": 1,
    "date": "2024-12-23",
    "isPresent": true
  }'
```

**Expected Response (400 Bad Request):**
```json
"Student ID must be valid"
```

**Invalid SubjectId (Negative):**
```bash
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 5,
    "subjectId": -1,
    "date": "2024-12-23",
    "isPresent": true
  }'
```

**Null Date:**
```bash
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 5,
    "subjectId": 1,
    "date": null,
    "isPresent": true
  }'
```

**Expected Response (400 Bad Request):**
```json
"Date cannot be null"
```

**Duplicate Entry:**
```bash
# First mark - succeeds
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 5,
    "subjectId": 1,
    "date": "2024-12-23",
    "isPresent": true
  }'

# Second mark with same data - fails
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 5,
    "subjectId": 1,
    "date": "2024-12-23",
    "isPresent": true
  }'
```

**Expected Response (400 Bad Request):**
```json
"Attendance already marked for this date."
```

**Non-existent Student:**
```bash
curl -X POST "${BASE_URL}/api/attendance/mark" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}" \
  -d '{
    "studentId": 999,
    "subjectId": 1,
    "date": "2024-12-23",
    "isPresent": true
  }'
```

**Expected Response (404 Not Found):**
```json
"Student not found"
```

---

### Get Student Attendance

**Request:**
```bash
curl -X GET "${BASE_URL}/api/attendance/student/5" \
  -H "Authorization: Bearer ${STUDENT_TOKEN}"
```

**Expected Response:**
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

**Faculty Access:**
```bash
curl -X GET "${BASE_URL}/api/attendance/student/5" \
  -H "Authorization: Bearer ${FACULTY_TOKEN}"
```

**Admin Access:**
```bash
curl -X GET "${BASE_URL}/api/attendance/student/5" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Non-existent Student:**
```bash
curl -X GET "${BASE_URL}/api/attendance/student/999" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Expected Response (404 Not Found):**
```json
"Student not found"
```

---

## Authorization Testing

### Student Cannot Create Classes
```bash
curl -X POST "${BASE_URL}/api/classes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${STUDENT_TOKEN}" \
  -d '{"grade": "10", "section": "A", "year": 2024}'
```

**Expected Response (403 Forbidden):**
Access Denied

---

### Missing Authorization Header
```bash
curl -X GET "${BASE_URL}/api/classes"
```

**Expected Response (401 Unauthorized):**
Unauthorized

---

### Invalid Token
```bash
curl -X GET "${BASE_URL}/api/classes" \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response (401 Unauthorized):**
Unauthorized

---

## Useful cURL Options

### Pretty Print JSON Response
```bash
# Add | json_pp or | python -m json.tool
curl -X GET "${BASE_URL}/api/classes/1" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" | json_pp
```

### Save Response to File
```bash
curl -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe.2024@sms.edu.in", "password": "SecurePassword123"}' \
  -o login_response.json
```

### Include Response Headers
```bash
curl -X GET "${BASE_URL}/api/classes" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -i
```

### Verbose Output
```bash
curl -X GET "${BASE_URL}/api/classes" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -v
```

### Set Timeout
```bash
curl -X GET "${BASE_URL}/api/classes" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  --max-time 10
```

---

## Quick Test Script

```bash
#!/bin/bash

# Save as test.sh and run with: bash test.sh

BASE_URL="http://localhost:8080"

echo "=== Testing SMS API ==="

# Register Student
echo "1. Registering Student..."
STUDENT_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe.2024@sms.edu.in",
    "password": "SecurePassword123",
    "role": "STUDENT"
  }')
echo $STUDENT_RESPONSE | python -m json.tool
STUDENT_TOKEN=$(echo $STUDENT_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Login
echo -e "\n2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe.2024@sms.edu.in",
    "password": "SecurePassword123"
  }')
echo $LOGIN_RESPONSE | python -m json.tool

# Get Classes
echo -e "\n3. Getting Classes (will fail without admin token)..."
curl -s -X GET "${BASE_URL}/api/classes" | python -m json.tool

echo -e "\n=== Tests Complete ==="
```

---

## Notes
- Replace `${BASE_URL}`, `${ADMIN_TOKEN}`, etc. with actual values
- JSON payloads must be properly formatted
- Always include Content-Type header for POST/PUT requests
- Include Authorization header for protected endpoints
- Check HTTP status codes in responses
- Pretty-print JSON for better readability
