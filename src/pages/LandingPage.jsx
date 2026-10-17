import React, { useState } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import PricingSection from "../components/landing/PricingSection"
import Footer from '../components/landing/Footer';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';


const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { t, i18n } = useTranslation();


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
                <span className="text-4xl font-bold bg-gradient-to-r from-[#1e3a8a] to-cyan-500 bg-clip-text text-transparent">
                  Magyon
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('about')}
                className={`text-gray-600 hover:text-blue-900 ${activeSection === 'about' ? 'text-blue-900' : ''}`}
              >
                {t('About Us')}
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className={`text-gray-600 hover:text-blue-900 ${activeSection === 'services' ? 'text-blue-900' : ''}`}
              >
                {t('Services')}
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className={`text-gray-600 hover:text-blue-900 ${activeSection === 'pricing' ? 'text-blue-900' : ''}`}
              >
                {t('Pricing')}
              </button>
              <Link to="/login">
                <Button type="primary" size="large">
                  {t('Login')}
                </Button>
              </Link>
              {/* {t('welcome')} */}

              <LanguageSwitcher />

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
          <button
            onClick={() => {
              scrollToSection('about');
              setIsMenuOpen(false);
            }}
            className="text-gray-600 hover:text-blue-900 text-left"
          >
            {t('About Us')}
          </button>
          <button
            onClick={() => {
              scrollToSection('services');
              setIsMenuOpen(false);
            }}
            className="text-gray-600 hover:text-blue-900 text-left"
          >
            {t('Services')}
          </button>
          <button
            onClick={() => {
              scrollToSection('pricing');
              setIsMenuOpen(false);
            }}
            className="text-gray-600 hover:text-blue-900 text-left"
          >
            {t('Pricing')}
          </button>
          <Link to="/login">
            <Button type="primary" block>
              {t('Login')}
            </Button>
          </Link>
          <LanguageSwitcher />

        </div>
      </Drawer>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                {/* Manage Your Store with Ease */}
                {t('Smarter Selling Starts Here')}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t('Streamline your business operations with our comprehensive store management solution.')}
              </p>
              <div className="space-x-4">
                <Link to="/store/list">
                  <Button type="primary" size="large">
                    {t('Get Started')}
                  </Button>
                </Link>
                <Button size="large"
                  onClick={() => {
                    scrollToSection('services');
                  }}
                >{t('Learn More')}</Button>
              </div>
            </div>
            <div className="hidden- md:block">
              <img
                src="/mockup1.png"
                alt="Store Management"
                className="w-[650px]  h-auto rounded-lg -shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>



      {/* Services Section */}
      <div id="services" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('Our Services')}</h2>
          {/* Services içeriği */}
          {t('Magyon offers an all-in-one solution to help you manage every aspect of your retail operations. From store setup to team coordination and logistics, our platform is designed to simplify your workflow and keep everything under control.')}

          <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Store Management')}</h3>
              <p className="text-gray-600">
                {t('Organize your product catalog, set prices, and manage stock levels effortlessly.')}

              </p>
            </div>
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Employee Access')}</h3>
              <p className="text-gray-600">
                {t('Add team members with role-based access and delegate responsibilities securely.')}

              </p>
            </div>
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Delivery Integration')} </h3>
              <p className="text-gray-600">
                {t('Work with trusted local delivery partners, directly integrated into your Magyon dashboard.')}

              </p>  </div>
            {/* <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">Performance Tracking</h3>
              <p className="text-gray-600">
                Make data-driven decisions with real-time insights into your store’s sales and operations.              </p>
            </div> */}


          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-14  bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('Pricing')}</h2>
          {/* Pricing içeriği */}
          <PricingSection />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('Our Features')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Inventory Management')}</h3>
              <p className="text-gray-600">
                {t('Track your stock levels and manage your inventory efficiently to avoid shortages or overstocking.')}
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Sales Analytics')}</h3>
              <p className="text-gray-600">
                {t('Get detailed insights into your daily, weekly, and monthly sales performance to understand trends and optimize your business.')}
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Employee Management')}</h3>
              <p className="text-gray-600">
                {t('Add and manage store staff with role-based permissions. Monitor team activity, assign responsibilities, and ensure smooth collaboration.')}
              </p>
            </div>
            {/* Feature 4 */}
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4"> {t('Role-Based Access Control')}
              </h3>
              <p className="text-gray-600">
                {t('Assign specific roles to each employee to control what sections of the platform they can access. For example, you can restrict an employee to only handle sales, while another is responsible for inventory or online store settings. Roles can be updated or removed at any time.')}


              </p>
            </div>
            {/* Feature 5*/}
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Multi-User System')}</h3>
              <p className="text-gray-600">
                {t('Manage multiple employees under one store account with secure, isolated permissions.')}
                


              </p>
            </div>
            {/* Feature 6 */}
            <div className="p-6 border rounded-lg bg-white">
              <h3 className="text-xl font-semibold mb-4">{t('Mobile-Friendly Interface')}
              </h3>
              <p className="text-gray-600">
                {t('Access and manage your store anytime, anywhere—from your desktop or mobile device.')}
                


              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{t('About Us')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {t('Learn more about what makes')} <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{t('Magyon')}</span> {t('the trusted solution for store management in Morocco.')}
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-10 md:p-14 border border-gray-100">
            <div className="grid gap-6 text-gray-700 text-md leading-relaxed">
              <p>
                {t('Welcome to')} <span className='font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent'>{t('Magyon')}</span>{t('– a smart store management platform designed to support businesses in Morocco in running and growing their retail operations with ease.')} 
              </p>
              <p>
                {t('At Magyon, we believe that every store deserves access to efficient, modern tools—without the complexity of large-scale systems. Our platform helps shop owners streamline their daily tasks, manage sales, track orders, and supervise employee activities, all from a single, user-friendly interface.')}
                
              </p>
              <p>
                {t("Built specifically for the local market, Magyon empowers businesses by simplifying store operations, offering real-time data, and integrating seamlessly with local delivery companies. Whether you're running a small corner store or a chain of outlets, Magyon gives you the tools to stay organized, productive, and focused on what matters most: your customers.")}
              </p>
              <p>
                {t("We’re proud to serve businesses across Morocco, delivering localized support, scalable technology, and a practical approach to digital transformation—without becoming a marketplace ourselves.")}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <Footer />

    </div>
  );
};

export default LandingPage; 