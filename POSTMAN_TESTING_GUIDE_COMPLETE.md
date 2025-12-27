# SMS Core Service - Complete API Testing Guide

## Overview
Complete guide for testing all 65+ SMS application REST API endpoints with request/response examples.

**Base URL:** `http://localhost:8080`

---

## Table of Contents
1. [Authentication (2 endpoints)](#1-authentication)
2. [Class Management (4 endpoints)](#2-class-management)
3. [Course Management (6 endpoints)](#3-course-management)
4. [Exam Management (5 endpoints)](#4-exam-management)
5. [Result Management (5 endpoints)](#5-result-management)
6. [Fees Management (5 endpoints)](#6-fees-management)
7. [Payment Management (6 endpoints)](#7-payment-management)
8. [Admin Requests (6 endpoints)](#8-admin-requests)
9. [Announcements (6 endpoints)](#9-announcements)
10. [Events (5 endpoints)](#10-events)
11. [Event Participants (4 endpoints)](#11-event-participants)
12. [Books (8 endpoints)](#12-books)
13. [Library Issues (6 endpoints)](#13-library-issues)
14. [Attendance (2 endpoints)](#14-attendance)

---

## Email Format Rules

### Student Email
**Format:** `{firstName}.{lastName}.{4digits}@sms.edu.in`
**Example:** `john.doe.2024@sms.edu.in`

### Faculty Email  
**Format:** `{firstName}.{lastName}.{3digits}@sms.edu.in`
**Example:** `james.brown.001@sms.edu.in`

### Admin Email
**Format:** `{anyString}@sms.admin.in`
**Example:** `admin@sms.admin.in`

---

## 1. Authentication

### 1.1 Register User
**POST** `/api/auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Student Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe.2024@sms.edu.in",
  "password": "SecurePass123",
  "role": "STUDENT",
  "additionalId": "2024"
}
```

**Faculty Request:**
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

**Admin Request:**
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@sms.admin.in",
  "password": "AdminPass123",
  "role": "ADMIN"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

### 1.2 Login
**POST** `/api/auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request:**
```json
{
  "email": "john.doe.2024@sms.edu.in",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login Successful"
}
```

---

## 2. Class Management

**All requests require:** `Authorization: Bearer {token}`

### 2.1 Create Class
**POST** `/api/classes` (ADMIN only)

**Request:**
```json
{
  "gradeLevel": "10",
  "section": "A",
  "academicYear": 2024
}
```

### 2.2 Get All Classes
**GET** `/api/classes` (ADMIN, FACULTY)

### 2.3 Get Class by ID
**GET** `/api/classes/{id}` (ADMIN, FACULTY)

### 2.4 Assign Student to Class
**PUT** `/api/classes/{classId}/students/{studentId}` (ADMIN)

**Response:** `"Student assigned to class successfully."`

---

## 3. Course Management

### 3.1 Create Course
**POST** `/api/courses` (ADMIN)

**Request:**
```json
{
  "courseName": "Mathematics Advanced",
  "classId": 1,
  "facultyId": 2
}
```

**Response:**
```json
{
  "courseId": 1,
  "courseName": "Mathematics Advanced",
  "classEntity": {
    "id": 1,
    "gradeLevel": "10",
    "section": "A"
  },
  "faculty": {
    "id": 2,
    "firstName": "James",
    "lastName": "Brown"
  }
}
```

### 3.2 Get All Courses
**GET** `/api/courses` (ADMIN, FACULTY)

### 3.3 Get Courses by Class
**GET** `/api/courses/class/{classId}` (ALL)

### 3.4 Get Courses by Faculty
**GET** `/api/courses/faculty/{facultyId}` (ADMIN, FACULTY)

### 3.5 Get Course by ID
**GET** `/api/courses/{id}` (ALL)

### 3.6 Assign Faculty to Course
**PUT** `/api/courses/{courseId}/faculty/{facultyId}` (ADMIN)

---

## 4. Exam Management

### 4.1 Create Exam
**POST** `/api/exams` (ADMIN, FACULTY)

**Request:**
```json
{
  "courseId": 1,
  "examName": "Mid-Term Exam",
  "date": "2024-12-30",
  "totalMarks": 100
}
```

**Response:**
```json
{
  "examId": 1,
  "course": {
    "courseId": 1,
    "courseName": "Mathematics Advanced"
  },
  "examName": "Mid-Term Exam",
  "date": "2024-12-30",
  "totalMarks": 100
}
```

### 4.2 Get All Exams
**GET** `/api/exams` (ADMIN, FACULTY)

### 4.3 Get Exams by Course
**GET** `/api/exams/course/{courseId}` (ALL)

### 4.4 Get Exams by Class
**GET** `/api/exams/class/{classId}` (ALL)

### 4.5 Get Exam by ID
**GET** `/api/exams/{id}` (ALL)

---

## 5. Result Management

### 5.1 Create/Update Result
**POST** `/api/results` (ADMIN, FACULTY)

**Request:**
```json
{
  "examId": 1,
  "studentId": 5,
  "marksObtained": 85.5
}
```

**Response:**
```json
{
  "resultId": 1,
  "exam": {
    "examId": 1,
    "examName": "Mid-Term Exam"
  },
  "student": {
    "studentId": 5,
    "firstName": "John",
    "lastName": "Doe"
  },
  "marksObtained": 85.5,
  "isFinalized": false,
  "createdAt": "2024-12-26T13:00:00"
}
```

### 5.2 Get Results by Student
**GET** `/api/results/student/{studentId}` (ALL)

### 5.3 Get Results by Exam
**GET** `/api/results/exam/{examId}` (ADMIN, FACULTY)

### 5.4 Get Specific Result
**GET** `/api/results/exam/{examId}/student/{studentId}` (ALL)

### 5.5 Finalize Result
**PUT** `/api/results/{resultId}/finalize` (ADMIN)

**Response:** `"Result finalized successfully"`

---

## 6. Fees Management

### 6.1 Create Fee Structure
**POST** `/api/fees` (ADMIN)

**Request:**
```json
{
  "classId": 1,
  "amount": 50000.00,
  "feeType": "Tuition"
}
```

**Response:**
```json
{
  "feeId": 1,
  "classEntity": {
    "id": 1,
    "gradeLevel": "10",
    "section": "A"
  },
  "amount": 50000.00,
  "feeType": "Tuition"
}
```

### 6.2 Get All Fees
**GET** `/api/fees` (ADMIN, FACULTY)

### 6.3 Get Fees by Class
**GET** `/api/fees/class/{classId}` (ALL)

### 6.4 Get Fee by ID
**GET** `/api/fees/{id}` (ADMIN, FACULTY)

### 6.5 Delete Fee
**DELETE** `/api/fees/{id}` (ADMIN)

---

## 7. Payment Management

### 7.1 Create Payment
**POST** `/api/payments` (ADMIN, STUDENT)

**Request:**
```json
{
  "studentId": 5,
  "amountPaid": 50000.00,
  "razorpayPaymentId": "pay_abc123xyz",
  "razorpayOrderId": "order_def456uvw",
  "adminRequestId": null
}
```

**Response:**
```json
{
  "paymentId": 1,
  "student": {
    "studentId": 5,
    "firstName": "John"
  },
  "amountPaid": 50000.00,
  "razorpayPaymentId": "pay_abc123xyz",
  "razorpayOrderId": "order_def456uvw",
  "paymentStatus": "success",
  "paymentDate": "2024-12-26T13:00:00"
}
```

### 7.2 Update Payment Status
**PUT** `/api/payments/{paymentId}/status?status=success` (ADMIN)

### 7.3 Get Payments by Student
**GET** `/api/payments/student/{studentId}` (ADMIN, STUDENT)

### 7.4 Get Payments by Status
**GET** `/api/payments/status/{status}` (ADMIN)

### 7.5 Get Payment by ID
**GET** `/api/payments/{id}` (ADMIN, STUDENT)

### 7.6 Get Payment by Razorpay ID
**GET** `/api/payments/razorpay/{razorpayPaymentId}` (ADMIN)

---

## 8. Admin Requests

### 8.1 Create Admin Request
**POST** `/api/admin-requests` (STUDENT, FACULTY)

**Request:**
```json
{
  "requesterUserId": 5,
  "requestType": "Leave Request",
  "description": "Medical leave for 3 days",
  "previousDate": "2024-12-26T09:00:00",
  "newDate": "2024-12-29T09:00:00",
  "requestDocumentUrl": "https://example.com/documents/medical_cert.pdf"
}
```

**Response:**
```json
{
  "requestId": 1,
  "requesterUser": {
    "id": 5,
    "email": "john.doe.2024@sms.edu.in"
  },
  "requestType": "Leave Request",
  "description": "Medical leave for 3 days",
  "status": "pending",
  "createdAt": "2024-12-26T13:00:00"
}
```

### 8.2 Update Request Status
**PUT** `/api/admin-requests/{requestId}/status?status=approved&adminComments=Approved` (ADMIN)

### 8.3 Get All Requests
**GET** `/api/admin-requests` (ADMIN)

### 8.4 Get Requests by User
**GET** `/api/admin-requests/user/{userId}` (ALL)

### 8.5 Get Requests by Status
**GET** `/api/admin-requests/status/{status}` (ADMIN)

### 8.6 Get Request by ID
**GET** `/api/admin-requests/{id}` (ALL)

---

## 9. Announcements

### 9.1 Create Announcement
**POST** `/api/announcements` (ADMIN, FACULTY)

**General Announcement (all users):**
```json
{
  "title": "School Holiday Announcement",
  "content": "School will be closed on 26th December for Christmas celebrations.",
  "postByUserId": 1,
  "targetClassId": null
}
```

**Class-Specific Announcement:**
```json
{
  "title": "Mathematics Assignment",
  "content": "Submit your assignments by Friday, 29th December.",
  "postByUserId": 2,
  "targetClassId": 1
}
```

**Response:**
```json
{
  "announcementId": 1,
  "title": "School Holiday Announcement",
  "content": "School will be closed...",
  "postByUser": {
    "id": 1,
    "email": "admin@sms.admin.in"
  },
  "targetClass": null,
  "createdAt": "2024-12-26T13:00:00"
}
```

### 9.2 Get All Announcements
**GET** `/api/announcements` (ALL)

### 9.3 Get Announcements by Class
**GET** `/api/announcements/class/{classId}` (ALL)

### 9.4 Get General Announcements
**GET** `/api/announcements/general` (ALL)

### 9.5 Get Announcement by ID
**GET** `/api/announcements/{id}` (ALL)

### 9.6 Delete Announcement
**DELETE** `/api/announcements/{id}` (ADMIN, FACULTY)

---

## 10. Events

### 10.1 Create Event
**POST** `/api/events` (ADMIN, FACULTY)

**Request:**
```json
{
  "title": "Annual Sports Day",
  "eventDate": "2025-01-15",
  "description": "School-wide sports competition featuring various athletic events."
}
```

**Response:**
```json
{
  "eventId": 1,
  "title": "Annual Sports Day",
  "eventDate": "2025-01-15",
  "description": "School-wide sports competition..."
}
```

### 10.2 Get All Events
**GET** `/api/events` (ALL)

### 10.3 Get Upcoming Events
**GET** `/api/events/upcoming` (ALL)

### 10.4 Get Event by ID
**GET** `/api/events/{id}` (ALL)

### 10.5 Delete Event
**DELETE** `/api/events/{id}` (ADMIN)

---

## 11. Event Participants

### 11.1 Register Participant
**POST** `/api/event-participants` (ALL)

**Request:**
```json
{
  "eventId": 1,
  "userId": 5,
  "role": "participant"
}
```

**Roles:** `participant`, `organizer`, `volunteer`

**Response:**
```json
{
  "epId": 1,
  "event": {
    "eventId": 1,
    "title": "Annual Sports Day"
  },
  "user": {
    "id": 5,
    "email": "john.doe.2024@sms.edu.in"
  },
  "role": "participant"
}
```

### 11.2 Get Participants by Event
**GET** `/api/event-participants/event/{eventId}` (ADMIN, FACULTY)

### 11.3 Get Events by User
**GET** `/api/event-participants/user/{userId}` (ALL)

### 11.4 Remove Participant
**DELETE** `/api/event-participants/{id}` (ALL)

---

## 12. Books

### 12.1 Add Book
**POST** `/api/books` (ADMIN, FACULTY)

**Request:**
```json
{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "isbn": "978-0-06-112008-4",
  "totalCopies": 10
}
```

**Response:**
```json
{
  "bookId": 1,
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "isbn": "978-0-06-112008-4",
  "totalCopies": 10,
  "availableCopies": 10
}
```

### 12.2 Get All Books
**GET** `/api/books` (ALL)

### 12.3 Get Available Books
**GET** `/api/books/available` (ALL)

### 12.4 Search by Title
**GET** `/api/books/search/title?title=mockingbird` (ALL)

### 12.5 Search by Author
**GET** `/api/books/search/author?author=harper` (ALL)

### 12.6 Get Book by ID
**GET** `/api/books/{id}` (ALL)

### 12.7 Get Book by ISBN
**GET** `/api/books/isbn/{isbn}` (ADMIN, FACULTY)

### 12.8 Delete Book
**DELETE** `/api/books/{id}` (ADMIN)

---

## 13. Library Issues

### 13.1 Issue Book
**POST** `/api/library-issues/issue` (ADMIN, FACULTY)

**Request:**
```json
{
  "bookId": 1,
  "userId": 5
}
```

**Response:**
```json
{
  "issueId": 1,
  "book": {
    "bookId": 1,
    "title": "To Kill a Mockingbird",
    "availableCopies": 9
  },
  "user": {
    "id": 5,
    "email": "john.doe.2024@sms.edu.in"
  },
  "issueDate": "2024-12-26",
  "returnDate": null,
  "fineAmount": 0.00,
  "status": "issued"
}
```

### 13.2 Return Book
**PUT** `/api/library-issues/{issueId}/return?fineAmount=50.00` (ADMIN, FACULTY)

**Response:**
```json
{
  "issueId": 1,
  "book": {
    "bookId": 1,
    "availableCopies": 10
  },
  "returnDate": "2024-12-30",
  "fineAmount": 50.00,
  "status": "returned"
}
```

### 13.3 Get Issues by User
**GET** `/api/library-issues/user/{userId}` (ALL)

### 13.4 Get Issues by Book
**GET** `/api/library-issues/book/{bookId}` (ADMIN, FACULTY)

### 13.5 Get Overdue Issues
**GET** `/api/library-issues/overdue` (ADMIN, FACULTY)

### 13.6 Get Issue by ID
**GET** `/api/library-issues/{id}` (ALL)

---

## 14. Attendance

### 14.1 Mark Attendance
**POST** `/api/attendance/mark` (FACULTY)

**Request:**
```json
{
  "studentId": 5,
  "subjectId": 1,
  "date": "2024-12-26",
  "isPresent": true
}
```

**Response:** `"Attendance marked successfully"`

### 14.2 Get Student Attendance
**GET** `/api/attendance/student/{studentId}` (ALL)

**Response:**
```json
[
  {
    "id": 1,
    "student": {
      "id": 5,
      "firstName": "John"
    },
    "subject": {
      "id": 1,
      "name": "Mathematics"
    },
    "date": "2024-12-26",
    "isPresent": true
  }
]
```

---

## Authorization Headers

All authenticated endpoints require:
```json
{
  "Authorization": "Bearer {your_jwt_token}"
}
```

## Role-Based Access

- **ADMIN**: Full access to all endpoints
- **FACULTY**: Create exams, mark results, manage attendance, view most data
- **STUDENT**: View own data, register for events, make payments

---

## Testing Workflow

1. **Register** users (Admin, Faculty, Student)
2. **Login** to get JWT tokens
3. **Create** class structure
4. **Create** courses and assign faculty
5. **Create** exams and record results
6. **Manage** fees and payments
7. **Post** announcements and events
8. **Manage** library operations

---

## Common Status Codes

- **200 OK**: Success
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing/invalid token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found

---

**Total Endpoints Documented**: 65+
**Last Updated**: December 26, 2024
