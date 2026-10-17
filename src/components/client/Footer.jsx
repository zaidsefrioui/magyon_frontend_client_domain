import { t } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import { WhatsAppOutlined } from '@ant-design/icons';
import { Modal } from 'antd';


const Footer = ({ store }) => {
    const { t } = useTranslation();

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    const terms = (
            <>
            

            <p>{t("Welcome to  {{storeName}} store, these are our rules:",{storeName:store.name})}</p>

            <h2>1. {t("Definitions")}</h2>
            <p>{t('Our store operates in Morocco.')}</p>

            <h2>2. {t('Orders & Payment')}</h2>
            <p>{t('All product prices are in Moroccan Dirham (MAD). We offer cash on delivery as the payment method.')}</p>

            <h2>3. {t('Shipping & Delivery')} </h2>
            <p>{t('Once your order is confirmed, it will be shipped within 1 day. If your order is placed on the weekend, it will be shipped on Monday. We aim to deliver your order within 1–2 days after shipping.')} </p>

            <h2>4. {t('Returns & Refunds')} </h2>
            <p>{t('You may cancel your order before it is shipped. If the product is damaged or is not as described on our website, please contact us and we will start your return process.')} </p>

            </>)

    const privacy = (
    <>
            
            {/* <p><em>Last Updated: August 13, 2025</em></p> */}

            <h2>{t('Introduction')} </h2>
            <p>{t('{{storeName}} Store is dedicated to respecting and protecting your personal information. This Privacy Policy explains how we collect, use, and protect your personal data when you visit our website.',{storeName: store.name})} </p>
            {/* <p>If you have any questions, contact us at <a href="mailto:privacy@magyon.com">privacy@magyon.com</a>.</p> */}

            <h2>1. {t('Data We Collect')} </h2>
            <ul>
                <li><strong>{t('Identity & Contact Data:')} </strong> {t('name, phone number, email address, billing/shipping address.')} </li>
                {/* <li><strong>Order & Payment Data:</strong> order details and payment status (payments are processed via our payment partners; we do not store full card details).</li> */}
                <li><strong>{t('Technical & Usage Data:')} </strong> {t('IP address, device information, pages viewed, and interaction logs.')} </li>
                <li><strong>{t('Communications:')} </strong> {t('messages you send to customer support.')} </li>
            </ul>

            <h2>2. {t('How We Use Your Data')} </h2>
            <ul>
                <li>{t('To process and deliver your orders, including shipping and returns.')} </li>
                <li>{t('To provide customer support and respond to inquiries.')} </li>
                <li>{t('To operate, secure, and improve our website and services.')} </li>
                <li>{t('To prevent fraud and comply with legal obligations.')} </li>
            </ul>
            <p>{t('We do not sell your personal data. We may share it with trusted service providers (e.g., couriers, payment processors) solely to provide our services.')} </p>

            <h2>3. {t('Cookies')} </h2>
            <p>{t('We use cookies and similar technologies to enhance your browsing experience, remember preferences, and analyze site performance. You can control cookies through your browser settings. Disabling cookies may affect certain features of the site.')} </p>

            <h2>4. {t('Data Security')} </h2>
            <p>{t('We implement reasonable technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission or storage is 100% secure.')} </p>

            <h2>5. {t('International Transfers')} </h2>
            <p>{t('Your data may be processed in countries other than your own by our service providers. Where applicable, we take steps to ensure appropriate safeguards are in place.')} </p>

            <h2>6. {t('Data Retention')} </h2>
            <p>{t('We retain personal data only as long as necessary to fulfill the purposes outlined in this Policy and to comply with legal, accounting, or reporting requirements.')} </p>

            <h2>7. {t('Changes to This Policy')} </h2>
            <p>{t('We may update this Privacy Policy from time to time. The latest version will always be posted on this page with the “Last Updated” date.')} </p>

            

    </>
    )

    const showModalTerms = () => {
        setModalContent(terms); 
        setModalTitle(t("Terms of Service"));
        setModalVisible(true);
    };
    const showModalPrivacy = () => {
        setModalContent(privacy); 
        setModalTitle(t("Privacy Policy"));
        setModalVisible(true);
    };
    const handleModalCancel = () => {
        setModalVisible(false);
    };

    let phoneNumber = store.whatsapp_number ? store.whatsapp_number : "0000";

    // Clean the phone number - remove all non-digit characters
    phoneNumber = phoneNumber.replace(/\D/g, '');

    // Convert numbers starting with 0 to 212 format
    if (phoneNumber.startsWith('0') && !phoneNumber.startsWith('00')) {
        phoneNumber = '212' + phoneNumber.substring(1);
    }
    if (phoneNumber.startsWith('+')) {
        phoneNumber = '00' + phoneNumber.substring(1);
    }
    // Add + prefix if not present
    // else if (!phoneNumber.startsWith('+')) {
    //     phoneNumber = '+' + phoneNumber;
    // }

    return (
        <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className='flex flex-col items-center pb-5 gap-2'>
                <div className="text-center text-lg font-bold">{store.name}</div>
                {store.description &&

                    <div className="text-center text-sm">{store.description}</div>
                }
                {store.whatsapp_number &&

                    <div className="text-center text-sm text-teal-500/"><WhatsAppOutlined /> <a href={"https://api.whatsapp.com/send?phone=" + phoneNumber + "&text="} target='_blank' className="">

                        {store.whatsapp_number}
                    </a>
                    </div>
                }
                <div className="flex space-x-4 text-sm text-gray-500 gap-1">
                    <a onClick={() => showModalTerms()} className="hover:underline cursor-pointer">
                        {t('Terms of Service')}
                    </a>
                    <a onClick={() => showModalPrivacy()} className="hover:underline cursor-pointer">
                        {t('Privacy Policy')}
                    </a>
                </div>
            </div>
            <div className="flex items-center justify-center pb-6">
                <LanguageSwitcher />

            </div>
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <p>&copy; {t('2026 Magyon. All rights reserved.')}</p>
                </div>
            </div>
            <Modal

                title={modalTitle}
                visible={modalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={540}
                centered
                destroyOnClose>
                {modalContent}
            </Modal>
        </footer>
    );
};

export default Footer;