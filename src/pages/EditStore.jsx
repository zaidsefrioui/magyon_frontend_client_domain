import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, message, Modal, Select, Table, Popconfirm, Dropdown, Switch, ColorPicker, Space, Avatar } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ArrowLeftOutlined, ShopOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';
import HeaderHome from '../components/admin/header/HeaderHome';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

const EditStore = () => {
    const [form] = Form.useForm();
    const [deliveryForm] = Form.useForm();
    const [userForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingDelivery, setLoadingDelivery] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [storeUsers, setStoreUsers] = useState([]);
    const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { auth, logout } = useAuth();

    const chariPaymentActive = Form.useWatch("chari_payment_active", form);


    const { t } = useTranslation();


    const [deliveryCompanies, setDeliveryCompanies] = useState([]);
    const [selectedDeliveryCompany, setSelectedDeliveryCompany] = useState(null);


    useEffect(() => {
        fetchStoreData();
        fetchStoreUsers();
    }, [id]);

    useEffect(() => {
        fetchDeliveryCompanies();
    }, []);

    useEffect(() => {
        if (selectedDeliveryCompany > 1) {
            fetchDeliveryInformations();
        }
    }, [selectedDeliveryCompany]);

    const fetchDeliveryInformations = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores/delivery/getDeliveryInformations/${id}/${selectedDeliveryCompany}`);
            console.log(response);
            if (response.data && selectedDeliveryCompany == 2) {
                deliveryForm.setFieldsValue({
                    emailCathedis: response.data.username,
                    passwordCathedis: response.data.password,
                    allow_opening_package: response.data.allow_opening_package,

                });
            }
            if (response.data && selectedDeliveryCompany == 3) {
                deliveryForm.setFieldsValue({
                    idOzonExpress: response.data.userId,
                    apiKeyOzonExpress: response.data.apiKey,
                    allow_opening_package: response.data.allow_opening_package,

                });
            }
            if (response.data && selectedDeliveryCompany == 4) {
                deliveryForm.setFieldsValue({
                    idAmeex: response.data.userId,
                    apiKeyAmeex: response.data.apiKey,
                    allow_opening_package: response.data.allow_opening_package,
                    allow_trying_products: response.data.allow_trying_products,

                });
            }

        }
        catch (error) {
            console.log(error);
            // message.error('You are not authorized to edit this store');
            // navigate('/store/list');
        }

    }

    const fetchStoreData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores/${id}`);
            // console.log(response.data);
            setInitialData(response.data);
            setImageUrl(response.data.logo_path);
            form.setFieldsValue({
                name: response.data.name,
                description: response.data.description,
                animate_marquee: response.data.animate_marquee,
                google_analytics: response.data.google_analytics,
                meta_pixel_id: response.data.meta_pixel_id,
                tiktok_pixel_id: response.data.tiktok_pixel_id,
                whatsapp_number: response.data.whatsapp_number,
                delivery_price: response.data.delivery_price,
                free_delivery_from: response.data.free_delivery_from,
                chari_payment_active: response.data.chari_payment_active,
                chari_payment_number: response.data.chari_payment_number ,
                chari_payment_discount: response.data.chari_payment_discount ,
                color_1: response.data.color_1,
                color_2: response.data.color_2,
            });
            deliveryForm.setFieldsValue({
                delivery_company: response.data.delivery_company_id || 1,
            });
            setSelectedDeliveryCompany(response.data.delivery_company_id || 1);
        } catch (error) {
            if (error.response?.status === 404) {
                message.error(t('You are not authorized to edit this store'));
                navigate('/store/list');
            } else {
                message.error('Failed to fetch store data');
            }
        }
    };

    const fetchStoreUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores/${id}/users`);
            setStoreUsers(response.data);
        } catch (error) {
            message.error('Failed to fetch store users');
        }
    };

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

    const customUpload = async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_URL}/api/stores/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setImageUrl(response.data.path);
            onSuccess(response.data);
        } catch (error) {
            onError(error);
        }
    };

    const fetchDeliveryCompanies = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores/delivery/companies`);
            // console.log(response);

            setDeliveryCompanies(response?.data?.map(company => ({
                label: company.name,
                value: company.id,
                logo_path: company.logo_path,
            })));

        } catch (error) {
            console.error('Failed to fetch Delivery Companies:', error);
        }
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const storeData = {
                name: values.name,
                description: values.description,
                animate_marquee: values.animate_marquee,
                google_analytics: values.google_analytics,
                meta_pixel_id: values.meta_pixel_id,
                tiktok_pixel_id: values.tiktok_pixel_id,
                whatsapp_number: values.whatsapp_number,
                delivery_price: values.delivery_price,
                free_delivery_from: values.free_delivery_from,
                chari_payment_active: values.chari_payment_active,
                chari_payment_number: values.chari_payment_number,
                chari_payment_discount: values.chari_payment_discount,
                logo_path: imageUrl,
                color_1: values.color_1,
                color_2: values.color_2,
            };

            await axios.put(`${API_URL}/api/stores/${id}`, storeData);
            message.success(t('Store updated successfully'));
            navigate('/store/list');
        } catch (error) {
            message.error(error.response?.data?.message || t('Failed to update store'));
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (values) => {
        try {
            await axios.post(`${API_URL}/api/stores/${id}/users`, values);
            message.success(t('User added successfully'));
            setIsModalVisible(false);
            userForm.resetFields();
            fetchStoreUsers();
        } catch (error) {
            message.error(error.response?.data?.message || t('Failed to add user'));
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`${API_URL}/api/stores/${id}/users/${userId}`);
            if (response.status === 200) {
                message.success(t('User removed successfully'));
                setStoreUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || t('Failed to remove user');
            message.error(errorMessage);

            if (error.response?.status === 400) {
                message.warning(t('Store owner cannot be removed'));
            }
        }
    };

    const handleUpdateUserPermissions = async (userId, permissions) => {
        try {
            await axios.put(`${API_URL}/api/stores/${id}/users/${userId}`, permissions);
            message.success(t('User permissions updated successfully'));
            fetchStoreUsers();
        } catch (error) {
            message.error(t('Failed to update user permissions'));
        }
    };

    const columns = [
        {
            title: t('Email'),
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: t('Name'),
            dataIndex: ['user', 'name'],
            key: 'name',
        },
        {
            title: t('Permissions'),
            key: 'permissions',
            render: (_, record) => (
                <div>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder={t('Select permission')}
                        defaultValue={[
                            record.permission_stock_seller && 'stock_seller',
                            record.permission_stock_edit && 'stock_manger',
                            record.permission_ecommerce && 'ecommerce_manger',
                            record.permission_statistics && 'statistics_manager',
                        ].filter(Boolean)}
                        onChange={(values) => handleUpdateUserPermissions(record.user_id, {
                            permission_stock_seller: values.includes('stock_seller'),
                            permission_stock_edit: values.includes('stock_manger'),
                            permission_ecommerce: values.includes('ecommerce_manger'),
                            permission_statistics: values.includes('statistics_manager'),
                        })}
                        options={[
                            { label: t('Stock Seller'), value: 'stock_seller' },
                            { label: t('Stock Manager'), value: 'stock_manger' },
                            { label: t('Ecommerce Manager'), value: 'ecommerce_manger' },
                            { label: t('Statistics Manager'), value: 'statistics_manager' },
                        ]}
                        disabled={record.user_id === initialData.owner_user_id}
                    />
                </div>
            ),
        },
        {
            title: t('Action'),
            key: 'action',
            render: (_, record) => (
                record.user_id !== initialData.owner_user_id ? (
                    <Popconfirm
                        title={t('Are you sure to delete this user?')}
                        onConfirm={() => handleDeleteUser(record.user_id)}
                        okText={t('Yes')}
                        cancelText={t('No')}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                ) : null
            ),
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

    if (!initialData) {
        return <LoadingScreen />;
    }
    //desactiveStore fonksiyonu endpoint /api/stores/desactiveStore/:id
    const desactiveStore = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/stores/desactive/${id}`);
            if (response.status === 200) {
                message.success(t('Store desactivated successfully'));
                navigate('/store/list');
            }
        }
        catch (error) {
            console.error(error);
            message.error(t('Failed to desactivate store'));
        }
    };

    const onFinishDeliveryForm = async (values) => {
        try {
            // console.log(values);

            setLoadingDelivery(true);
            let deliveryData = {};

            if (selectedDeliveryCompany == 1) {
                deliveryData = {
                    delivery_company: values.delivery_company,
                };
            } else if (selectedDeliveryCompany == 2) {
                deliveryData = {
                    delivery_company: values.delivery_company,
                    emailCathedis: values.emailCathedis,
                    passwordCathedis: values.passwordCathedis,
                    allow_opening_package: values.allow_opening_package,
                };
            }
            else if (selectedDeliveryCompany == 3) {
                deliveryData = {
                    delivery_company: values.delivery_company,
                    idOzonExpress: values.idOzonExpress,
                    apiKeyOzonExpress: values.apiKeyOzonExpress,
                    allow_opening_package: values.allow_opening_package,

                };
            }
            else if (selectedDeliveryCompany == 4) {
                deliveryData = {
                    delivery_company: values.delivery_company,
                    idAmeex: values.idAmeex,
                    apiKeyAmeex: values.apiKeyAmeex,
                    allow_opening_package: values.allow_opening_package,
                    allow_trying_products: values.allow_trying_products,

                };
            }

            console.log('test:   ' + selectedDeliveryCompany);

            await axios.put(`${API_URL}/api/stores/delivery/updateDeliveryCompany/${id}/${selectedDeliveryCompany}`, deliveryData);
            message.success(t('Delivery Informations updated successfully'));
            // navigate('/store/list');
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || t('Failed to update delivery informations'));
        } finally {
            setLoadingDelivery(false);
        }
    }




    return (
        <div className="min-h-screen bg-gray-50">
            {/* <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <Link to="/" className="flex items-center">
                                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                    Magyon
                                </span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">

                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>

                                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                                    <Button type="text" className="flex items-center gap-2">
                                        <span className="text-gray-700">{auth.user.name}</span>
                                    </Button>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </header> */}
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
                            {/* <h2 className="text-2xl font-bold m-0">{t('Edit Store')} </h2> */}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow mb-6 flex items-center gap-6">
                        <div className="w-24 h-24 flex-shrink-0">
                            {imageUrl ? (
                                <img
                                    src={`${API_URL}${imageUrl}`}
                                    alt={t('Store Logo')}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                    <ShopOutlined style={{ fontSize: '2rem', color: '#666' }} />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{t('Edit Store')}</h1>
                            <p className="text-gray-500">{t('Update your store information and manage users')} </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow mb-6">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}

                        >
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
                                rules={[{ required: false, message: t('Please input store description!') }]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>

                            <Form.Item
                                name="animate_marquee"
                                label={t('Animate Marquee')}
                                rules={[{ required: false, message: t('Please input store animate marquee!') }]}
                            >
                                <Input.TextArea rows={1} />
                            </Form.Item>
                            
                            <div className="flex flex-row ">
<Form.Item
                                name="color_1"
                                label={t('Color')+" 1"}
                                rules={[{ required: false, message: t('Please input store color 1!') }]}
                                className='w-1/2'
                            >
                                      <ColorPicker 
                                    //   defaultValue={form.getFieldValue("color_1")} 
                                      value={form.getFieldValue("color_1")}
  onChange={(color) => {
    form.setFieldValue("color_1", color.toHexString());
  }}
                                      size="large" showText />
                            </Form.Item>
                            <Form.Item
                                name="color_2"
                                label={t('Color')+" 2"}
                                rules={[{ required: false, message: t('Please input store color 2!') }]}
                            >
                                      <ColorPicker 
//   defaultValue={form.getFieldValue("color_1")} 
                                      value={form.getFieldValue("color_2")}
  onChange={(color) => {
    form.setFieldValue("color_2", color.toHexString());
  }}                                       size="large" showText />
                            </Form.Item>
                            </div>

                            <Form.Item
                                name="google_analytics"
                                label="Google Analytics Code"
                                rules={[{ required: false }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="meta_pixel_id"
                                label="Meta Pixel Id"
                                rules={[{ required: false }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="tiktok_pixel_id"
                                label="Tiktok Pixel Id"
                                rules={[{ required: false }]}
                            >
                                <Input />
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
                                rules={[{ required: true, message: 'Please input delivery price!' }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>

                            <Form.Item
                                name="free_delivery_from"
                                label={t('Free Delivery From')}
                                rules={[{ required: true, message: 'Please input free delivery price!' }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>

                              <Form.Item
    name="chari_payment_active"
    label={
    <Space size={8}>
      <Avatar
        size={22}
        shape="circle"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIOj0IopKKT7IH_HWRYWFqGnnLSyS3qDEnFbLkVkmgxw&s=10"
      />
      <span>{t("Chari Payment")}</span>
    </Space>
  }

    valuePropName="checked"
    initialValue={false}
  >
    <Switch />
  </Form.Item>

  {chariPaymentActive && (
    <>
      <Form.Item
        name="chari_payment_number"
        label={t("Chari Payment Number")}
        rules={[
          {
            required: true,
            message: t("Please enter Chari payment number"),
          },
        ]}
        preserve={false}
      >
        <Input placeholder="06..." />
      </Form.Item>

      <Form.Item
        name="chari_payment_discount"
        label={t("Chari Payment Discount Amount")}
        initialValue={0}
        rules={[
          {
            required: true,
            message: t("Please enter discount amount"),
          },
        ]}
        preserve={false}
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          placeholder={t("Discount Amount")}
          addonAfter="MAD"
        />
      </Form.Item>
    </>
  )}

                            <Form.Item
                                name="logo"
                                label={t('Store Logo')}
                            >
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    customRequest={customUpload}
                                >
                                    {imageUrl ? (
                                        <img
                                            src={`${API_URL}${imageUrl}`}
                                            alt="avatar"
                                            // style={{ width: '50px' }}
                                            className='max-h-full object-cover rounded-2xl'
                                        />
                                    ) : (
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>{t('Upload Logo')} </div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    {t('Update Store')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow mb-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{t('Delivery Informations')}</h2>
                        </div>
                        <Form
                            form={deliveryForm}
                            layout="vertical"
                            onFinish={onFinishDeliveryForm}
                        >
                            <Form.Item
                                name="delivery_company"
                                label={t('Delivery Company')}
                                rules={[{ required: true, message: t('Please select Delivery Company!') }]}
                            >
                                <Select
                                    showSearch
                                    placeholder={t('Select Delivery Comapany')}
                                    filterOption={(input, option) =>
                                        (option?.title ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    className='w-10 h-10'
                                    onChange={(value) => setSelectedDeliveryCompany(value)}

                                >
                                    {deliveryCompanies.map((company) => (
                                        <Select.Option key={company.value} value={company.value} title={company.label}>
                                            <div className="flex items-center gap-2">
                                                {/* <span
                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: "#" + color.color_code }}
                                                /> */}
                                                <img src={company.logo_path} alt="" className='w-8 h-8 rounded-xl object-contain' />
                                                {company.label}
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>


                            </Form.Item>

                            {selectedDeliveryCompany == 2 && (
                                <>
                                    <Form.Item
                                        name="emailCathedis"
                                        label={t('Email')}
                                        rules={[{ required: true, message: t('Please input Email!'), type: 'email' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="passwordCathedis"
                                        label={t('Password')}
                                        rules={[{ required: true, message: t('Please input Password!') }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="allow_opening_package" label={t('Allow opening of the package')} valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </>
                            )}
                            {selectedDeliveryCompany == 3 && (
                                <>
                                    <Form.Item
                                        name="idOzonExpress"
                                        label="Id"
                                        rules={[{ required: true, message: t('Please input') + ' Id ' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="apiKeyOzonExpress"
                                        label="Api Key"
                                        rules={[{ required: true, message: t('Please input') + ' Api Key ' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="allow_opening_package" label={t('Allow opening of the package')} valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </>
                            )}
                            {selectedDeliveryCompany == 4 && (
                                <>
                                    <Form.Item
                                        name="idAmeex"
                                        label="Id"
                                        rules={[{ required: true, message: t('Please input') + ' Id ' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="apiKeyAmeex"
                                        label="Api Key"
                                        rules={[{ required: true, message: t('Please input') + ' Api Key ' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="allow_opening_package" label={t('Allow opening of the package')} valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                    <Form.Item name="allow_trying_products" label={t('Allow trying the products')} valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </>
                            )}

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loadingDelivery} > {t('Update')} </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Store Users</h2>
                            <Button type="primary" onClick={() => setIsModalVisible(true)}>
                                {t('Add User')}
                            </Button>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={storeUsers}
                            rowKey={record => record.user_id}
                            scroll={{
                                x: true,
                                y: 480,
                            }}
                        />
                    </div>
                    {/* delete store buttonu */}
                    <div className="bg-white p-8 rounded-lg shadow mt-5">
                        <Popconfirm
                            title={t('Are you sure to delete this store?')}
                            onConfirm={desactiveStore}
                            okText={t('Yes')}
                            cancelText={t('No')}
                        >
                            <Button type="primary" danger className='w-full' icon={<DeleteOutlined />}
                            // onClick={desactiveStore}
                            >{t('Delete Store')} </Button>
                        </Popconfirm>
                    </div>
                </div>
            </div>

            <Modal
                title={t('Add User')}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={userForm}
                    layout="vertical"
                    onFinish={handleAddUser}
                >
                    <Form.Item
                        name="email"
                        label={t('User Email')}
                        rules={[
                            { required: true, message: t('Please input user email!') },
                            { type: 'email', message: t('Please enter a valid email!') }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="permissions"
                        label={t('Permissions')}
                        rules={[{ required: true, message: t('You must select at least one permission!') }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder={t('Select permissions')}
                            options={[
                                { label: t('Stock Seller'), value: 'stock_seller' },
                                { label: t('Stock Manager'), value: 'stock_manger' },
                                { label: t('Ecommerce Manager'), value: 'ecommerce_manger' },
                                { label: t('Statistics Manager'), value: 'statistics_manager' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {t('Add User')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EditStore; 