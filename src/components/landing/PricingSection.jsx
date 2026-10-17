import { Button } from 'antd';
import React from 'react'
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const PricingSection = () => {
    const { t } = useTranslation();

    const plans = [
        {
            name: t('Free'),
            price: '0',
            note: t('First month'),
            features: [
                '1 ' + t('Store'),
                '100 ' + t('Products'),
                '2 ' + t('User Accounts'),
                t('Basic Support'),
            ],
            recommended: false,
        },
        {
            name: 'Pro',
            price: '199',
            note: t('Month'),
            features: [
                '3 ' + t('Stores'),
                '500 ' + t('Products'),
                '10 ' + t('User Accounts'),
                t('Priority Support'),
            ],
            recommended: true,
        },
        {
            name: 'Business',
            price: '399',
            note: t('Month'),
            features: [
                '10 ' + t('Stores'),
                '1000 ' + t('Products'),
                '50 ' + t('User Accounts'),
                t('Premium Support'),
            ],
            recommended: false,
        },
    ];




    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {plans.map((plan) => (
                <div
                    key={plan.name}
                    className={`p-6 rounded-lg border ${plan.recommended
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200'
                        } bg-white`}                >
                    <div className="text-center ">
                        <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                        <div className="text-4xl font-bold mb-6">
                            {plan.price} DH
                            <span className="text-base font-normal text-gray-600">/{plan.note}</span>
                        </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                                <CheckCircleOutlined className="text-green-500 mr-2" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <Link to="/login">
                        <Button
                            type={plan.recommended ? 'primary' : 'default'}
                            size="large"
                            block
                        >
                            {t('Get Started')}
                        </Button>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default PricingSection