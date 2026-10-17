import React from 'react'
import { FacebookFilled, InstagramFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';


const Footer = () => {
    const { t } = useTranslation();
    return (
        <div><footer className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* About */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('About')}</h3>
                        <p className="text-gray-600">
                            {t('Your complete store management solution.')}

                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('Services')}</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>{t('Inventory Management')}</li>
                            <li>{t('Sales Analytics')}</li>
                            <li> {t('Employee Management')}</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('Contact')}</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Email: info@magyon.com</li>
                        </ul>
                    </div>

                    {/* Social + Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">{t('Follow Us')}</h3>
                        <div className="space-x-4 text-2xl mb-4">
                            <a
                                href="https://web.facebook.com/profile.php?id=61578084356083"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-blue-800"
                            >
                                <FacebookFilled />
                            </a>
                            <a
                                href="https://www.instagram.com/magyoncom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-pink-700"
                            >
                                <InstagramFilled />
                            </a>
                        </div>
                        <div className="space-x-4 text-sm text-gray-500">
                            <a href="/terms" className="hover:underline hover:text-gray-800">
                                {t('Terms of Service')}
                            </a>
                            <a href="/privacy" className="hover:underline hover:text-gray-800">
                                {t('Privacy Policy')}
                            </a>
                        </div>
                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-10 border-t pt-6 text-center text-sm text-gray-500">
                    <p>
                        Copyright © 2025{' '}
                        <span className="font-semibold bg-gradient-to-r from-[#1e3a8a] to-cyan-500 bg-clip-text text-transparent">
                            Magyon
                        </span>
                        . All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer></div>
    )
}

export default Footer