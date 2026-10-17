import React from 'react';
import { Dropdown, Menu, Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const menu = (
        <Menu
            onClick={({ key }) => changeLanguage(key)}
            items={[
                { key: 'en', label: 'English' },
                { key: 'ar', label: 'العربية' },
                { key: 'fr', label: 'Français' },
                { key: 'es', label: 'Español' },
                { key: 'tr', label: 'Türkçe' },
            ]}
        />
    );

    return (
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <Button icon={<GlobalOutlined />}>
                {i18n.language.toUpperCase()}
            </Button>
        </Dropdown>
    );
};

export default LanguageSwitcher;
