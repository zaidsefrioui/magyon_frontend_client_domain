import { Button, Form, Input, message, Card, Avatar, Dropdown, Upload, InputNumber } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeftOutlined, LogoutOutlined, UserOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import PaymentRequiredModal from '../components/PaymentRequiredModal';
import HeaderHome from '../components/admin/header/HeaderHome';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

const CreateStore = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const { t } = useTranslation();


    //payment modal
    const [paymentModalVisible, setPaymentModalVisible] = useState(false); // Modal görünürlüğü için state
    const [redirectPath, setRedirectPath] = useState(''); // Yönlendirme path'i için state
    const [modalMessage, setModalMessage] = useState(''); // Modal mesajı için state
    const [buttonText, setButtonText] = useState(''); // Buton metni için state

    const handleRedirect = (path) => {
        setPaymentModalVisible(false); // Modal'ı kapat
        navigate(path); // Yönlendirme yap
    };
    //en payment modal

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error(t('You can only upload JPG/PNG file!'));
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(t('Image must smaller than 2MB!'));
            return false;
        }
        return true;
    };

    const handleLogoUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadLoading(true);
            const response = await axios.post(
                `${API_URL}/api/stores/upload`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (response.data && response.data.path) {
                const newFile = {
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: `${API_URL}${response.data.path}`,
                    path: response.data.path
                };
                setLogoFile(newFile);
                onSuccess(response.data);
                message.success(t('Logo uploaded successfully'));
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            message.error(error.response?.data?.message || t('Failed to upload logo'));
            onError(error);
        } finally {
            setUploadLoading(false);
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const storeData = {
                ...values,
                logo_path: logoFile?.path || null,
                delivery_price: parseInt(values.delivery_price || 0)
            };

            const response = await axios.post(`${API_URL}/api/stores`, storeData);
            message.success(t('Store created successfully'));
            navigate('/store/list');
        } catch (error) {
            console.log(error.response?.status);
            if (error.response?.status === 402 && error.response?.data.message == t('No active subscription found or subscription not confirmed.')) {
                setModalMessage(t('You need to complete your payment to access this feature.'));
                setButtonText(t('Go to Payment'));
                setRedirectPath("/payment");
                setPaymentModalVisible(true);
            } else {

                console.error('Failed to create store:', error);
                message.error(error.response?.data?.message || 'Failed to create store');
            }
        } finally {
            setLoading(false);
        }
    };
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

    return (
        <div className="min-h-screen bg-gray-50">

            <HeaderHome />

            {/* Content */}
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
                            <h2 className="text-2xl font-bold m-0">{t('Create New Store')} </h2>
                        </div>
                    </div>

                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                delivery_price: 0
                            }}
                        >
                            <Form.Item
                                label={t('Store Logo')}
                                tooltip={t('Upload your store logo (optional). Only JPG/PNG files less than 2MB are allowed.')}
                            >
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    className="store-logo-uploader"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    customRequest={handleLogoUpload}
                                    maxCount={1}
                                >
                                    {logoFile ? (
                                        <img
                                            src={logoFile.url}
                                            alt="logo"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div>
                                            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>{t('Upload Logo')} </div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                name="name"
                                label={t('Store Name')}
                                rules={[{ required: true, message: t('Please input store name!') }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={t('Description')}
                                rules={[{ required: true, message: t('Please input description!') }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="whatsapp_number"
                                label={t('Whatsapp Number')}
                                rules={[{ required: false, message: t('Please input Whatsapp Number!') }]}
                            >
                                <Input />
                            </Form.Item>



                            <Form.Item
                                name="delivery_price"
                                label={t('Delivery Price')}
                                rules={[{ required: true, message: t('Please input Delivery Price!') }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} block>
                                    {t('Create Store')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
            <PaymentRequiredModal
                visible={paymentModalVisible}
                onRedirect={handleRedirect}
                message={modalMessage}
                buttonText={buttonText}
                redirectPath={redirectPath}
            />
        </div>
    );
};

export default CreateStore; 