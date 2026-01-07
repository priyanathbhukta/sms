# SMS Core Service - Business Flow & Control Documentation

## System Overview

A comprehensive School Management System backend with JWT authentication, role-based access control, and modular architecture.

```mermaid
graph TB
    subgraph "Authentication"
        A[User] --> B["/api/auth/login"]
        A --> C["/api/auth/register"]
        B --> D[JWT Token]
        C --> D
    end

    subgraph "Role-Based Access"
        D --> E{Role?}
        E -->|ADMIN| F[Admin Dashboard]
        E -->|FACULTY| G[Faculty Dashboard]
        E -->|STUDENT| H[Student Portal]
        E -->|LIBRARIAN| I[Library System]
    end
```

---

## User Roles & Permissions

| Role | Primary Functions |
|------|-------------------|
| **ADMIN** | Manage all users, view stats, process requests, manage classes/subjects |
| **FACULTY** | View assigned classes, manage students, record attendance/results |
| **STUDENT** | View classes, request books, make payments, view announcements |
| **LIBRARIAN** | Manage books, process book requests, track issues |

---

## 1. Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant JWT
    participant DB

    Client->>AuthController: POST /api/auth/register
    AuthController->>AuthService: register(request)
    AuthService->>DB: Save User
    AuthService->>JWT: Generate Token
    JWT-->>Client: { token, message }

    Client->>AuthController: POST /api/auth/login
    AuthController->>AuthService: login(email, password)
    AuthService->>DB: Verify Credentials
    AuthService->>JWT: Generate Token
    JWT-->>Client: { token, "Login Successful" }

    Client->>AuthController: POST /api/auth/logout
    AuthController->>AuthService: logout(username)
    AuthService->>DB: Update lastLogout timestamp
    AuthService-->>Client: "Successfully logged out"
```

**Endpoints:**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get JWT |
| POST | `/api/auth/logout` | Authenticated | Invalidate token |

---

## 2. Admin Business Flows

### 2.1 User Management

```mermaid
flowchart LR
    Admin --> Users["/api/admin/users"]
    Users --> Dashboard["/dashboard - Stats"]
    Users --> Students["/students - List"]
    Users --> Faculty["/faculty - List"]
    Users --> Librarians["/librarians - List"]
```

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users/dashboard` | Get dashboard statistics |
| GET | `/api/admin/users/students` | Paginated student list |
| GET | `/api/admin/users/students/search` | Search students by name |
| GET | `/api/admin/users/faculty` | Paginated faculty list |
| GET | `/api/admin/users/faculty/search` | Search faculty by name |
| GET | `/api/admin/users/librarians` | Paginated librarian list |

### 2.2 Admin Request Handling

```mermaid
sequenceDiagram
    participant User as Student/Faculty/Librarian
    participant API
    participant Admin

    User->>API: POST /api/admin-requests (create request)
    API->>Admin: Notification
    Admin->>API: GET /api/admin-requests (view all)
    Admin->>API: PUT /api/admin-requests/{id}/status
    API-->>User: Status updated
```

---

## 3. Faculty Business Flows

### 3.1 Dashboard & Class Management

```mermaid
flowchart TB
    Faculty --> FD["/api/faculty/dashboard"]
    FD --> MyClasses["/my-classes"]
    FD --> MyStudents["/my-students"]
    FD --> Stats["/stats"]
    MyClasses --> ClassStudents["/class/{id}/students"]
```

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faculty/dashboard/my-classes` | Classes assigned to faculty |
| GET | `/api/faculty/dashboard/my-students` | All students in assigned classes |
| GET | `/api/faculty/dashboard/class/{id}/students` | Students in specific class |
| GET | `/api/faculty/dashboard/stats` | Faculty dashboard statistics |

### 3.2 Attendance & Results

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/attendance` | FACULTY - Record attendance |
| GET | `/api/attendance/student/{id}` | FACULTY/STUDENT - View attendance |
| POST | `/api/results` | FACULTY - Record results |
| GET | `/api/results/student/{id}` | STUDENT - View results |

---

## 4. Student Business Flows

### 4.1 Book Request Workflow

```mermaid
sequenceDiagram
    participant Student
    participant API
    participant Librarian

    Student->>API: POST /api/book-requests (create request)
    Note right of API: Status: PENDING
    API-->>Student: Request created

    Librarian->>API: GET /api/book-requests/pending
    Librarian->>API: PUT /api/book-requests/process
    Note right of API: Status: APPROVED/REJECTED

    alt Approved
        API->>API: Create LibraryIssue
        API-->>Student: Book issued
    else Rejected
        API-->>Student: Request rejected
    end

    Student->>API: PUT /api/book-requests/{id}/cancel
    Note right of API: Only if PENDING
```

