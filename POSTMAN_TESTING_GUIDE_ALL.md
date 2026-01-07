# Postman Testing Guide & Project Flow
**Total API Endpoints: 99**

This guide provides everything needed to test the SMS API in Postman. It includes correct email formats, authentication steps, and raw JSON bodies for all endpoints.

## 🛠️ How to Test in Postman

### Environment Setup:
1.  Create a new Postman Environment.
2.  Add a variable `baseUrl` with value `http://localhost:8080`.

### Authentication:
1.  Login first using the `/api/auth/login` endpoint.
2.  Copy the token from the response (e.g., `eyJhbGciOi...`).
3.  For all subsequent requests, go to the **Authorization** tab -> Select **Bearer Token** -> Paste the token.

> **Tip:** You can script this in Postman's "Tests" tab:
> ```javascript
> var jsonData = pm.response.json();
> pm.environment.set("jwt_token", jsonData.token);
> ```
> Then set Authorization to `{{jwt_token}}`.

### Email Restrictions:
The system enforces strict email formats. Use these patterns:
-   **Student:** `firstName.lastName.YYYY@sms.edu.in` (e.g., `john.doe.2024@sms.edu.in`)
-   **Faculty:** `firstName.lastName.XXX@sms.edu.in` (e.g., `jane.smith.101@sms.edu.in`)
-   **Librarian:** `firstName.lastName.ID@sms.edu.in` (e.g., `sarah.connor.555@sms.edu.in`)
-   **Admin:** `name@sms.admin.in` (e.g., `admin@sms.admin.in`)

---

## 1. Authentication & Onboarding

### Register User (Public)
**Method:** `POST`
**URL:** `{{baseUrl}}/api/auth/register`
**Body (JSON):**

**Student Registration**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe.2024@sms.edu.in",
  "password": "password123",
  "role": "STUDENT",
  "additionalId": "2024",
  "department": null
}
```

**Faculty Registration**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith.101@sms.edu.in",
  "password": "password123",
  "role": "FACULTY",
  "additionalId": "101",
  "department": "Science"
}
```

### Login (Public)
**Method:** `POST`
**URL:** `{{baseUrl}}/api/auth/login`
**Body (JSON):**
```json
{
  "email": "john.doe.2024@sms.edu.in",
  "password": "password123"
}
```

### Logout
**Method:** `POST`
**URL:** `{{baseUrl}}/api/auth/logout`
**Body:** None

---

## 2. Admin: System Setup & User Management
*Requires ADMIN Role Token*

### Librarian Management

#### Create Librarian
**Method:** `POST`
**URL:** `{{baseUrl}}/api/admin/librarians/create`
**Body (JSON):**
```json
{
  "firstName": "Sarah",
  "lastName": "Connor",
  "email": "sarah.connor.501@sms.edu.in",
  "password": "securePass123",
  "role": "LIBRARIAN",
  "additionalId": "501"
}
```

### User Management

#### Dashboard Stats
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin/users/dashboard`

#### List All Students
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin/users/students?page=0&size=10&sortBy=firstName`

#### Search Students
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin/users/students/search?name=John&page=0&size=10`

#### List All Faculty
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin/users/faculty?page=0&size=10&sortBy=firstName`

#### Search Faculty
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin/users/faculty/search?name=Jane&page=0&size=10`

#### List All Librarians
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin/users/librarians?page=0&size=10`

### Academic Structure Setup

#### Create Class
**Method:** `POST`
**URL:** `{{baseUrl}}/api/classes`
**Body (JSON):**
```json
{
  "gradeLevel": "10",
  "section": "A",
  "academicYear": 2024
}
```

#### Get All Classes
**Method:** `GET`
**URL:** `{{baseUrl}}/api/classes`

#### Get Class by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/classes/{id}`

#### Assign Student to Class
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/classes/{classId}/students/{studentId}`

#### Assign Student to Class (Alternative)
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/admin/assign/{studentId}/{classId}`

#### Create Subject
**Method:** `POST`
**URL:** `{{baseUrl}}/api/subjects`
**Body (JSON):**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "classId": 1,
  "facultyId": 1
}
```

#### Get All Subjects
**Method:** `GET`
**URL:** `{{baseUrl}}/api/subjects`

#### Get Subject by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/subjects/{id}`

