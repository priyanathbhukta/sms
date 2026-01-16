import { X } from 'lucide-react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children, footer, large = false }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={onClose} />
            <div className={`${styles.content} ${large ? styles.large : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
