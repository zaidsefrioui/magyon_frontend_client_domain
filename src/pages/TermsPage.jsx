import React, { useState } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { FacebookFilled, InstagramFilled, MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import PricingSection from "../components/landing/PricingSection"
import Footer from '../components/landing/Footer';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
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
      <div id="terms" className="pt-24 pb-12 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">{t('Terms of Service')} </h2>
          <div className="space-y-4 text-gray-700 text-base leading-relaxed md:px-6">
            <p><strong>{t('Last updated:')} </strong> May 16, 2025</p>
            <p>{t('Welcome to')} <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Magyon</span>. {t('These Terms govern your use of our platform and services. By accessing or using Magyon, you agree to these Terms.')} </p>

            <p><strong>{t('1. Use of the Platform:')} </strong> {t('You agree to use Magyon lawfully and responsibly. You are responsible for your account and any actions taken through it.')} </p>

            <p><strong>{t('2. Account Registration:')} </strong> {t('You must provide accurate information when creating an account and keep it updated.')} </p>

            <p><strong>{t('3. Subscription Plans:')} </strong> {t('We offer Free, Pro, and Business plans with specific limits. You are responsible for your usage within your selected plan.')} </p>

            <p><strong>{t('4. Payments:')}</strong> {t('Paid plans require valid payment. All payments are non-refundable unless otherwise stated.')}</p>

            <p><strong>{t('5. User Management:')}</strong> {t('As an account owner, you are responsible for your team’s actions on the platform.')}</p>

            <p><strong>{t('6. Prohibited Activities:')}</strong> {t('You may not engage in illegal, abusive, or unauthorized activities using the platform.')}</p>

            <p><strong>{t('7. Termination:')}</strong> {t('We may suspend or terminate accounts violating these Terms without prior notice.')}</p>

            <p><strong>{t('8. Changes:')}</strong> {t('We reserve the right to update these Terms. Continued use means you accept the new terms.')}</p>

            <p><strong>{t('9. Contact:')}</strong> {t('For inquiries, reach us at')} <a href="mailto:support@magyon.com" className="text-blue-600 underline">support@magyon.com</a></p>
          </div>
        </div>
      </div>



      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsPage; 