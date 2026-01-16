import { useTheme } from '../../contexts/ThemeContext';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ title = 'Dashboard', onMenuClick }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <button className={styles.menuBtn} onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <h1 className={styles.pageTitle}>{title}</h1>
            </div>

            <div className={styles.headerRight}>
                {/* Search */}
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className={styles.searchInput}
                    />
                </div>

                {/* Notifications */}
                <button className={styles.headerBtn}>
                    <Bell size={20} />
                    <span className={styles.notificationBadge} />
                </button>

                {/* Theme Toggle */}
                <button className={styles.themeToggle} onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
