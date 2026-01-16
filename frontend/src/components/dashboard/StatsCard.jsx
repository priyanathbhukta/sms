import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './StatsCard.module.css';

const StatsCard = ({
    label,
    value,
    icon: Icon,
    variant = 'primary',
    trend,
    trendValue,
}) => {
    return (
        <div className={styles.statsCard}>
            <div className={`${styles.statsIcon} ${styles[variant]}`}>
                {Icon && <Icon size={24} />}
            </div>
            <div className={styles.statsContent}>
                <div className={styles.statsLabel}>{label}</div>
                <div className={styles.statsValue}>{value}</div>
                {trend && (
                    <div className={`${styles.statsTrend} ${styles[trend]}`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
