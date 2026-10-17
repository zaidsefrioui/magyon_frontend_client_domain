import React, { useState, useEffect } from 'react';
import { Badge, Button, Drawer } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartDrawer from './CartDrawer';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

function Header2({ store }) {

    const [searchVisible, setSearchVisible] = useState('hidden');
    const [isSticky, setIsSticky] = useState(false);
    const cart = useSelector((state) => state.shopCart); // Redux state'ini dinle

    const { t } = useTranslation();


    const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
    // const [cartItems, setCartItems] = useState([
    //     { id: 1, name: 'Product 1', price: 80 },
    //     { id: 2, name: 'Product 2', price: 120 },
    // ]); // Sepetteki ürünler örnek olarak eklendi.
    const navigate = useNavigate()

    const searchResponsive = () => {
        setSearchVisible(searchVisible === 'hidden' ? 'flex' : 'hidden');
    };

    const showCartDrawer = () => {
        setCartDrawerVisible(true);
    };

    const onCloseCartDrawer = () => {
        setCartDrawerVisible(false);
    };

    // const handleCompleteOrder = () => {
    //     console.log('Sipariş tamamlandı:', cartItems);
    //     navigate("/testtest/order")
    //     // Sipariş tamamlama işlemleri burada yapılabilir.
    // };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const goToHome = () => {
        window.scrollTo(0, 0);
        navigate(`/`);
    };

    return (
        <div>
            {/* Logo Kısmı */}
            {/* <div className='text-white text-xl font-bold text-center p-1 logo border-b mb-3 px-14 bg-blue-500'>
                Magyon
            </div> */}

{/* Haber Bandı */}
{store.animate_marquee && (
  <div
    className={`${isSticky ? 'fixed top-0 left-0 right-0' : 'sticky top-0'} z-[60] text-white overflow-hidden whitespace-nowrap`}
    style={{ background: store.color_1 }}
  >
    <div className="animate-marquee inline-block py-2">
      <span className="mx-48">
        {store.animate_marquee}
      </span>
    </div>
  </div>
)}
            {/* Sabit Header Kısmı */}
            <div className={`${isSticky ? 'fixed top-0 left-0 right-0' : ''} ${store.animate_marquee ? 'top-[40px]' : 'top-0'} bg-white z-50`}>
                <div className="flex flex-row justify-between px-5 md:px-20 py-3">
                    {/* Rasgele Fotoğraf ve Mağaza Logosu */}
                    <div className="flex flex-row gap-5 cursor-pointer" onClick={goToHome}>
                        <img
                            src={`${API_URL}${store.logo_path} `}
                            className='w-10 h-10 object-cover rounded-xl'
                            alt="image"
                        />
                        <div className="shop-logo flex items-center font-bold text-xl">
                            {store.name || t('Loading...')}
                        </div>
                    </div>

                    {/* Arama Kutusu (Büyük Ekranlar İçin) */}
                    {/* <div className="shop-search hidden md:flex items-center relative">
                        <input
                            type="search"
                            placeholder="Search..."
                            className="w-56 h-8 pl-3 pr-10 bg-gray-100 text-blue-950 rounded-lg text-sm"
                        />
                        <SearchOutlined className="absolute right-3 text-gray-500 cursor-pointer" />
                    </div> */}

                    {/* İkonlar (Arama ve Sepet) */}
                    <div className="flex flex-row gap-3 text-2xl">
                        {/* <SearchOutlined onClick={searchResponsive} className="cursor-pointer md:hidden" /> */}
                        <Badge count={cart.cartTotalQuantity} className='text-3xl'>
                            <ShoppingCartOutlined onClick={showCartDrawer} className="cursor-pointer" />
                        </Badge>
                    </div>
                </div>

                {/* Mobil Arama Kutusu (Göster/Gizle) */}
                {/* <div className={`shop-search w-full ${searchVisible} md:hidden px-5 mt-3 mb-3`}>
                    <input
                        type="search"
                        placeholder="Search..."
                        className="w-full h-8 px-3 bg-gray-100 text-blue-950 rounded-lg text-sm"
                    />
                </div> */}
            </div>

            {/* Cart Drawer */}
            <Drawer
                title={t("Shopping Cart")}
                placement="right"
                onClose={onCloseCartDrawer}
                visible={cartDrawerVisible}
                width={400}
            >
                <CartDrawer store={store} />
            </Drawer>
        </div>
    );
}

export default Header2;