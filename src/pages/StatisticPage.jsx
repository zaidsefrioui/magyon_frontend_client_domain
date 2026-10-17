import React, { useState } from 'react'
import HeaderSecond from '../components/admin/header/HeaderSecond'
import { Button } from 'antd';
import All from '../components/admin/statistics/All';
import Store from '../components/admin/statistics/Store';
import Ecommerce from '../components/admin/statistics/Ecommerce';
import { useTranslation } from 'react-i18next';

const StatisticPage = () => {
    const [activePage, SetActivePage] = useState('All');

    const { t } = useTranslation();

    const renderContent = () => {
        switch (activePage) {
            case 'All':
                return (
                    <All />
                );
            case 'Store':
                return (
                    <Store />
                );
            case 'E-commerce':
                return (
                    <Ecommerce />
                );
            default:
                return null;
        }
    };
    return (
        <>
            <HeaderSecond />
            <h1 className='text-4xl font-bold text-center pb-5'>
                {t('Statistics')}
            </h1>
            <div className='px-3 flex flex-col gap-10'>


                <div className="pb-3 flex justify-center gap-5 px-3">
                    <Button type={activePage === 'All' ? 'primary' : 'default'} size="large" onClick={() => { SetActivePage('All') }}>

                        {t('All')}</Button>
                    <Button type={activePage === 'Store' ? 'primary' : 'default'} size="large" onClick={() => { SetActivePage('Store') }}>

                        {t('Store')} </Button>
                    <Button type={activePage === 'E-commerce' ? 'primary' : 'default'} size="large" onClick={() => { SetActivePage('E-commerce') }}>

                        {t('E-commerce')} </Button>
                </div>



            </div>
            <div className="px-3 mt-1">
                {renderContent()}
            </div>
        </>
    )
}

export default StatisticPage