import React, { useState } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { FacebookFilled, InstagramFilled, MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import Footer from '../components/landing/Footer';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t } = useTranslation();


  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-3xl logo">
                <span className="text-3xl font-bold bg-gradient-to-r from-[#1e3a8a] to-cyan-500 bg-clip-text text-transparent">
                  Magyon
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to='/'>
                <button

                  className={`text-gray-600 hover:text-blue-900 `}
                >
                  {t('Home Page')}
                </button>
              </Link>

              <Link to="/login">
                <Button type="primary" size="large">
                  {t('Login')}
                </Button>
              </Link>
            </div>
            <div className="md:hidden">
              <Button
                icon={<MenuOutlined />}
                onClick={() => setIsMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
      >
        <div className="flex flex-col space-y-4">
          <Link to='/'>
            <button
              className="text-gray-600 hover:text-blue-900 text-left"
            >
              {t('Home Page')}
            </button>
          </Link>

          <Link to="/login">
            <Button type="primary" block>
              {t('Login')}
            </Button>
          </Link>
        </div>
      </Drawer>



      {/* About Section */}
      <div id="privacy" className="pt-24 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8"> {t('Privacy Policy')} </h2>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed md:px-6">
            <p><strong>{t('Last updated:')} </strong> May 16, 2025</p>
            <p><span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{t('Magyon')}</span> {t('respects your privacy. This policy explains how we collect and use your information.')}</p>

            <p><strong>{t('1. Information We Collect:')}</strong> {t('Name, email, store details, activity logs, and device/browser data.')}</p>

            <p><strong>{t('2. How We Use Data:')}</strong> {t('To provide services, offer support, improve experience, and ensure security.')}</p>

            <p><strong>{t('3. Sharing:')}</strong> {t('We do not share your data with any third parties.')}</p>

            <p><strong>{t('4. Data Security:')}</strong> {t('We implement encryption and strict controls to protect your data.')}</p>

            <p><strong>{t('5. Your Rights:')}</strong> {t('You may access, update, or delete your information upon request.')}</p>

            <p><strong>{t('6. Cookies:')}</strong> {t('We use cookies to analyze usage and improve features.')}</p>

            <p><strong>{t('7. International Use:')}</strong> {t('Our services follow Moroccan law. By using Magyon outside Morocco, you consent to this.')}</p>

            <p><strong>{t('8. Changes:')}</strong> {t('Updates to this policy will be posted here.')}</p>

            <p><strong>{t('9. Contact:')}</strong> {t('For privacy inquiries, contact')} <a href="mailto:privacy@magyon.com" className="text-blue-600 underline">privacy@magyon.com</a></p>
          </div>
        </div>
      </div>




      {/* Footer */}
      <Footer />

    </div>
  );
};

export default PrivacyPolicyPage; 