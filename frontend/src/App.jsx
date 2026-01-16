import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import ChangePassword from './pages/auth/ChangePassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminFaculty from './pages/admin/Faculty';
import AdminLibrarians from './pages/admin/Librarians';
import AdminClasses from './pages/admin/Classes';
import AdminSubjects from './pages/admin/Subjects';
import AdminCourses from './pages/admin/Courses';
import AdminFees from './pages/admin/Fees';
import AdminRequests from './pages/admin/Requests';
import AdminAnnouncements from './pages/admin/Announcements';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyMyClasses from './pages/faculty/MyClasses';
import FacultyMyStudents from './pages/faculty/MyStudents';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultyExams from './pages/faculty/Exams';
import FacultyResults from './pages/faculty/Results';
import FacultyEvents from './pages/faculty/Events';
import FacultyProfile from './pages/faculty/Profile';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentMyAttendance from './pages/student/MyAttendance';
import StudentMyResults from './pages/student/MyResults';
import StudentPayments from './pages/student/Payments';
import StudentLibrary from './pages/student/Library';
import StudentMyRequests from './pages/student/MyRequests';
import StudentAnnouncements from './pages/student/Announcements';
import StudentEvents from './pages/student/Events';
import StudentProfile from './pages/student/Profile';

// Librarian Pages
import LibrarianDashboard from './pages/librarian/Dashboard';
import LibrarianBooks from './pages/librarian/Books';
import LibrarianBookRequests from './pages/librarian/BookRequests';
import LibrarianIssues from './pages/librarian/Issues';
import LibrarianOverdue from './pages/librarian/Overdue';
import LibrarianProfile from './pages/librarian/Profile';

import './styles/global.css';

// React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/change-password" element={<ChangePassword />} />

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route element={<DashboardLayout pageTitle="Admin Dashboard" />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/students" element={<AdminStudents />} />
                  <Route path="/admin/faculty" element={<AdminFaculty />} />
                  <Route path="/admin/librarians" element={<AdminLibrarians />} />
                  <Route path="/admin/classes" element={<AdminClasses />} />
                  <Route path="/admin/subjects" element={<AdminSubjects />} />
                  <Route path="/admin/courses" element={<AdminCourses />} />
                  <Route path="/admin/fees" element={<AdminFees />} />
                  <Route path="/admin/requests" element={<AdminRequests />} />
                  <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                </Route>
              </Route>

              {/* Faculty Routes */}
              <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
                <Route element={<DashboardLayout pageTitle="Faculty Dashboard" />}>
                  <Route path="/faculty" element={<FacultyDashboard />} />
                  <Route path="/faculty/classes" element={<FacultyMyClasses />} />
                  <Route path="/faculty/students" element={<FacultyMyStudents />} />
                  <Route path="/faculty/attendance" element={<FacultyAttendance />} />
                  <Route path="/faculty/exams" element={<FacultyExams />} />
                  <Route path="/faculty/results" element={<FacultyResults />} />
                  <Route path="/faculty/announcements" element={<AdminAnnouncements />} />
                  <Route path="/faculty/events" element={<FacultyEvents />} />
                  <Route path="/faculty/profile" element={<FacultyProfile />} />
                </Route>
              </Route>

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                <Route element={<DashboardLayout pageTitle="Student Portal" />}>
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/student/attendance" element={<StudentMyAttendance />} />
                  <Route path="/student/results" element={<StudentMyResults />} />
                  <Route path="/student/payments" element={<StudentPayments />} />
                  <Route path="/student/books" element={<StudentLibrary />} />
                  <Route path="/student/requests" element={<StudentMyRequests />} />
                  <Route path="/student/announcements" element={<StudentAnnouncements />} />
                  <Route path="/student/events" element={<StudentEvents />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                </Route>
              </Route>

              {/* Librarian Routes */}
              <Route element={<ProtectedRoute allowedRoles={['LIBRARIAN']} />}>
                <Route element={<DashboardLayout pageTitle="Library Management" />}>
                  <Route path="/librarian" element={<LibrarianDashboard />} />
                  <Route path="/librarian/books" element={<LibrarianBooks />} />
                  <Route path="/librarian/requests" element={<LibrarianBookRequests />} />
                  <Route path="/librarian/issues" element={<LibrarianIssues />} />
                  <Route path="/librarian/overdue" element={<LibrarianOverdue />} />
                  <Route path="/librarian/profile" element={<LibrarianProfile />} />
                </Route>
              </Route>

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* 404 */}
              <Route path="*" element={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100vh',
                  background: 'var(--bg-secondary)',
                }}>
                  <h1 style={{ fontSize: '4rem', color: 'var(--primary-500)' }}>404</h1>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                    Page not found
                  </p>
                  <a href="/login" style={{
                    padding: 'var(--space-2) var(--space-6)',
                    background: 'var(--primary-500)',
                    color: 'white',
                    borderRadius: 'var(--radius-lg)',
                  }}>
                    Go to Login
                  </a>
                </div>
              } />
            </Routes>
          </BrowserRouter>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-lg)',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