#### Create Course
**Method:** `POST`
**URL:** `{{baseUrl}}/api/courses`
**Body (JSON):**
```json
{
  "courseName": "Algebra I",
  "classId": 1,
  "facultyId": 1
}
```

#### Get All Courses
**Method:** `GET`
**URL:** `{{baseUrl}}/api/courses`

#### Get Course by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/courses/{id}`

#### Get Courses by Class
**Method:** `GET`
**URL:** `{{baseUrl}}/api/courses/class/{classId}`

#### Get Courses by Faculty
**Method:** `GET`
**URL:** `{{baseUrl}}/api/courses/faculty/{facultyId}`

#### Assign Faculty to Course
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/courses/{courseId}/faculty/{facultyId}`

#### Create Fee Structure
**Method:** `POST`
**URL:** `{{baseUrl}}/api/fees`
**Body (JSON):**
```json
{
  "classId": 1,
  "amount": 5000.00,
  "feeType": "TUITION"
}
```

#### Get All Fees Structures
**Method:** `GET`
**URL:** `{{baseUrl}}/api/fees`

#### Get Fees Structure by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/fees/{id}`

#### Get Fees Structure by Class
**Method:** `GET`
**URL:** `{{baseUrl}}/api/fees/class/{classId}`

#### Delete Fees Structure
**Method:** `DELETE`
**URL:** `{{baseUrl}}/api/fees/{id}`

### Administrative Requests

#### View All Requests
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin-requests`

#### View Requests by Status
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin-requests/status/{status}`

#### View Request by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin-requests/{id}`

#### Update Request Status
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/admin-requests/{requestId}/status?status=APPROVED&adminComments=Approved`

---

## 3. Faculty: Academic Management
*Requires FACULTY Role Token*

### Dashboard

#### Get Stats
**Method:** `GET`
**URL:** `{{baseUrl}}/api/faculty/dashboard/stats`

#### Get My Classes
**Method:** `GET`
**URL:** `{{baseUrl}}/api/faculty/dashboard/my-classes`

#### Get My Students
**Method:** `GET`
**URL:** `{{baseUrl}}/api/faculty/dashboard/my-students?page=0&size=10`

#### Get Students in Class
**Method:** `GET`
**URL:** `{{baseUrl}}/api/faculty/dashboard/class/{classId}/students`

### Teaching Operations

#### Mark Attendance
**Method:** `POST`
**URL:** `{{baseUrl}}/api/attendance/mark`
**Body (JSON):**
```json
{
  "studentId": 1,
  "subjectId": 1,
  "date": "2024-01-15",
  "isPresent": true
}
```

#### View Student Attendance
**Method:** `GET`
**URL:** `{{baseUrl}}/api/attendance/student/{studentId}`

#### View Student Attendance (Subject wise)
**Method:** `GET`
**URL:** `{{baseUrl}}/api/attendance/student/{studentId}/subject/{subjectId}`

#### Create Exam
**Method:** `POST`
**URL:** `{{baseUrl}}/api/exams`
**Body (JSON):**
```json
{
  "courseId": 1,
  "examName": "Midterm Spring 2024",
  "date": "2024-03-10",
  "totalMarks": 100
}
```

#### Get All Exams
**Method:** `GET`
**URL:** `{{baseUrl}}/api/exams`

#### Get Exam by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/exams/{id}`

#### Get Exams by Course
**Method:** `GET`
**URL:** `{{baseUrl}}/api/exams/course/{courseId}`

#### Get Exams by Class
**Method:** `GET`
**URL:** `{{baseUrl}}/api/exams/class/{classId}`

#### Enter Result
**Method:** `POST`
**URL:** `{{baseUrl}}/api/results`
**Body (JSON):**
```json
{
  "examId": 1,
  "studentId": 1,
  "marksObtained": 85.5
}
```

