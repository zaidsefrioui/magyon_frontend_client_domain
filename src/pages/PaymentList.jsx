import React, { useEffect, useState, useRef } from 'react';
import { PlusOutlined, LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space, Table, Tag, Modal, Form, Select, Tour } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import HeaderHome from '../components/admin/header/HeaderHome';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

const PaymentList = () => {
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [subscriptionTypes, setSubscriptionTypes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [totalAmount, setTotalAmount] = useState(0);
    const [userStores, setUserStores] = useState([]); // State to store user's stores
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Tour state and ref
    const [tourVisible, setTourVisible] = useState(false);
    const addPaymentButtonRef = useRef(null);

    const { t } = useTranslation();


    useEffect(() => {
        fetchPayments();
        fetchSubscriptionTypes();
        fetchUserStores(); // Fetch user's stores when component mounts

        // Check if the query parameter ?p=required exists
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('p') === 'required') {
            setTourVisible(true); // Start the tour
        }
    }, []);

    // Tour steps
    const steps = [
        {
            title: t('Add New Payment'),
            description: t('Click this button to add a new payment for your subscription.'),
            target: () => addPaymentButtonRef.current, // Target the "Add New Payment" button
        },
    ];

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/payments/getpayments`);
            setPayments(response.data.payments);
        } catch (error) {
            message.error('Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscriptionTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/payments/get_types`);
            setSubscriptionTypes(response.data.storeSubscriptionTypes);
        } catch (error) {
            message.error('Failed to fetch subscription types');
        }
    };

    const fetchUserStores = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores/not_active`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            const { ownedStores, invitedStores } = response.data;
            setUserStores([...ownedStores]); // Combine owned 
        } catch (error) {
            message.error('Failed to fetch user stores');
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setTotalAmount(0);
    };

    const calculateTotal = (month, typeId) => {
        const selectedType = subscriptionTypes.find((type) => type.id === typeId);
        if (selectedType) {
            const price = selectedType.sale_price || selectedType.price;
            setTotalAmount(month * price);
        } else {
            setTotalAmount(0);
        }
    };

    const handleSubmit = async (values) => {
        const { type_id, month } = values;
        try {
            const response = await axios.post(
                `${API_URL}/api/payments/add_payment/${type_id}`,
                { month },
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                }
            );
            const totalforpayment = totalAmount;
            window.location.href = `https://chari.pay.ma/0669697010/${totalforpayment}`;
            message.success(t('Payment added successfully'));
            fetchPayments();
            setIsModalVisible(false);
            form.resetFields();
            setTotalAmount(0);

        } catch (error) {
            message.error(t('Failed to add payment'));
        }
    };

    const columns = [
        {
            title: t('Subscription Type'),
            dataIndex: 'type',
            key: 'type',
            render: (type) => type.name,
        },
        {
            title: t('Started At'),
            dataIndex: 'started_at',
            key: 'started_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: t('Finished At'),
            dataIndex: 'finished_at',
            key: 'finished_at',
            render: (date) => (date ? new Date(date).toLocaleDateString() : '-'),
        },
        {
            title: t('Month'),
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: t('Total'),
            dataIndex: 'total',
            key: 'total',
            render: (total) => `${total} DH`,
        },
        {
            title: t('Status'),
            key: 'status',
            render: (_, record) => {
                if (record.rejected) {
                    return <Tag color="red">{t('Rejected')}</Tag>;
                } else if (record.confirmed) {
                    return <Tag color="green">{t('Approved')} </Tag>;
                } else {
                    return <Tag color="orange">{t('Payment is pending')}</Tag>;
                }
            },
        },
    ];

    const userMenuItems = [
        {
            key: 'logout',
            label: t('Logout'),
            icon: <LogoutOutlined />,
            onClick: () => {
                logout();
                navigate('/login');
            },
            danger: true,
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">{t('Loading...')} </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <HeaderHome />

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <div className="flex flex-col  mb-6 gap-3">
                    <div className="flex flex-col justify-between items-start gap-4">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/store/list')}
                        >
                            {t('Back to Stores')}
                        </Button>
                    </div>
                    {/* Add New Payment Button */}
                    {userStores.length > 0 && (
                        <div className="flex flex-col justify-between items-end gap-3">
                            <Button
                                ref={addPaymentButtonRef} // Add ref to the button
                                className="bg-green-700 text-white"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                            >
                                {t('Add New Payment')}
                            </Button>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-bold mb-5">{t('Payment List')} </h2>
                    <Table
                        columns={columns}
                        dataSource={payments}
                        scroll={{
                            x: true,
                            y: 480,
                        }}
                    />
                </div>
            </div>

            {/* Add New Payment Modal */}
            <Modal
                title={t('Add New Payment')}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item
                        label={t('Subscription Type')}
                        name="type_id"
                        rules={[{ required: true, message: t('Please select a subscription type!') }]}
                    >
                        <Select
                            placeholder={t('Select a subscription type')}
                            onChange={(value) => {
                                const month = form.getFieldValue('month');
                                if (month) {
                                    calculateTotal(month, value);
                                }
                            }}
                        >
                            {subscriptionTypes.map((type) => (
                                <Select.Option key={type.id} value={type.id}>
                                    {type.name + " (" + type.price +" DH)"}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t('Month')}
                        name="month"
                        rules={[{ required: true, message: t('Please select the month!') }]}
                    >
                        <Select
                            placeholder={t('Select the month')}
                            onChange={(value) => {
                                const typeId = form.getFieldValue('type_id');
                                if (typeId) {
                                    calculateTotal(value, typeId);
                                }
                            }}
                        >
                            {[...Array(12).keys()].map((month) => (
                                <Select.Option key={month + 1} value={month + 1}>
                                    {month + 1} {t('month')}
                                </Select.Option>
                            ))}
                            <Select.Option value={24}>24 {t('months')} </Select.Option>
                            <Select.Option value={48}>48 {t('months')}</Select.Option>
                        </Select>
                    </Form.Item>
                    <div style={{ marginBottom: 16 }} className="flex justify-between text-xl">
                        <strong>{t('Total Amount:')}</strong>
                        <b>{totalAmount} DH</b>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="bg-green-700 text-white">
                            {t('Add Payment')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Tour Component */}
            <Tour
                open={tourVisible}
                onClose={() => setTourVisible(false)}
                steps={steps}
            />
        </div>
    );
};

export default PaymentList;