**Book Request Endpoints:**
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/book-requests` | STUDENT | Create book request |
| GET | `/api/book-requests/my-requests` | STUDENT | View own requests |
| PUT | `/api/book-requests/{id}/cancel` | STUDENT | Cancel pending request |
| GET | `/api/book-requests/pending` | LIBRARIAN | View pending requests |
| PUT | `/api/book-requests/process` | LIBRARIAN | Approve/reject request |

### 4.2 Payment Flow

```mermaid
sequenceDiagram
    participant Student
    participant API
    participant Razorpay

    Student->>API: GET /api/fees-structure/class/{id}
    API-->>Student: Fee details

    Student->>API: POST /api/payments
    API->>Razorpay: Create order
    Razorpay-->>API: Order ID
    API-->>Student: Payment record

    Student->>Razorpay: Complete payment
    Razorpay->>API: Webhook (payment status)
    API->>API: Update payment status
```

---

## 5. Library Business Flows

### 5.1 Librarian Dashboard

```mermaid
flowchart TB
    Librarian --> LD["/api/librarian/dashboard"]
    LD --> Stats["/stats"]
    LD --> Pending["/pending-requests"]
    LD --> Overdue["/overdue"]
    LD --> Available["/available-books"]
```

### 5.2 Book Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Add new book (LIBRARIAN only) |
| GET | `/api/books` | List all books |
| GET | `/api/books/available` | Books with copies available |
| GET | `/api/books/search/title?title=` | Search by title |
| GET | `/api/books/search/author?author=` | Search by author |
| DELETE | `/api/books/{id}` | Delete book (LIBRARIAN only) |

### 5.3 Library Issue Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/library-issues` | Issue book to user |
| PUT | `/api/library-issues/{id}/return` | Mark book returned |
| GET | `/api/library-issues/overdue` | View overdue books |

---

## 6. Supporting Modules

### Classes & Subjects
| Endpoint | Description |
|----------|-------------|
| `/api/classes` | CRUD operations on classes |
| `/api/subjects` | CRUD operations on subjects |
| `/api/courses` | CRUD operations on courses |

### Events & Announcements
| Endpoint | Description |
|----------|-------------|
| `/api/events` | Create and manage school events |
| `/api/announcements` | Role-specific announcements |
| `/api/announcements/my` | View announcements for current role |

### Exams & Results
| Endpoint | Description |
|----------|-------------|
| `/api/exams` | Create and manage exams |
| `/api/results` | Record and view results |

---

## API Structure Summary

```
/api
├── /auth                 # Public: Login, Register, Logout
├── /admin
│   └── /users            # Admin: User management
├── /admin-requests       # All roles: Request to admin
├── /faculty/dashboard    # Faculty: Dashboard & classes
├── /librarian/dashboard  # Librarian: Library stats
├── /books                # All roles: Book catalog
├── /book-requests        # Student/Librarian: Book requests
├── /library-issues       # Librarian: Track issued books
├── /payments             # Admin/Student: Fee payments
├── /classes              # Admin/Faculty: Class management
├── /subjects             # Admin: Subject management
├── /courses              # Admin: Course management
├── /attendance           # Faculty/Student: Attendance
├── /results              # Faculty/Student: Exam results
├── /exams                # Admin/Faculty: Exam management
├── /events               # All: School events
├── /announcements        # All: Announcements
└── /fees-structure       # Admin: Fee configuration
```

---

## Test Data Summary

Pre-loaded test users (password: `Password@123`):

| Role | Email | Purpose |
|------|-------|---------|
| Admin | `admin@sms.edu.in` | Full system access |
| Faculty | `john.smith.F001@sms.edu.in` | Math teacher |
| Faculty | `jane.doe.F002@sms.edu.in` | English teacher |
| Student | `alice.johnson.S001@sms.edu.in` | Class 10-A |
| Student | `bob.wilson.S002@sms.edu.in` | Class 10-A |
| Librarian | `mary.lib.L001@sms.edu.in` | Library access |

---

## Quick Start Testing

1. **Start the app**: `.\mvnw.cmd spring-boot:run`
2. **Access Swagger**: `http://localhost:8080/swagger-ui.html`
3. **Login as Admin**: POST to `/api/auth/login` with admin credentials
4. **Use JWT**: Add `Authorization: Bearer <token>` header to requests
