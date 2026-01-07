# SMS Role Permissions & Access Control

> **Version**: 2.0 - Updated with RBAC refinements

---

## 📋 Roles Overview

| Role | Description | Authority Level |
|------|-------------|-----------------|
| **ADMIN** | System governance (NO library access) | Governance |
| **FACULTY** | Academic management | Academic |
| **LIBRARIAN** | Exclusive library control | Library |
| **STUDENT** | Self-service | Consumer |

---

## 👑 ADMIN Role

**Purpose**: System governance and oversight only.

### Exclusive Permissions
| Module | Operations |
|--------|------------|
| **User Management** | View/manage all students, faculty, librarians |
| **Class Management** | Create, delete classes |
| **Course Management** | Create, delete courses |
| **Fee Structure** | Create, delete fee structures |
| **Admin Requests** | Approve/reject requests |
| **System Reports** | View all reports |

### ❌ Removed Permissions
- ~~Issue/return books~~
- ~~Add/update/delete books~~
- ~~View library issue history~~
- ~~Manage library operations~~

---

## 👨‍🏫 FACULTY Role

**Purpose**: Academic management for assigned classes.

### Permissions
| Module | Operations |
|--------|------------|
| **My Classes** | View assigned class students only |
| **Exams** | Create, update for assigned classes |
| **Results** | Create, update for students |
| **Attendance** | Mark, view for assigned classes |
| **Announcements** | Create, view |
| **Books** | View/search only (read-only) |

### Dashboard
- `/api/faculty/dashboard/my-classes`
- `/api/faculty/dashboard/my-students`
- `/api/faculty/dashboard/stats`

---

## 📚 LIBRARIAN Role

**Purpose**: Exclusive library ownership.

### Exclusive Permissions
| Module | Operations |
|--------|------------|
| **Book Inventory** | Add, update, delete books |
| **Issue/Return** | Issue books, process returns |
| **Overdue Management** | Track overdue, manage fines |
| **Book Requests** | Approve/reject student requests |
| **Library Reports** | View all library stats |

### Dashboard
- `/api/librarian/dashboard/stats`
- `/api/librarian/dashboard/pending-requests`
- `/api/librarian/dashboard/overdue`

---

## 🎓 STUDENT Role

**Purpose**: Self-service academic access.

### Permissions
| Module | Operations |
|--------|------------|
| **Book Requests** | Request books (workflow-based) |
| **My Issues** | View own issued books |
| **Results** | View own results |
| **Attendance** | View own attendance |

### New Workflow
```
Student requests book → Librarian approves → Book issued
```

---

## 🔐 API Security Matrix

### Library Module

| Endpoint | ADMIN | FACULTY | LIBRARIAN | STUDENT |
|----------|:-----:|:-------:|:---------:|:-------:|
| `POST /api/books` | ❌ | ❌ | ✅ | ❌ |
| `DELETE /api/books/**` | ❌ | ❌ | ✅ | ❌ |
| `GET /api/books/**` | ❌ | ✅ | ✅ | ✅ |
| `POST /api/library-issues/issue` | ❌ | ❌ | ✅ | ❌ |
| `PUT /api/library-issues/*/return` | ❌ | ❌ | ✅ | ❌ |
| `POST /api/book-requests` | ❌ | ❌ | ❌ | ✅ |
| `PUT /api/book-requests/process` | ❌ | ❌ | ✅ | ❌ |

### Admin Module

| Endpoint | ADMIN | FACULTY | LIBRARIAN | STUDENT |
|----------|:-----:|:-------:|:---------:|:-------:|
| `/api/admin/users/**` | ✅ | ❌ | ❌ | ❌ |
| `/api/admin/users/dashboard` | ✅ | ❌ | ❌ | ❌ |

### Dashboard Endpoints

| Endpoint | ADMIN | FACULTY | LIBRARIAN | STUDENT |
|----------|:-----:|:-------:|:---------:|:-------:|
| `/api/admin/users/dashboard` | ✅ | ❌ | ❌ | ❌ |
| `/api/faculty/dashboard/**` | ❌ | ✅ | ❌ | ❌ |
| `/api/librarian/dashboard/**` | ❌ | ❌ | ✅ | ❌ |

---

## 🚀 Implemented Features

- [x] Swagger/OpenAPI Documentation
- [x] Pagination (PagedResponse)
- [x] Admin User Management Dashboard
- [x] Faculty Class-Based Access
- [x] Librarian Exclusive Library Control
- [x] Book Request Workflow
- [x] Role-Based Dashboards
