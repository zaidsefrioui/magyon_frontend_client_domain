import { Button } from 'antd';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { removeProduct, increaseQuantity, decreaseQuantity, clearCart } from "../../redux/shopCartSlice"; // Redux action'larını import et
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';



const API_URL = import.meta.env.VITE_API_URL;

const CartDrawer = ({ store }) => {
    const cart = useSelector((state) => state.shopCart); // Redux state'ini dinle
    const dispatch = useDispatch(); // Redux dispatch fonksiyonunu al
    const navigate = useNavigate();

    const { t } = useTranslation();



    // const [cartItems, setCartItems] = useState(cart.cartItems);
    // const [cartItems, setCartItems] = useState([
    //     { id: 1, name: 'Product 1', price: 80 },
    //     { id: 2, name: 'Product 2', price: 120 },
    // ]);
    const handleCompleteOrder = () => {
        // console.log('Sipariş tamamlandı:', cart);
        window.scrollTo(0, 0);
        navigate(`/order`); // Use store.slug for dynamic routing
    };

    const handleIncreaseQuantity = (product) => {
        dispatch(increaseQuantity(product)); // Miktarı artır
    };

    const handleDecreaseQuantity = (product) => {
        dispatch(decreaseQuantity(product)); // Miktarı azalt
    };

    const handleRemoveProduct = (product) => {
        dispatch(removeProduct(product)); // Ürünü sepetten kaldır
    };
    const handleClearCart = () => {
        dispatch(clearCart()); // Sepeti tamamen temizle
    };

    return (

        <div className="flex flex-col h-full">
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
                {cart.cartItems.map((item) => (

                    <div key={item.id} className="border-b pb-4 mb-4  ">
                        <div className='flex flex-row justify-between'>
                            <div className="flex items-center">
                                <img
                                    src={`${API_URL}${item.image}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="ml-4">
                                    <p className="font-bold">{item.name} </p>
                                    <p>{item.price} DH {item.size && '(' + item.size + ')'}</p>
                                </div>

                            </div>
                            <div className="item-quantity flex justify-center items-center gap-2">
                                <Button
                                    type="primary"
                                    icon={<MinusOutlined />}
                                    size="small"
                                    disabled={item.quantity === 1}
                                    onClick={() => handleDecreaseQuantity(item)} // Miktarı azalt
                                    style={{
                                                color:'white',
                                                background: `linear-gradient(to right, ${store.color_1}, ${store.color_2})`  // #06b6d4 = cyan-500
                                            }}
                                ></Button>
                                <div className="quantity">{item.quantity}</div>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="small"
                                    disabled={item.quantity === item.maxQuantity}
                                    onClick={() => handleIncreaseQuantity(item)} // Miktarı artır
                                    style={{
                                                color:'white',
                                                background: `linear-gradient(to left, ${store.color_1}, ${store.color_2})`  // #06b6d4 = cyan-500
                                            }}
                                ></Button>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                    onClick={() => handleRemoveProduct(item)} // Ürünü sepetten kaldır
                                ></Button>
                            </div>
                        </div>

                    </div>

                ))}
            </div>

            {/* Siparişi Tamamla Butonu */}
            <div className="border-t pt-4">
                <div className="flex justify-between py-5 text-xl">
                    <p className="">{t('Total')}</p>
                    <b>{cart.cartTotal} DH</b>

                </div>
                <Button
                    size='large'
                    className="w-full bg-green-600 text-white rounded-2xl font-bold"
                    onClick={handleCompleteOrder}
                    disabled={cart.cartTotalQuantity > 0 ? false : true}
                >
                    {t('Order now')}
                </Button>
            </div>

        </div>
    )
}

export default CartDrawer