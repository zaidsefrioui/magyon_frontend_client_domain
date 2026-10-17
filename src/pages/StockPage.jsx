import React, { useState } from 'react';
import HeaderSecond from '../components/admin/header/HeaderSecond';
import Products from '../components/admin/stock/Products';
import Categories from '../components/admin/stock/Categories';
import { Button } from 'antd';
import { ShopOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const StockPage = () => {
    const [activeTab, setActiveTab] = useState('Products');

    const { t } = useTranslation();


    const renderContent = () => {
        switch (activeTab) {
            case 'Products':
                return <Products />;
            case 'Categories':
                return <Categories />;
            default:
                return <Products />;
        }
    };

    return (
        <>
            <HeaderSecond />
            <div className="pb-3 flex justify-center gap-10">
                <Button
                    type={activeTab === 'Products' ? 'primary' : 'default'}
                    size="large"
                    onClick={() => setActiveTab('Products')}
                >
                    <ShopOutlined />
                    {t('Products')}
                </Button>
                <Button
                    type={activeTab === 'Categories' ? 'primary' : 'default'}
                    size="large"
                    onClick={() => setActiveTab('Categories')}
                >
                    <AppstoreOutlined />
                    {t('Categories')}
                </Button>
            </div>
            <div className="px-3">
                {renderContent()}
            </div>
        </>
    );
};

export default StockPage;