#### Finalize Result
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/results/{resultId}/finalize`
*(Note: Requires ADMIN role by default in Controller logic)*

#### Get Results by Student
**Method:** `GET`
**URL:** `{{baseUrl}}/api/results/student/{studentId}`

#### Get Results by Exam
**Method:** `GET`
**URL:** `{{baseUrl}}/api/results/exam/{examId}`

#### Get Specific Result
**Method:** `GET`
**URL:** `{{baseUrl}}/api/results/exam/{examId}/student/{studentId}`

#### Post Announcement (Global)
**Method:** `POST`
**URL:** `{{baseUrl}}/api/announcements`
**Body (JSON):**
```json
{
  "title": "School Closure",
  "content": "School will be closed tomorrow due to heavy rain.",
  "postByUserId": 1,
  "targetClassId": null,
  "targetRole": null
}
```

#### Post Announcement (Targeted Role)
**Method:** `POST`
**URL:** `{{baseUrl}}/api/announcements`
**Body (JSON):**
```json
{
  "title": "Librarian Meeting",
  "content": "Monthly meeting for all library staff.",
  "postByUserId": 1,
  "targetClassId": null,
  "targetRole": "LIBRARIAN"
}
```

#### Post Announcement (Targeted Class)
**Method:** `POST`
**URL:** `{{baseUrl}}/api/announcements`
**Body (JSON):**
```json
{
  "title": "Assignment Due",
  "content": "Math assignment due on Friday.",
  "postByUserId": 1,
  "targetClassId": 1
}
```

#### Get All Announcements (Admin/Faculty)
**Method:** `GET`
**URL:** `{{baseUrl}}/api/announcements`

#### Get Announcement by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/announcements/{id}`

#### Get Announcements by Class
**Method:** `GET`
**URL:** `{{baseUrl}}/api/announcements/class/{classId}`

#### Get General Announcements (My Feed)
**Method:** `GET`
**URL:** `{{baseUrl}}/api/announcements/general`
*Returns Global announcements PLUS announcements targeted to your logged-in role.*

#### Delete Announcement
**Method:** `DELETE`
**URL:** `{{baseUrl}}/api/announcements/{id}`

#### Create Event
**Method:** `POST`
**URL:** `{{baseUrl}}/api/events`
**Body (JSON):**
```json
{
  "title": "Science Fair",
  "eventDate": "2024-04-20",
  "description": "Annual Science Fair opening."
}
```

#### Get All Events
**Method:** `GET`
**URL:** `{{baseUrl}}/api/events`

#### Get Upcoming Events
**Method:** `GET`
**URL:** `{{baseUrl}}/api/events/upcoming`

#### Get Event by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/events/{id}`

#### Delete Event
**Method:** `DELETE`
**URL:** `{{baseUrl}}/api/events/{id}`

### Administrative Requests

#### Submit Admin Request
**Method:** `POST`
**URL:** `{{baseUrl}}/api/admin-requests`
**Body (JSON):**
```json
{
  "requesterUserId": 2,
  "requestType": "LEAVE_APPLICATION",
  "description": "Requesting sick leave for 2 days.",
  "previousDate": "2024-02-01T09:00:00",
  "newDate": "2024-02-03T17:00:00"
}
```

#### View My Requests
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin-requests/user/{userId}`

---

## 4. Student: Learning & Participation
*Requires STUDENT Role Token*

### Requests

#### Submit Admin Request
**Method:** `POST`
**URL:** `{{baseUrl}}/api/admin-requests`
**Body (JSON):**
```json
{
  "requesterUserId": 1,
  "requestType": "LEAVE_APPLICATION",
  "description": "Sick leave for 2 days",
  "previousDate": null,
  "newDate": "2024-01-20T09:00:00",
  "requestDocumentUrl": "http://example.com/doc.pdf"
}
```

#### View My Requests
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin-requests/user/{userId}`

### Payments

#### Make Payment
**Method:** `POST`
**URL:** `{{baseUrl}}/api/payments`
**Body (JSON):**
```json
{
  "studentId": 1,
  "amountPaid": 5000.00,
  "razorpayPaymentId": "pay_Kj12345",
  "razorpayOrderId": "order_Abc123",
  "razorpaySignature": "sig_Ky890"
}
```

#### View My Payments
**Method:** `GET`
**URL:** `{{baseUrl}}/api/payments/student/{studentId}`

#### View Payment by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/payments/{id}`

### Events

#### Register for Event
**Method:** `POST`
**URL:** `{{baseUrl}}/api/event-participants`
**Body (JSON):**
```json
{
  "eventId": 1,
  "userId": 1,
  "role": "PARTICIPANT"
}
```

#### View My Events
**Method:** `GET`
**URL:** `{{baseUrl}}/api/event-participants/user/{userId}`

#### View Event Participants (Faculty/Admin)
**Method:** `GET`
**URL:** `{{baseUrl}}/api/event-participants/event/{eventId}`

#### Leave Event (Delete)
**Method:** `DELETE`
**URL:** `{{baseUrl}}/api/event-participants/{id}`

