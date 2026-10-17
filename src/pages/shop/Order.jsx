import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, message, Select } from 'antd';
import Footer from '../../components/client/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import Header2 from '../../components/client/Header2';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { clearCart } from '../../redux/shopCartSlice';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { pixelTrack } from '../../utils/fbpixel';
import { tiktokTrack } from '../../utils/tiktokPixel';

const API_URL = import.meta.env.VITE_API_URL;

const Order = () => {
    const storeSlug  = import.meta.env.VITE_STORE_SLUG;
    const [store, setStore] = useState({});
    const dispatch = useDispatch();
    const [orderLoading, setOrderLoading] = useState(false);


    const { t } = useTranslation();


    const navigate = useNavigate();

    const cart = useSelector((state) => state.shopCart); // Redux state'ini dinle

    const [deliveryCities, setDeliveryCities] = useState(1);
    const fetchDeliveryCities = async () => {
        try {
            if (store.delivery_company_id == 2) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/cathedis-cities`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            } else if (store.delivery_company_id == 3) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/ozon-express-cities`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            } else if (store.delivery_company_id == 4) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/ameex-cities/${store.id}`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            }

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchDeliveryCities();
    }, [store]);


    useEffect(() => {
        if (orderDisabled) {
            navigate(`/`);
        }
        const fetchStore = async () => {
            try {
                // setLoading(true); // Start loading

                // Append selectedCategory and searchKeyword as query parameters
                const url = new URL(`${API_URL}/api/shop/getStore/${storeSlug}`);
                // if (selectedCategory) {
                //     url.searchParams.append('selectedCategory', selectedCategory);
                // }
                // if (searchKeyword) {
                //     url.searchParams.append('searchKeyword', searchKeyword);
                // }

                const response = await fetch(url);
                const data = await response.json();
                setStore(data);

                // If the store is not found, navigate to the homepage
                if (data.message === t('Store not found')) {
                    navigate('/');
                }
                setLoading(false);
            } catch (error) {
                // If there's an error, navigate to the homepage
                // navigate('/');
            }
            // finally {
            //     setLoading(false); // Stop loading
            // }
        };

        fetchStore();
    }, [storeSlug, navigate]);

    const [deliveryPrice,setDeliveryPrice] = useState(0);
    

    useEffect(() => {
           setDeliveryPrice(( store?.free_delivery_from > 0 && (cart?.cartTotal >= store?.free_delivery_from )) ? 0 : store.delivery_price); 
        },[store,cart]);


    // Örnek sipariş öğeleri
    // const orderItems = [
    //     { id: 1, name: 'Product 1', price: 80, quantity: 2 },
    //     { id: 2, name: 'Product 2', price: 120, quantity: 1 },
    //     { id: 3, name: 'Product 3', price: 50, quantity: 3 },
    // ];


    // Toplam tutarı hesapla
    // const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Tablo sütunları
    const columns = [
        {
            title: t('Product name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('Price'),
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price} DH`,
        },
        {
            title: t('Quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: t('Total'),
            key: 'total',
            render: (_, record) => `${record.price * record.quantity} DH`,
        },
    ];

    // Form submit işlemi
    const onFinish = async (values) => {
        // console.log('Form verileri:', values);
        // console.log('Sipariş tamamlandı');
        // values e cart.cartItems ekle
        values.cartItems = cart.cartItems;
        setOrderLoading(true);




        try {

            const response = await axios.post(`${API_URL}/api/shop/orderMultiProduct/${storeSlug}`,
                values
            );

            const data = await response.data;
            console.log("test: " + data);
            console.log(data);

            pixelTrack("Purchase", {
                // content_ids: data.items.map((item) => item.id),
                content_type: "product",
                // value: data.total,
                // currency: "MAD",
                // num_items: order.items.length,
                order_id: data.id, // isteğe bağlı ama faydalıdır
            });
            tiktokTrack('Purchase', {
                            contents: 
                            // data.items.map(item => ({
                            //     content_id: item.id,
                            //     content_name: item.name,
                            // })),
                             [
                                            {
                                                content_id: data.id,
                                                // content_name: 'product',
                                            }
                                        ],
                            // value: data.total,
                            // currency: "MAD",
                        });

            // if (response.status === 200) { // Axios uses response.status instead of response.ok
            message.success(t('Order placed successfully!'));
            // console.log(data);
            setOrderLoading(false);
            // setDrawerVisible(false);
            dispatch(clearCart());
            window.scrollTo(0, 0);
            navigate(`/orderconfirmed/${data.order_code}`);
            // } else {
            //     message.error(data.message || 'Failed to place order');
            // }
        } catch (error) {
            setOrderLoading(false);
            // setDrawerVisible(false);

            console.error('Error placing order:', error);
            message.error('An error occurred while placing your order');
        }
    };

    // const onSubmit = () => {
    //     console.log('Sipariş tamamlandı');
    //     navigate("/newstore/orderconfirmed/155255");
    // }
    const orderDisabled = cart.cartTotalQuantity == 0 ? true : false;
    return (
        <div>
            <Header2 store={store} />
            <div className="container mx-auto px-4 py-8 md:px-20">
                <Helmet>
                    <title>{`${store.name} | Order Page | Magyon`}</title>
                    <meta name="description" content={store.description} />

                    {/* GA Script */}
                    <script async src={`https://www.googletagmanager.com/gtag/js?id=${store.google_analytics}`} />

                    {/* gtag setup */}
                    <script>
                        {`
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', '${store.google_analytics}');
                    `}
                    </script>

                    {/* Facebook Pixel Script */}
                    <script type="text/javascript">
                        {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${store.meta_pixel_id}');
            
          `}
                    </script>

                    {/* Facebook Pixel Noscript */}
                    <noscript>
                        {`<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${store.meta_pixel_id}&ev=PageView&noscript=1"
          />`}
                    </noscript>

                    <script>
                {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++){ttq.setAndDefer(ttq,ttq.methods[i])};
  ttq.load=function(e,n){
    var i="https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i=ttq._i||{};
    ttq._i[e]=[];
    ttq._i[e]._u=i;
    ttq._t=ttq._t||{};
    ttq._t[e]=+new Date;
    ttq._o=ttq._o||{};
    ttq._o[e]=n||{};
    var o=document.createElement("script");
    o.type="text/javascript";
    o.async=true;
    o.src=i+"?sdkid="+e+"&lib="+t;
    var a=document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(o,a);
  };

  ttq.load('${store.tiktok_pixel_id}');
  ttq.page();
}(window, document, 'ttq');
`}
            </script>

                    <meta property="og:title" content={store.name + " | Magyon"} />
                    <meta property="og:description" content={store.description} />
                    <meta property="og:image" content={`${API_URL}${store.logo_path} `} />
                    <meta property="og:url" content={`https://magyon.com/${store.slug}/order`} />
                    <meta property="og:type" content="website" />

                </Helmet>
                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sol Taraf: Siparişlerim ve Tablo */}
                    <div>
                        <h1 className="text-2xl font-bold mb-6">{t('Order details')} </h1>
                        <Table
                            columns={columns}
                            dataSource={cart.cartItems}
                            pagination={false}
                            rowKey="id"
                            footer={() => (
                                <div className="flex flex-col items-end justify-end font-bold text-lg">
                                    {/* delivery */}
                                    <div className="">{t('Delivery')}: {deliveryPrice} DH</div>
                                    <div className="">{t('Total')}: {cart.cartTotal + deliveryPrice} DH</div>

                                </div>
                            )}
                        />
                    </div>

                    {/* Sağ Taraf: Sipariş Bilgileri Formu */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">{t('Order information')}</h2>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Form className='w-full'
                                layout="vertical"
                                onFinish={onFinish} >
                                <Form.Item
                                    label={t('Full Name')}
                                    name="fullName"
                                    rules={[{ required: true, message: t('Please enter your full name') }]}
                                >
                                    <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your full name')} />
                                </Form.Item>
                                <Form.Item
                                    label={t('Email')}
                                    name="email"
                                    rules={[{ required: false, message: t('Please enter your email') }]}
                                >
                                    <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your email')} />
                                </Form.Item>
                                <div className="flex flex-row justify-between gap-3">
                                    <Form.Item
                                        className='w-full'
                                        label={t('City')}
                                        name="city"
                                        rules={[{ required: true, message: t('Please enter your city') }]}
                                    >
                                        {deliveryCities.length > 0 ? (
                                            <>
                                                <Select className='rounded-2xl border-cyan-700'
                                                    showSearch
                                                    placeholder={deliveryCities.length === 0 ? t('Loading cities...') : t('Select city')}
                                                    loading={deliveryCities.length === 0} // Antd'de loading durumu
                                                    filterOption={(input, option) => {
        const inputNormalized = input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '');

        const optionNormalized = (option?.title ?? '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '');

        return optionNormalized.includes(inputNormalized);
    }}
    filterSort={(optionA, optionB) => {
        const normalize = (str) =>
            str
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '');

        return normalize(optionA?.title).length - normalize(optionB?.title).length;
    }}
                                                >
                                                    {deliveryCities.map((value, index) => (
                                                        <Select.Option
                                                            key={index} // veya value.id gibi bir unique değer
                                                            value={value}
                                                            title={value}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {value}
                                                            </div>
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </>

                                        ) :
                                            (
                                                <>

                                                    <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your city')} />

                                                </>
                                            )
                                        }
                                    </Form.Item>
                                    {/* <Form.Item
                                        className='w-full'
                                        label="Region"
                                        name="region"
                                        rules={[{ required: false, message: 'Please enter your region' }]}
                                    >
                                        <Input className='rounded-2xl border-cyan-700' placeholder="Enter your region" />
                                    </Form.Item> */}
                                </div>

                                <Form.Item
                                    label={t('Address')}
                                    name="address"
                                    rules={[{ required: true, message: t('Please enter your address') }]}
                                >
                                    <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your address')} />
                                </Form.Item>
                                <div className="flex flex-row justify-between gap-3">
                                    <Form.Item
                                        className='w-full'
                                        label={t('Phone')}
                                        name="phone"
                                        rules={[{ required: true, message: t('Please enter your phone number') }]}
                                    >
                                        <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your phone number')} />
                                    </Form.Item>
                                    <Form.Item
                                        className='w-full'
                                        label={t('Whatsapp')}
                                        name="whatsapp"
                                        rules={[{ required: false, message: t('Please enter your Whatsapp number') }]}
                                    >
                                        <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your Whatsapp number')} />
                                    </Form.Item>
                                </div>
                                <Button
                                    // type="primary" 
                                    htmlType="submit" className="w-full rounded-2xl font-bold bg-green-600 text-white"
                                    loading={orderLoading}
                                >
                                    {t('Order')}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer store={store} />
        </div>
    );
};

export default Order;