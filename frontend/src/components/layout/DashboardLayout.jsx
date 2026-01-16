import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ pageTitle }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className={styles.layout}>
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div className={`${styles.mainArea} ${sidebarCollapsed ? styles.collapsed : ''}`}>
                <Header
                    title={pageTitle}
                    onMenuClick={() => setMobileOpen(true)}
                />
                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