### Library

#### Request a Book
**Method:** `POST`
**URL:** `{{baseUrl}}/api/book-requests`
**Body (JSON):**
```json
{
  "studentId": 1,
  "bookId": 1,
  "remarks": "Academic reference"
}
```

#### View My Book Requests
**Method:** `GET`
**URL:** `{{baseUrl}}/api/book-requests/my-requests?page=0&size=10`

#### Cancel Book Request
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/book-requests/{id}/cancel`

---

## 5. Library: Librarian Operations
*Requires LIBRARIAN Role Token*

### Books

#### Add New Book
**Method:** `POST`
**URL:** `{{baseUrl}}/api/books`
**Body (JSON):**
```json
{
  "title": "Introduction to Physics",
  "author": "H.C. Verma",
  "isbn": "978-0123456789",
  "totalCopies": 20
}
```

#### List All Books
**Method:** `GET`
**URL:** `{{baseUrl}}/api/books`

#### Get Available Books
**Method:** `GET`
**URL:** `{{baseUrl}}/api/books/available`

#### Search Books by Title
**Method:** `GET`
**URL:** `{{baseUrl}}/api/books/search/title?title=Physics`

#### Search Books by Author
**Method:** `GET`
**URL:** `{{baseUrl}}/api/books/search/author?author=Verma`

#### Get Book by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/books/{id}`

#### Get Book by ISBN
**Method:** `GET`
**URL:** `{{baseUrl}}/api/books/isbn/{isbn}`

#### Delete Book
**Method:** `DELETE`
**URL:** `{{baseUrl}}/api/books/{id}`

### Circulation (Issues)

#### Issue Book
**Method:** `POST`
**URL:** `{{baseUrl}}/api/library-issues/issue`
**Body (JSON):**
*(Note: userId must belong to a STUDENT or FACULTY role. Due date is automatically set to 15 days.)*
```json
{
  "bookId": 1,
  "userId": 1
}
```

#### Return Book
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/library-issues/{issueId}/return?fineAmount=0`

#### Get Issues by User
**Method:** `GET`
**URL:** `{{baseUrl}}/api/library-issues/user/{userId}`

#### Get Issues by Book
**Method:** `GET`
**URL:** `{{baseUrl}}/api/library-issues/book/{bookId}`

#### Get Overdue Issues
**Method:** `GET`
**URL:** `{{baseUrl}}/api/library-issues/overdue`
*(Returns issues where current date is past the due date)*

#### Get Issue by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/library-issues/{id}`

### Request Management

#### Process Request (Approve/Reject)
**Method:** `PUT`
**URL:** `{{baseUrl}}/api/book-requests/process`
**Body (JSON):**
```json
{
  "requestId": 1,
  "action": "APPROVE",
  "remarks": "Approved for 14 days"
}
```

#### View Pending Requests
**Method:** `GET`
**URL:** `{{baseUrl}}/api/book-requests/pending`

#### View Requests by Student
**Method:** `GET`
**URL:** `{{baseUrl}}/api/book-requests/student/{studentId}`

#### View Requests by Status
**Method:** `GET`
**URL:** `{{baseUrl}}/api/book-requests/status/{status}`

#### View Request by ID
**Method:** `GET`
**URL:** `{{baseUrl}}/api/book-requests/{id}`

### Dashboard

#### Get Dashboard Stats
**Method:** `GET`
**URL:** `{{baseUrl}}/api/librarian/dashboard/stats`

#### Get Dashboard Pending Requests
**Method:** `GET`
**URL:** `{{baseUrl}}/api/librarian/dashboard/pending-requests`

#### Get Dashboard Overdue Issues
**Method:** `GET`
**URL:** `{{baseUrl}}/api/librarian/dashboard/overdue`

#### Get Dashboard Available Books
**Method:** `GET`
**URL:** `{{baseUrl}}/api/librarian/dashboard/available-books`

### Administrative Requests

#### Submit Admin Request
**Method:** `POST`
**URL:** `{{baseUrl}}/api/admin-requests`
**Body (JSON):**
```json
{
  "requesterUserId": 5,
  "requestType": "SYSTEM_MAINTENANCE",
  "description": "Requesting server downtime for library software update.",
  "newDate": "2024-02-10T10:00:00"
}
```

#### View My Requests
**Method:** `GET`
**URL:** `{{baseUrl}}/api/admin-requests/user/{userId}`
