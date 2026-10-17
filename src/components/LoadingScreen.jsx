import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LoadingScreen = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    const { t } = useTranslation();


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Spin indicator={antIcon} />
                <div className="mt-4 text-gray-600 text-lg">{t('Loading...')}</div>
            </div>
        </div>
    );
};

export default LoadingScreen; 