import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, LogoutOutlined, EditOutlined, CreditCardOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Tag } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { Helmet } from "react-helmet";
import HeaderHome from '../components/admin/header/HeaderHome';
import { useTranslation } from 'react-i18next';


const API_URL = import.meta.env.VITE_API_URL;

const StoreList = () => {
    const [ownedStores, setOwnedStores] = useState([]);
    const [invitedStores, setInvitedStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth, logout, selectStore } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const { currentStorePermissionsStockSeller,
        currentStorePermissionsStockEdit,
        currentStorePermissionsEcommerce,
        currentStorePermissionsStatistics,
        // userSuperAdmin,
    } = useAuth();
    const userSuperAdmin = localStorage.getItem('userSuperAdmin') === "true";

    const [ordersCount, setOrdersCount] = useState({}); // { storeId: count }
    const previousCounts = useRef({}); // önceki değerleri tutmak için
  const isFirstRun = useRef(true); // ilk çalışmada ses çıkmaması için


    const fetchNewOrders = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/ecommerce/${id}/storeNewOrders`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch Ecommere Orders:', error);
            return 0;
        }
    };
    useEffect(() => {
    const loadOrders = async () => {
      const results = {};

      for (const store of ownedStores) {
        const count = await fetchNewOrders(store.id);
        results[store.id] = count;
        
        
        const audio = new Audio('/newOrder.mp3'); // /public/sounds/notify.mp3 içinde
        // 🔔 İlk çalışmadan sonraki kontrol
        if (!isFirstRun.current) {
          const prevCount = previousCounts.current[store.id] || 0;
          if (count > prevCount) {
            audio.play().catch(() => {});
          }
        }
      }

      previousCounts.current = results; // yeni değerleri sakla
      setOrdersCount(results);
      isFirstRun.current = false; // artık ilk çalışmayı geçti
    };

    if (ownedStores.length > 0) {
      loadOrders(); // ilk yükleme
      const interval = setInterval(loadOrders, 60 * 1000); // her dakika tekrar
      return () => clearInterval(interval); // temizleme
    }
  }, [ownedStores]);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/stores`);
            setOwnedStores(response.data.ownedStores || []);
            setInvitedStores(response.data.invitedStores || []);
        } catch (error) {
            console.error('Failed to fetch stores:', error);
            message.error('Failed to fetch stores');
        } finally {
            setLoading(false);
        }
    };

    const handleStoreClick = async (storeId, storeSlug) => {
        try {
            await selectStore(storeId, storeSlug);
            dispatch(clearCart());
            // message.success('Store selected successfully');
            const newStockSeller = localStorage.getItem('currentStorePermissionsStockSeller') === "true";
            const newStockEdit = localStorage.getItem('currentStorePermissionsStockEdit') === "true";
            const newEcommerce = localStorage.getItem('currentStorePermissionsEcommerce') === "true";
            const newStatistics = localStorage.getItem('currentStorePermissionsStatistics') === "true";

            if (newStockSeller) {
                navigate('/store');
            } else if (newStockEdit) {
                navigate("/store/stock");
            } else if (newEcommerce) {
                navigate("/store/ecommerce");
            } else if (newStatistics) {
                navigate("/store/statistic");
            }

        } catch (error) {
            console.error('Failed to select store:', error);
            message.error('Failed to select store');
        }
    };

    // const userMenuItems = [
    //     {
    //         key: 'storelist',
    //         label: 'Store List',
    //         icon: < AppstoreOutlined />,
    //         onClick: () => {
    //             navigate('/store/list');
    //         },
    //     },
    //     {
    //         key: 'payment',
    //         label: 'Payment',
    //         icon: < CreditCardOutlined />,
    //         onClick: () => {
    //             navigate('/payment');
    //         },
    //     },
    //     {
    //         key: 'logout',
    //         label: 'Logout',
    //         icon: <LogoutOutlined />,
    //         onClick: () => {
    //             logout();
    //             navigate('/login');
    //         },
    //         danger: true,
    //     },
    // ];

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">{t('Loading...')} </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* <Helmet>
                <title>Store List - Magyon</title>
            </Helmet> */}
            {/* Header */}
            <HeaderHome />

            {
                userSuperAdmin &&
                <div className='flex justify-center mt-6'>
                    <Link to={'/superAdmin'}>
                        <Button type="primary" >User Payment Management</Button>
                    </Link>
                </div>
            }
            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Owner Stores */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">{t('Owner Stores')} </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ownedStores.map((store) => (
                            <div
                                key={store.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                            >
                                <div
                                    onClick={() => handleStoreClick(store.id, store.slug)}
                                    className="cursor-pointer"
                                >
                                    <div className="h-48 bg-gradient-to-r from-blue-500-- from-[#1e3a8a] to-cyan-500 flex items-center justify-center p-4">
                                        {store.logo_path ? (
                                            <img
                                                src={`${API_URL}${store.logo_path}`}
                                                alt={store.name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="text-6xl text-white">🏪</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{store.name} {ordersCount[store.id]>0 && (<Tag color="#cd201f">  {ordersCount[store.id]}</Tag>)}</h3>
                                        

                                    </div>
                                </div>
                                <div className="px-4 pb-4 flex justify-end">
                                    <Link to={`/store/${store.id}/edit`}>
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            className="bg-blue-500"
                                        >
                                            {t('Edit Store')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <Link to="/create-store" className="block h-full">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-all h-full flex flex-col items-center justify-center p-6">
                                <PlusOutlined className="text-4xl text-gray-400 mb-3" />
                                <span className="text-gray-600 font-medium text-lg">{t('Add Store')} </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Invited Stores */}
                {invitedStores.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">{t('Invited Stores')} </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {invitedStores.map((store) => (
                                <div
                                    key={store.id}
                                    onClick={() => handleStoreClick(store.id, store.slug)}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="h-48 bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center p-4">
                                        {store.logo_path ? (
                                            <img
                                                src={`${API_URL}${store.logo_path}`}
                                                alt={store.name}
                                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="text-6xl text-white">🏪</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold text-gray-800">{store.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoreList; 