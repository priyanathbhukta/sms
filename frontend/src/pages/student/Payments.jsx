import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api/student.api';
import { adminApi } from '../../api/admin.api';
import { logger } from '../../utils/constants';
import { formatDate, formatCurrency } from '../../utils/helpers';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import {
    Loader2,
    CreditCard,
    CheckCircle,
    Clock,
    AlertCircle,
} from 'lucide-react';
import styles from '../../components/common/DataTable.module.css';
import formStyles from '../../components/common/Form.module.css';

const PaymentsPage = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        feesStructureId: '',
        amountPaid: '',
        paymentMethod: 'CARD',
    });

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [paymentsData, feesData] = await Promise.all([
                user?.id ? studentApi.getMyPayments(user.id) : Promise.resolve([]),
                adminApi.getFees(),
            ]);

            setPayments(Array.isArray(paymentsData) ? paymentsData : []);
            setFees(Array.isArray(feesData) ? feesData : []);
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

        if (!formData.feesStructureId || !formData.amountPaid) {
            setError('Please select fee and enter amount');
            return;
        }

        try {
            setProcessing(true);
            await studentApi.makePayment({
                studentId: user.id,
                feesStructureId: parseInt(formData.feesStructureId),
                amountPaid: parseFloat(formData.amountPaid),
                paymentMethod: formData.paymentMethod,
                paymentDate: new Date().toISOString().split('T')[0],
            });

            setShowModal(false);
            setFormData({ feesStructureId: '', amountPaid: '', paymentMethod: 'CARD' });
            setSuccess('Payment successful!');
            setTimeout(() => setSuccess(''), 3000);
            fetchData();
        } catch (err) {
            logger.error('Error making payment:', err);
            setError(err.response?.data?.message || 'Payment failed');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
                    Payments
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    View and make fee payments
                </p>
            </div>

            {success && (
                <div style={{
                    padding: 'var(--space-3)',
                    background: 'var(--success-50)',
                    color: 'var(--success-600)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                }}>
                    <CheckCircle size={16} />
                    {success}
                </div>
            )}

            <div className={styles.dataTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.tableTitle}>
                        <CreditCard size={20} style={{ display: 'inline', marginRight: '8px' }} />
                        Payment History
                    </div>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        <CreditCard size={18} />
                        Make Payment
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
                ) : payments.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fee Type</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>#{payment.id}</td>
                                    <td>{payment.feeType || 'Tuition'}</td>
                                    <td style={{ fontWeight: 'var(--font-semibold)', color: 'var(--success-600)' }}>
                                        {formatCurrency(payment.amountPaid)}
                                    </td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>{formatDate(payment.paymentDate)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.success}`}>
                                            <CheckCircle size={12} /> Paid
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <CreditCard size={48} />
                        <p>No payment history</p>
                    </div>
                )}
            </div>

            {/* Make Payment Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Make Payment"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="success" onClick={handleSubmit} loading={processing}>
                            <CreditCard size={16} /> Pay Now
                        </Button>
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
                        <label className={formStyles.label}>Select Fee</label>
                        <select name="feesStructureId" value={formData.feesStructureId} onChange={handleChange} className={formStyles.select}>
                            <option value="">Select fee type</option>
                            {fees.map(f => (
                                <option key={f.id} value={f.id}>{f.feeType} - {formatCurrency(f.amount)}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.row}>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Amount (₹)</label>
                            <input
                                type="number"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                className={formStyles.input}
                                placeholder="5000"
                                min="1"
                            />
                        </div>
                        <div className={formStyles.formGroup}>
                            <label className={formStyles.label}>Payment Method</label>
                            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={formStyles.select}>
                                <option value="CARD">Credit/Debit Card</option>
                                <option value="UPI">UPI</option>
                                <option value="NETBANKING">Net Banking</option>
                                <option value="CASH">Cash</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PaymentsPage;
