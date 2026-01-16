import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, ROLE_LABELS, logger } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    CreditCard,
    ClipboardList,
    Library,
    BookCheck,
    Clock,
    UserCog,
    School,
    Layers,
} from 'lucide-react';
import styles from './Sidebar.module.css';

// Navigation items by role
const getNavItems = (role) => {
    const items = {
        [ROLES.ADMIN]: [
            {
                section: 'Dashboard', items: [
                    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
                ]
            },
            {
                section: 'Users', items: [
                    { path: '/admin/students', icon: Users, label: 'Students' },
                    { path: '/admin/faculty', icon: UserCog, label: 'Faculty' },
                    { path: '/admin/librarians', icon: Library, label: 'Librarians' },
                ]
            },
            {
                section: 'Academic', items: [
                    { path: '/admin/classes', icon: School, label: 'Classes' },
                    { path: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
                    { path: '/admin/courses', icon: Layers, label: 'Courses' },
                ]
            },
            {
                section: 'Management', items: [
                    { path: '/admin/fees', icon: CreditCard, label: 'Fee Structure' },
                    { path: '/admin/requests', icon: ClipboardList, label: 'Requests' },
                    { path: '/admin/announcements', icon: Bell, label: 'Announcements' },
                ]
            },
        ],
        [ROLES.FACULTY]: [
            {
                section: 'Dashboard', items: [
                    { path: '/faculty', icon: LayoutDashboard, label: 'Dashboard', exact: true },
                ]
            },
            {
                section: 'Academic', items: [
                    { path: '/faculty/classes', icon: School, label: 'My Classes' },
                    { path: '/faculty/students', icon: Users, label: 'My Students' },
                    { path: '/faculty/attendance', icon: ClipboardList, label: 'Attendance' },
                ]
            },
            {
                section: 'Exams', items: [
                    { path: '/faculty/exams', icon: FileText, label: 'Exams' },
                    { path: '/faculty/results', icon: BookCheck, label: 'Results' },
                ]
            },
            {
                section: 'Communication', items: [
                    { path: '/faculty/announcements', icon: Bell, label: 'Announcements' },
                    { path: '/faculty/events', icon: Calendar, label: 'Events' },
                ]
            },
        ],
        [ROLES.STUDENT]: [
            {
                section: 'Dashboard', items: [
                    { path: '/student', icon: LayoutDashboard, label: 'Dashboard', exact: true },
                ]
            },
            {
                section: 'Academic', items: [
                    { path: '/student/attendance', icon: ClipboardList, label: 'My Attendance' },
                    { path: '/student/results', icon: BookCheck, label: 'My Results' },
                ]
            },
            {
                section: 'Services', items: [
                    { path: '/student/payments', icon: CreditCard, label: 'Payments' },
                    { path: '/student/books', icon: BookOpen, label: 'Library' },
                    { path: '/student/requests', icon: FileText, label: 'My Requests' },
                ]
            },
            {
                section: 'Updates', items: [
                    { path: '/student/announcements', icon: Bell, label: 'Announcements' },
                    { path: '/student/events', icon: Calendar, label: 'Events' },
                ]
            },
            {
                section: 'Account', items: [
                    { path: '/student/profile', icon: Users, label: 'My Profile' },
                ]
            },
        ],
        [ROLES.LIBRARIAN]: [
            {
                section: 'Dashboard', items: [
                    { path: '/librarian', icon: LayoutDashboard, label: 'Dashboard', exact: true },
                ]
            },
            {
                section: 'Library', items: [
                    { path: '/librarian/books', icon: BookOpen, label: 'Books' },
                    { path: '/librarian/requests', icon: ClipboardList, label: 'Book Requests' },
                    { path: '/librarian/issues', icon: BookCheck, label: 'Issued Books' },
                    { path: '/librarian/overdue', icon: Clock, label: 'Overdue' },
                ]
            },
        ],
    };

    return items[role] || [];
};

const Sidebar = ({ collapsed = false, onToggle, mobileOpen = false, onMobileClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navSections = getNavItems(user?.role);

    const handleLogout = async () => {
        logger.log('User logging out');
        await logout();
        navigate('/login', { replace: true });
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`${styles.sidebarOverlay} ${mobileOpen ? styles.visible : ''}`}
                onClick={onMobileClose}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} ${mobileOpen ? styles.open : ''}`}>
                {/* Header */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarLogo}>
                        <GraduationCap size={24} />
                    </div>
                    <span className={styles.sidebarBrand}>SMS Portal</span>
                </div>

                {/* Navigation */}
                <nav className={styles.sidebarNav}>
                    {navSections.map((section) => (
                        <div className={styles.navSection} key={section.section}>
                            <div className={styles.navSectionTitle}>{section.section}</div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.exact}
                                    className={({ isActive }) =>
                                        `${styles.navItem} ${isActive ? styles.active : ''}`
                                    }
                                    onClick={onMobileClose}
                                >
                                    <item.icon className={styles.navItemIcon} size={20} />
                                    <span className={styles.navItemText}>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Footer - User Info */}
                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {getInitials(user?.firstName, user?.lastName)}
                        </div>
                        <div className={styles.userDetails}>
                            <div className={styles.userName}>
                                {user?.firstName} {user?.lastName}
                            </div>
                            <div className={styles.userRole}>
                                {ROLE_LABELS[user?.role] || user?.role}
                            </div>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
