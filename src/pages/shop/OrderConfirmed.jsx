import React, { useEffect, useRef, useState } from 'react';
import { Steps, Button, Result, Spin, message, Modal, Timeline, Card, Tag, Tour } from 'antd';
import { useNavigate, useParams } from 'react-router-dom'; // React Router kullanıyorsanız
import Footer from '../../components/client/Footer';
import Header2 from '../../components/client/Header2';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { ShoppingOutlined, EnvironmentOutlined, CarOutlined, InfoCircleOutlined, EyeOutlined, WhatsAppOutlined, CheckCircleFilled, CheckSquareOutlined, LikeFilled, CheckOutlined } from '@ant-design/icons';
import CustomerOrderModal from '../../components/client/CustomerOrderModal';
import PaymentOptionModal from '../../components/client/PaymentOptionModal';

const { Step } = Steps;
const API_URL = import.meta.env.VITE_API_URL;

const OrderConfirmed = () => {
    const navigate = useNavigate(); // React Router ile yönlendirme için
    const [store, setStore] = useState(null);
    const [order, setOrder] = useState(null);
    const storeSlug  = import.meta.env.VITE_STORE_SLUG;
    const { orderCode } = useParams();
    const [loading, setLoading] = useState(true);

    const [paymentModal, setPaymentModal] = useState(false);

        const [tourVisible, setTourVisible] = useState(false);
        const confirmWhatsappRef = useRef(null);



    
useEffect(() => {
    if (
        order?.status_id == 1 &&
        store?.ecommerce_orders?.[0] &&
        store?.chari_payment_active &&
        !store.ecommerce_orders[0].payment_option_asked
    ) {
        setPaymentModal(true);
    }
}, [store]);


    const [orderModal, setOrderModal] = useState(false);

    const { t } = useTranslation();

    // ... (mevcut state'ler)
const [isModalVisible, setIsModalVisible] = useState(false);
const [trackingData, setTrackingData] = useState([]);
const [trackingLoading, setTrackingLoading] = useState(false);

const handleTrackOrder = async () => {
    setIsModalVisible(true);
    setTrackingLoading(true);
    const parcelCode = store?.ecommerce_orders[0]?.delivery_tracking_code;

    
    try {
        console.log(parcelCode+'5555555');
        
        const response = await fetch(`https://api.ameex.app/web/Tracking?ParcelCode=${parcelCode}`);
        const data = await response.json();
        
        if (data.api.type === "success") {
            // API'den gelen objeyi diziye çevirip tarihe göre ters çeviriyoruz (En yeni en üstte)
            const trackingArray = Object.values(data.api.tracking).reverse();
            setTrackingData(trackingArray);
        } else {
            message.error(t('Tracking information not found'));
        }
    } catch (error) {
        console.error('Tracking Error:', error);
        message.error(t('Error fetching tracking data'));
    } finally {
        setTrackingLoading(false);
    }
};

    // const orderCode = order?.order_code && "";


    // Şu anki adım (örnek olarak 1. adımda olduğunu varsayalım)
    const [currentStep, setCurrentStep] = useState(1);
    // Sipariş adımları
    const steps = [
        {
            title: t('Order Received'),
            description: t('Your order has been successfully received.'),
        },
        {
            title: currentStep === 10 ? t("Canceled") : t('Processing'),
            description: currentStep === 10 ? "" : t('Your order is being prepared.'),
        },
        {
            title: currentStep === 10  ? "" : t('Shipped'),
            description: currentStep === 10  ? "": t('Your order has been shipped.'),
        },
        {
            title: currentStep === 11 ? t("Returned") : (currentStep === 10 ? "" : t('Delivered')),
            description: currentStep === 11 ? "" : (currentStep === 10 ? "" : t('Your order has been delivered.')),
        },
    ];



    const stepsTour = [
        {
            title: t('Order confirmation'),
            description: t('Click this button to confirm your order via WhatsApp.'),
            target: () => confirmWhatsappRef.current, 
        },
    ];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`${API_URL}/api/shop/getOrder/${storeSlug}/${orderCode}`);
                const data = await response.json();
                // console.log(data);
                if (response.status === 404 || !data.ecommerce_orders || data.ecommerce_orders.length === 0) {
                    message.error(data.message || t('Order not found'));
                    const storeName = data.slug || '';
                    navigate('/' + storeName);
                } else {
                    setLoading(false);
                    setStore(data);
                    setOrder(data.ecommerce_orders[0]);
                    // currentStep = order.status_id-1;
                    setCurrentStep(data.ecommerce_orders[0]?.status_id == 7 || data.ecommerce_orders[0]?.status_id == 3  ? 
                        (data.ecommerce_orders[0]?.status_id == 3 ? 2 : 1) : 
                        (data.ecommerce_orders[0]?.status_id == 2 || data.ecommerce_orders[0]?.status_id == 4 ? 
                            (data.ecommerce_orders[0]?.status_id == 2? 10 : 11) : data.ecommerce_orders[0]?.status_id-1));
                }
                // setLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                // setError('Error fetching product');
                message.error('Error fetching order');

            }
        };

        if(order?.status_id==1 && !(
        store?.ecommerce_orders?.[0] &&
        store?.chari_payment_active &&
        !store.ecommerce_orders[0].payment_option_asked
    )
&&
store.whatsapp_number
){
            setTourVisible(true); 
        }

        fetchOrder();
    }, [storeSlug, orderCode, navigate, currentStep]);


    if (loading) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    return (
        <div>
            <Header2 store={store} />
            <div className="container mx-auto px-4 py-8 md:px-20">
                <Helmet>
                    <title>{store.name} | Order Confirmed {orderCode} | Magyon</title>
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
                    <meta property="og:url" content={`https://magyon.com/${store.slug}/orderconfirmed/${orderCode}`} />
                    <meta property="og:type" content="website" />
                </Helmet>
                {/* Sipariş Onay Mesajı */}
                <Result
                    status={currentStep === 10 || currentStep === 11 ? "error" :"success"}
                    title={t('Your Order Has Been Successfully Received!') }
                    // subTitle={`Your order number: ${order?.order_code}. Your order will be shipped as soon as possible.`}
                    subTitle={t("confirmedOrderMessage", { orderCode })}

                // extra={[
                //     <Button
                //         type="primary"
                //         key="home"
                //         onClick={() => navigate('/')} // Ana sayfaya yönlendir
                //     >
                //         Ana Sayfaya Dön
                //     </Button>,
                // ]}
                />
                { order.delivery_company_id == 4 &&

                    <div className="flex flex-col md:flex-row justify-center items-center gap-2"><p className=" flex flex-col  md:flex-row items-center gap-1 text-center text-lg">{t('Your order has been shipped with',{company:"Ameex"})}
                    
                    </p> 
                    <Button className='bg-red-700- p-2 text-white rounded-xl font-bold'
                    style={{ background: store.color_1 }}
                    onClick={handleTrackOrder}>
                        {order.deliveryCompany && <div>
                                {/* ( {deliveryCompany.name} ) */}
                                <img src={order.deliveryCompany.logo_path} className='bg-white rounded-md min-w-6 min-h-6 w-6 h-6  object-contain ' title={order.deliveryCompany.name} />
                            </div>}
                        {t('track order')}</Button></div>
                }
{ (order.status_id == 1 && store.whatsapp_number) && 
                <div className="flex justify-center mt-4">
    <Button
    ref={confirmWhatsappRef}
    className='animate-shake '
        icon={<WhatsAppOutlined className='text-2xl' />}
        onClick={() => {
            // const message = `Bonjour ${store.name},\nJe souhaite confirmer ma commande portant le code ${orderCode}. Merci d'avance.`;

            const message = t("Hello ${store.name},\nI would like to confirm my order with the code ${orderCode}. Thank you in advance.", {
        store: store.name,
        code: orderCode
    });

            const whatsappUrl = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(message+" \u2705")}`;

            window.open(whatsappUrl, "_blank");
        }}
        style={{
            background: "#25D366",
            border: "none",
            color: "#fff",
            fontWeight: 800,
            height: 46,
            boxShadow: "0 8px 20px rgba(37, 211, 102, 0.30)",
        }}
    >
        {t("Confirm my order")} <CheckOutlined className='text-2xl' />
        {/* <CheckSquareOutlined /> */}
        {/* <LikeFilled /> */}
    </Button>
</div> }

                <div className="flex justify-center mt-4">
    <Button
    icon={<EyeOutlined />}
    onClick={() => setOrderModal(true)}
    style={{
        background: "linear-gradient(135deg, #4b5563 0%, #6b7280 55%, #9ca3af 100%)",
        border: "none",
        color: "#fff",
        fontWeight: 700,
        height: 46,
        boxShadow: "0 8px 20px rgba(75, 85, 99, 0.30)",
    }}
>
    {t("Order Details")}
</Button>
</div>

                {/* Sipariş Adımları */}
                <div className="flex md:hidden justify-center items-center mt-8">
                    <Steps
                        current={currentStep}
                        direction="vertical" // Mobilde dikey
                        responsive={false} // Responsive özelliğini devre dışı bırak
                        className="ml-16 w-full md:max-w-3xl md:direction-horizontal" // Bilgisayarda yatay
                    >
                        {steps.map((step, index) => (
                            <Step key={index} title={step.title} description={step.description} />
                        ))}
                    </Steps>
                </div>
                <div className="hidden md:flex justify-center items-center mt-8 mb-16">
                    <Steps
                        current={currentStep}
                        // direction="vertical" // Mobilde dikey
                        responsive={false} // Responsive özelliğini devre dışı bırak
                    // className="ml-16 w-full md:max-w-3xl md:direction-horizontal" // Bilgisayarda yatay
                    >
                        {steps.map((step, index) => (
                            <Step key={index} title={step.title} description={step.description} />
                        ))}
                    </Steps>
                </div>
            </div>
            <Footer store={store} />



            <Modal
    title={<div className="text-lg font-bold">{t('Suivi de Colis')}</div>}
    open={isModalVisible}
    onCancel={() => setIsModalVisible(false)}
    footer={null}
    width={600}
    bodyStyle={{ backgroundColor: '#f5f5f5', padding: '20px' }}
>
    <div className="mb-4 p-2 bg-white rounded shadow-sm border-l-4" style={{ borderColor: store.color_1 }}>
        <span className="text-gray-500 text-sm">Code: </span>
        <span className="font-mono font-bold">{store?.ecommerce_orders[0]?.delivery_tracking_code}</span>
    </div>

    {trackingLoading ? (
        <div className="flex justify-center p-10"><Spin /></div>
    ) : (
        <Timeline mode="left">
            {trackingData.map((item, index) => (
                <Timeline.Item 
                    key={index} 
                    dot={<div style={{ backgroundColor: item.statut_color, width: 12, height: 12, borderRadius: '50%', border: '2px solid white', boxShadow: '0 0 4px rgba(0,0,0,0.2)' }} />}
                >
                    <Card className="mb-4 shadow-sm border-0" size="small">
                        <div className="flex justify-between items-start mb-2">
                            <Tag color={item.statut_color} style={{ borderRadius: '12px', fontWeight: 'bold' }}>
                                {item.statut_name}
                            </Tag>
                            <span className="text-xs text-gray-400">{item.time_str}</span>
                        </div>

                        {item.city_name && (
                            <div className="mb-2">
                                <Tag icon={<EnvironmentOutlined />} className="border-0 bg-gray-100">
                                    {t('Ville')}: {item.city_name}
                                </Tag>
                            </div>
                        )}

                        {item.data_list && item.data_list.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {item.data_list.map((info, idx) => (
                                    <Tag key={idx} className="bg-blue-50 border-blue-100 text-blue-700">
                                        <span className="text-xs">{info.title}: </span>
                                        <span className="font-bold">{info.value}</span>
                                    </Tag>
                                ))}
                            </div>
                        )}

                        {item.comment && (
                            <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-gray-600 flex items-start gap-2">
                                <InfoCircleOutlined className="mt-1 text-blue-400" />
                                <div dangerouslySetInnerHTML={{ __html: item.comment }} />
                            </div>
                        )}
                    </Card>
                </Timeline.Item>
            ))}
        </Timeline>
    )}
</Modal>

<CustomerOrderModal
    isModalOpen={orderModal}
    setIsModalOpen={setOrderModal}
    order={store?.ecommerce_orders?.[0]}
/>

<PaymentOptionModal
    open={paymentModal}
    setOpen={setPaymentModal}
    setLoadingPage={setLoading}
    setTourVisible={setTourVisible}
    order={store?.ecommerce_orders?.[0]}
    discount={store?.chari_payment_discount}
    storeChariNumber={store?.chari_payment_number}
/>

<style>
    {`
      .my-tour .ant-tour-footer {
        display: none !important;
      }
        :where(.css-dev-only-do-not-override-142vneq).ant-tour .ant-tour-inner .ant-tour-footer .ant-tour-buttons .ant-btn {
    display: none !important;    
}
    :where(.css-142vneq).ant-tour .ant-tour-inner .ant-tour-footer .ant-tour-buttons .ant-btn {
    display: none !important; 
    }
    `}
  </style>

<Tour 

                open={tourVisible}
                onClose={() => setTourVisible(false)}
                // rootClassName="my-tour"
                steps={stepsTour}
                placement='top'
               

                actionsRender={() => null}
                onFinish={() => {
    const message = t(
      "Hello ${store.name},\nI would like to confirm my order with the code ${orderCode}. Thank you in advance.",
      {
        store: store.name,
        code: orderCode,
      }
    );

    const whatsappUrl = `https://wa.me/${
      store.whatsapp_number
    }?text=${encodeURIComponent(message + " \u2705")}`;

    window.open(whatsappUrl, "_blank");

    setOpen(false);
  }}
            />

        </div>



    );
};

export default OrderConfirmed;