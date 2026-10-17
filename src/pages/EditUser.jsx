import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, message, Modal, Select, Table, Popconfirm, Dropdown } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ArrowLeftOutlined, ShopOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import HeaderHome from '../components/admin/header/HeaderHome';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

const EditUser = () => {
    const [form] = Form.useForm();
    // const [userForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    // const [user, setUser] = useState(null);
    // const [isModalVisible, setIsModalVisible] = useState(false);
    // const [storeUsers, setStoreUsers] = useState([]);
    // const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();
    // const { id } = useParams();
    // const { auth, logout } = useAuth();

    const { t } = useTranslation();


    useEffect(() => {
        fetchUserData();
        // fetchStoreUsers();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users/getUser`);
            const user = response.data;
            console.log(response);

            // console("res status: ", response.status);
            form.setFieldsValue({
                email: user.email,
                name: user.name,
                phone_number: user.phone_number,
            });


        } catch (error) {
            if (error.response?.status === 404) {
                message.error(t('You are not authorized to edit this user'));
                navigate('/store/list');
            } else {
                message.error(t('Failed to fetch user data'));
            }
        }
    };




    const onFinish = async (values) => {
        try {
            setLoading(true);
            const userData = {
                name: values.name,
                phone_number: values.phone_number,
            };

            await axios.put(`${API_URL}/api/users/updateUser`, userData);
            message.success(t('Profile updated successfully'));
            navigate('/profile');
        } catch (error) {
            message.error(error.response?.data?.message || t('Failed to update profile'));
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50">

            <HeaderHome />

            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col justify-between items-start gap-4">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/store/list')}
                            >
                                {t('Back to Stores')}
                            </Button>
                            {/* <h2 className="text-2xl font-bold m-0">Profile</h2> */}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow mb-6 flex items-center gap-6">

                        <div>
                            <h1 className="text-2xl font-bold mb-2">{t('Edit Profile')} </h1>
                            <p className="text-gray-500">{t('Update your information')} </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow mb-6">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}


                        >
                            <Form.Item
                                name="email"
                                label={t('Email')}
                                rules={[{ required: false }]}
                            >
                                <Input readOnly />
                            </Form.Item>

                            <Form.Item
                                name="name"
                                label={t('User Name')}
                                rules={[{ required: true, message: t('Please input user name!') }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item
                                name="phone_number"
                                label={t('Phone Number')}
                                rules={[{
                                    required: false,
                                    min: 10,
                                    message: t('Please enter at least 10 digits for the phone number')
                                }]}
                            >
                                <Input />
                            </Form.Item>


                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {t('Update Profile')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>


                </div>
            </div>


        </div>
    );
};

export default EditUser; 