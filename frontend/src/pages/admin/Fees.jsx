import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    CreditCard,
    Plus,
    Trash2,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const FEE_TYPES = ['TUITION', 'LIBRARY', 'LABORATORY', 'SPORTS', 'TRANSPORT', 'OTHER'];

const FeesPage = () => {
    const [fees, setFees] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        classId: '',
        amount: '',
        feeType: 'TUITION',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [feesData, classesData] = await Promise.all([
                adminApi.getFees(),
                adminApi.getClasses(),
            ]);

            setFees(Array.isArray(feesData) ? feesData : []);
            setClasses(Array.isArray(classesData) ? classesData : []);
        } catch (err) {
            logger.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.classId || !formData.amount) {
            setError('Class and amount are required');
            return;
        }

        try {
            setCreating(true);
            await adminApi.createFee({
                classId: parseInt(formData.classId),
                amount: parseFloat(formData.amount),
                feeType: formData.feeType,
            });
            setShowModal(false);
            setFormData({ classId: '', amount: '', feeType: 'TUITION' });
            fetchData();
        } catch (err) {
            logger.error('Error creating fee:', err);
            setError(err.response?.data?.message || 'Failed to create fee');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this fee structure?')) return;

        try {
            await adminApi.deleteFee(id);
            fetchData();
        } catch (err) {
            logger.error('Error deleting fee:', err);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Fee Structure Management
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Configure fees for different classes
                </p>
            </div>

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <CreditCard size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        All Fee Structures ({fees.length})
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <Plus size={18} />
                        Add Fee
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <Loader2 size={32} className="spin" />
                        <style>{`
              .spin { animation: spin 1s linear infinite; }
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
                    </div>
                ) : fees.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Class</th>
                                <th>Fee Type</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.map((fee) => (
                                <tr key={fee.id}>
                                    <td>#{fee.id}</td>
                                    <td>{fee.className || `Class #${fee.classId}`}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.primary}`}>
                                            {fee.feeType}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--success-600)' }}>
                                        {formatCurrency(fee.amount)}
                                    </td>
                                    <td>
                                        <button
                                            className={`${styles.actionBtn} ${styles.delete}`}
                                            title="Delete"
                                            onClick={() => handleDelete(fee.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <CreditCard size={48} />
                        <p>No fee structures defined</p>
                        <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: 'var(--space-4)' }}>
                            <Plus size={16} /> Create First Fee
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Fee Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create Fee Structure"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmit} loading={creating}>Create Fee</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: 'var(--space-3)',
                            background: 'var(--error-50)',
                            color: 'var(--error-600)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                        }}>
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>Class</label>
                        <select name="classId" value={formData.classId} onChange={handleChange} className={formStyles.select}>
                            <option value="">Select Class</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>Grade {c.gradeLevel} - {c.section}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Fee Type</label>
                            <select name="feeType" value={formData.feeType} onChange={handleChange} className={formStyles.select}>
                                {FEE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="5000"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FeesPage;
