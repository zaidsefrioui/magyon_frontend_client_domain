import React, { useEffect, useState } from 'react'
import HeaderHome from '../components/admin/header/HeaderHome'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, message, Space, Switch, Table, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';



const API_URL = import.meta.env.VITE_API_URL;

export const AdminPayments = () => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paginationSize, setPaginationSize] = useState(10);

    const navigate = useNavigate();

    const fetchRequests = async () => {

        try {

            setLoading(true);
            const response = await axios.get(`${API_URL}/api/superAdmin/getPaymentRequests`);
            setPayments(response.data);
            // console.log(response.data);

            setLoading(false);
        } catch (error) {


            message.error(error.response?.data.message);
            navigate("/store/list");
        }

    };



    useEffect(() => {

        fetchRequests();

    }, []);


    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (user) => user.name,
        },
        {
            title: 'Subscription Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => type.name,
        },
        {
            title: 'Started At',
            dataIndex: 'started_at',
            key: 'started_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Finished At',
            dataIndex: 'finished_at',
            key: 'finished_at',
            render: (date) => (date ? new Date(date).toLocaleDateString() : '-'),
        },
        {
            title: 'Month',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `${total} DH`,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                if (record.rejected) {
                    return <Tag color="red">Rejected</Tag>;
                } else if (record.confirmed) {
                    return <Tag color="green">Approved</Tag>;
                } else {
                    return <Tag color="orange">Payment is pending</Tag>;
                }
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                // if (record.rejected) {
                return (
                    <Space size="middle">
                        <Switch
                            checked={record.confirmed}
                            onChange={(checked) => handleStatusChange(checked, record)}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                        />
                    </Space>
                )

            },
        },
    ];

    const handleStatusChange = async (checked, record) => {
        try {
            // Optimistically update the UI
            const updatedPayments = payments.map(payment =>
                payment.id === record.id
                    ? {
                        ...payment,
                        confirmed: checked,
                        rejected: !checked // Assuming these are mutually exclusive
                    }
                    : payment
            );
            setPayments(updatedPayments);

            // Make the API call
            if (checked) {
                await updatePaymentActive(record.id);
            } else {
                await updatePaymentInactive(record.id);
            }

            // Optional: refetch to ensure sync with server
            fetchRequests();

            message.success('Payment Updated');
        } catch (error) {
            // Revert on error
            setPayments(payments);
            message.error(error.response?.data.message || 'Failed to update payment');
        }
    };

    const updatePaymentActive = async (id) => {
        await axios.put(`${API_URL}/api/superAdmin/updatePaymentActive/${id}`);
    };

    const updatePaymentInactive = async (id) => {
        await axios.put(`${API_URL}/api/superAdmin/updatePaymentInactive/${id}`);
    };


    
    

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">Loading...</div>
        </div>;
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <HeaderHome />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col justify-between items-start gap-4">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/store/list')}
                        >
                            Back to Stores
                        </Button>
                    </div>

                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-bold mb-5">Payment Requests List</h2>
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
        </div>
    )
}
