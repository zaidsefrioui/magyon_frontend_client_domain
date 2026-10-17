import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Button, Input, Form, Select, Divider, Spin, message, Carousel, Image } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header2 from '../../components/client/Header2';
import Footer from '../../components/client/Footer';
import { addProduct, clearCart } from '../../redux/shopCartSlice';
import { useDispatch } from 'react-redux';
// CaretLeftOutlined
import { CaretDownOutlined, CaretLeftOutlined, EditFilled, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import InstagramReelModal from '../../components/client/InstagramReelModal';
import { pixelTrack } from '../../utils/fbpixel';
import { tiktokTrack } from '../../utils/tiktokPixel';

import "react-quill/dist/quill.snow.css";

import DOMPurify from "dompurify";
import PackProducts from '../../components/client/PackProducts';
import OtherColors from '../../components/client/OtherColors';
import ProductPacks from '../../components/client/ProductPacks';
import ProductPacksAdditionalPage from '../../components/client/PackProductsAdditional';
import AutoScrollList from '../../components/client/AutoScrollList';
import { useAuth } from '../../context/AuthContext';
import ProductCarousel from '../../components/client/ProductCarousel';
import TiktokPixelHelmet from '../../components/TiktokPixelHelmet';


const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL;



const ProductPage = () => {
    const storeSlug  = import.meta.env.VITE_STORE_SLUG;
    const [selectedSize, setSelectedSize] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [product, setProduct] = useState(null);
    const [product2, setProduct2] = useState(null);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSizeError, setShowSizeError] = useState(false);
    const [quantity, setQuantity] = useState(1); // State for quantity
    const orderFormRef = useRef(null);
    const addProductRef = useRef(null);
    const productNameRef = useRef(null);
    const carouselRef = useRef(null);
    const sizeSectionRef = useRef(null);
    const packProductsRef = useRef(null);
    const { productSlug } = useParams();
    const navigate = useNavigate();

    const [deliveryPrice,setDeliveryPrice] = useState(0);

    const [orderLoading, setOrderLoading] = useState(false);

    const [packProducts, setPackProducts] = useState({});
    const [PackProductsAdditional, setPackProductsAdditional] = useState({});
    const [additionalTotalPrice, setAdditionalTotalPrice] = useState(0);

    const [storeAdmin, setStoreAdmin] = useState(false);
        const { currentStore } = useAuth();

        
    const sectionRefs = useRef([]);
    const scrollToNext = (index) => {
    const next = sectionRefs.current[index+1];
    next.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest"
});

};
    
    const fetchStoreAdmin = async () => {
        
        try {
            // console.log(currentStore);
            
                const response = await axios.get(`${API_URL}/api/shop/adminControl/${storeSlug}`, {
  params: { currentStore }
});
            //   console.log(response.data);
              if(response.data)
              setStoreAdmin(true);
              

        } catch (error) {
            // console.log(error);

        }
    }

useEffect(() => {
    if(currentStore)
        fetchStoreAdmin();
    }, [product]);
    
const productQuantity = (product) => {
        if(product.quantity>0) return product.quantity;
        if (!product.product_sizes) return 0;
        return product.product_sizes.reduce((sum, size) => sum + size.quantity, 0);
        
    };


    const { t } = useTranslation();

    const [selectedProductInstagramReelLink, setSelectedProductInstagramReelLink] = useState(null);
    const [isModalVisibleInstagramReel, setIsModalVisibleInstagramReel] = useState(false);



    const showModalInstagramReel = (p) => {
        setSelectedProductInstagramReelLink(p.instagram_reel_link);
        setIsModalVisibleInstagramReel(true);
    };
    const handleInstagramReelModalCancel = () => {
        setIsModalVisibleInstagramReel(false);
        setSelectedProductInstagramReelLink(null);
    };


    const dispatch = useDispatch();

    const [deliveryCities, setDeliveryCities] = useState(1);
    const fetchDeliveryCities = async () => {
        try {
            // console.log(store?.delivery_company_id );
            
            if (store?.delivery_company_id == 2) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/cathedis-cities`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            } else if (store?.delivery_company_id == 3) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/ozon-express-cities`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            } else if (store?.delivery_company_id == 4) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/ameex-cities/${store.id}`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            }

        } catch (error) {
            console.log(error);

        }
    }

    

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/api/shop/getProduct/${storeSlug}/${productSlug}`);
                const data = await response.json();

                if (response.status === 404) {
                    message.error(data.message);
                    navigate('/');
                } else {
                    setStore(data);                                        
                    setProduct(data.products[0]);
                    pixelTrack("ViewContent", {
                        content_name: data.products[0]?.name,
                        content_ids: [data.products[0]?.id],
                        content_type: "product",
                        // value: product.price,
                        // currency: "MAD",
                    });
                    tiktokTrack("ViewContent", {
                        contents: [
                            {
                                content_id: data.products[0]?.id,
                                content_name: data.products[0]?.name,
                            }
                        ],
                        value: data.products[0]?.price,
                        currency: "MAD",
                    });
                }
                setLoading(false);


                //                 const response2 = await fetch(`${API_URL}/api/shop/getProductAdditonal/${storeSlug}/${productSlug}`);
                // const data2 = await response2.json();
                // additonalProductFetch(data2.product[0]);
                // setProduct2(data2.product[0]);


            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Error fetching product');
                message.error('Error fetching product');
            }
        };

        fetchProduct();
    }, [storeSlug, productSlug, navigate]);

    useEffect(() => {
        fetchDeliveryCities();
        // console.log(store?.otherColors);
        console.log(store);
        if(product?.pack)
                    productNameRef.current.scrollIntoView({ behavior: 'smooth' });
        
    }, [store]);

useEffect(() => {
    const fetchProduct = async () => {
        try {
            const response = await fetch(`${API_URL}/api/shop/getProductAdditional/${storeSlug}/${productSlug}`);
            const data = await response.json();
            // console.log(data);

            if (response.status === 404) {
                message.error(data.message);
            } else if (data?.products && data.products.length > 0) {
                console.log(data.products[0]);
                
                additonalProductFetch(data.products[0]);
                setProduct2(data.products[0]);
            } else {
                console.warn('Product data is empty or undefined');
                message.warning('Product data is not available');
                //navigate
                navigate(`/${storeSlug}`);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Error fetching product');
            message.error('Error fetching product');
        }
    };

    fetchProduct();
}, [product]);




    const getPackProduct = async (id) => {
        try {
            const response = await fetch(`${API_URL}/api/shop/getPackProduct/${storeSlug}/${id}`);
            const data = await response.json();
            const product = data.products[0];

            // console.log(data);

            if (response.status === 404) {
                return null;
            } else {
                return product;
            }

        } catch (error) {
            return null;
        }
    };

    const additonalProductFetch = (p) => {


console.log(p.pack_products.length);

        // if (p?.pack) {
            const fetchAll = async () => {
                const all = {};

                const selectedProducts = new Set();

                for (let i = 0; i < p.pack_products.length; i++) {
                    const list = p.pack_products[i];

                    const products = await Promise.all(
                        list.product_ids.map(async (id, key) => {
                            const p1 = await getPackProduct(id);
                            if (!p1) return null;

                            // Eğer ürün daha önce seçilmişse tekrar seçilmesin
                            let isSelected = false;
                            let stockOut = false;

                            if(p1.product_sizes.length>0){
                                let q = 0;
                                p1.product_sizes.map((s)=>{
q=q+s.quantity;
                                });
                                if(q==0){
                                    stockOut=true;
                                }

                            } else if(p1.quantity==0){
                                                                    stockOut=true;
                            }

                            if (!selectedProducts.has(id)) {
                                // İlk ürün için selected verelim (eğer size seçimi yoksa)
                                if (key === 0 && p1.product_sizes.length === 0) {
                                    // isSelected = true;
                                    // selectedProducts.add(id); // artık seçildi
                                }
                            }

                            const r = {
                                ...p1,
                                selected: p1.quantity>0 ? isSelected : false,
                                selectedSize: null,
                                hidden: false,
                                stockOut
                            };

                            return r;
                        })
                    );

                    all[i] = products.filter(Boolean); // null olanları çıkar
                }

                setPackProductsAdditional(all);
                // console.log(all);

            };

            fetchAll();
        // }

    }

    useEffect(() => {
        if (product?.pack) {
            const fetchAll = async () => {
                const all = {};

                const selectedProducts = new Set();

                for (let i = 0; i < product.pack_products.length; i++) {
                    const list = product.pack_products[i];

                    const products = await Promise.all(
                        list.product_ids.map(async (id, key) => {
                            const p = await getPackProduct(id);
                            if (!p) return null;

                            // Eğer ürün daha önce seçilmişse tekrar seçilmesin
                            let isSelected = false;
                            let stockOut = false;

                            if(p.product_sizes.length>0){
                                let q = 0;
                                p.product_sizes.map((s)=>{
q=q+s.quantity;
                                });
                                if(q==0){
                                    stockOut=true;
                                }

                            } else if(p.quantity==0){
                                                                    stockOut=true;
                            }

                            if (!selectedProducts.has(id)) {
                                // İlk ürün için selected verelim (eğer size seçimi yoksa)
                                if (key === 0 && p.product_sizes.length === 0) {
                                    if(list.product_ids.length===1){
                                        isSelected = true;
                                        selectedProducts.add(id); // artık seçildi

                                    }
                                }
                            }

                            const r = {
                                ...p,
                                selected: p.quantity>0 ? isSelected : false,
                                selectedSize: null,
                                hidden: false,
                                stockOut
                            };

                            return r;
                        })
                    );

                    all[i] = products.filter(Boolean); // null olanları çıkar
                }

                setPackProducts(all);
                // console.log(all);

            };

            fetchAll();
        }

    }, [product]);

    useEffect(() => {
        // console.log(store);
        setCurrentImageIndex(0);
        
           setDeliveryPrice(( store?.free_delivery_from > 0 && ((((product?.sale_price || product?.price)*quantity)+additionalTotalPrice) >= store?.free_delivery_from )) ? 0 : store?.delivery_price); 
        },[store,product,quantity,additionalTotalPrice]);

    // Check if the product is out of stock
    const isOutOfStock = product?.pack
        ? false // pack ise stok kontrolü yok, her zaman false
        : product?.product_sizes?.length > 0
            ? product.product_sizes.every(size => size.quantity <= 0) // Tüm boyutların quantity'si 0 ise
            : product?.quantity <= 0; // Boyut yoksa ve ürünün quantity'si 0 ise

    // Calculate available quantity
    const availableQuantity = product?.product_sizes?.length > 0
        ? product.product_sizes.find(size => size.name === selectedSize)?.quantity || 0
        : product?.quantity || 0;

    // Handle quantity increment
    const handleIncrement = () => {
        if (quantity < availableQuantity) {
            setQuantity(quantity + 1);
        }
    };

    // Handle quantity decrement
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (product.product_sizes && product.product_sizes.length > 0 && !selectedSize) {
            setShowSizeError(true);
            sizeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (product.product_sizes && product.product_sizes.length > 0) {
            // console.log('Product added to cart:', product, 'Selected Size:', selectedSize, 'Quantity:', quantity);
            // Add product to cart logic here
            const updatedItem = { ...product, selectedSize };
            dispatch(addProduct(updatedItem));
            pixelTrack('AddToCart', {
                content_ids: [updatedItem.id],
                value: updatedItem.sale_price ? updatedItem.sale_price : updatedItem.price,
                currency: 'MAD',
            });
            tiktokTrack('AddToCart', {
                            contents: [
                                {
                                    content_id: updatedItem.id,
                                    content_name: updatedItem.name,
                                }
                            ],
                            value: updatedItem.sale_price ? updatedItem.sale_price : updatedItem.price,
                            currency: 'MAD',
                        });

        } else {
            // console.log('Product added to cart:', product, 'Quantity:', quantity);
            // const updatedItem = { ...product, selectedSize };
            // dispatch(addProduct(updatedItem));
            dispatch(addProduct(product));
            pixelTrack('AddToCart', {
                content_ids: [product.id],
                value: product.sale_price ? product.sale_price : product.price,
                currency: 'MAD',
            });
            tiktokTrack('AddToCart', {
                    contents: [
                        {
                            content_id: product.id,
                            content_name: product.name,
                        }
                    ],
                    value: product.sale_price ? product.sale_price : product.price,
                    currency: 'MAD',
                });
        }
    };

    const handleOrderNow = () => {
        if (product.product_sizes && product.product_sizes.length > 0 && !selectedSize) {
            setShowSizeError(true);
            sizeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        if(product2?.pack_products?.length>0 )
            addProductRef.current.scrollIntoView({ behavior: 'smooth' });
        else 
        orderFormRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    const handleOrderNow2 = () => {
        if (product.product_sizes && product.product_sizes.length > 0 && !selectedSize) {
            setShowSizeError(true);
            sizeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    
        orderFormRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    const handleOrderPackNow = () => {
if(product2?.pack_products?.length>0 )
            addProductRef.current.scrollIntoView({ behavior: 'smooth' });
        else 
        orderFormRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const onFinishOrderForm = async (values) => {
        if (product.pack) {

            const hasSelected = product.pack_products.every((list, i) =>
                packProducts[i]?.some(p => p.selected)
            );

            console.log(hasSelected);
            if (!hasSelected) {
                packProductsRef.current.scrollIntoView({ behavior: 'smooth' });
                return null;
            }
            const selectedProducts = Object.values(packProducts) // tüm selection arraylerini al
                .flatMap(list =>
                    list
                        .filter(p => p.selected) // sadece seçilenleri al
                        .map(product => ({
                            id: product.id,
                            name: product.name,
                            price: product.sale_price ?? product.price, // sale_price varsa onu kullan
                            size: product.selectedSize,
                            image: product.product_images?.[0]?.path ?? null,
                            quantity: 1,
                        }))
                );

                const selectedProductsAdditional = Object.values(PackProductsAdditional) // tüm selection arraylerini al
                .flatMap(list =>
                    list
                        .filter(p => p.selected) // sadece seçilenleri al
                        .map(product => ({
                            id: product.id,
                            name: product.name,
                            price: product.sale_price ?? product.price, // sale_price varsa onu kullan
                            size: product.selectedSize,
                            image: product.product_images?.[0]?.path ?? null,
                            quantity: 1,
                        }))
                );

            values.packSelectedProducts = selectedProducts;
            values.packSelectedProductsAdditional = selectedProductsAdditional;
            values.additionalTotalPrice = additionalTotalPrice;
        }
        else if(product.additional_products.length>0){
            const selectedProductsAdditional = Object.values(PackProductsAdditional) // tüm selection arraylerini al
                .flatMap(list =>
                    list
                        .filter(p => p.selected) // sadece seçilenleri al
                        .map(product => ({
                            id: product.id,
                            name: product.name,
                            price: product.sale_price ?? product.price, // sale_price varsa onu kullan
                            size: product.selectedSize,
                            image: product.product_images?.[0]?.path ?? null,
                            quantity: 1,
                        }))
                );
            values.packSelectedProductsAdditional = selectedProductsAdditional;
            values.additionalTotalPrice = additionalTotalPrice;
        }
        // return null;
        if (!product.pack && product.product_sizes && product.product_sizes.length > 0 && !selectedSize) {
            setShowSizeError(true);
            sizeSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            return;
        }
        setOrderLoading(true);


        try {
            const sizeParam = selectedSize || 0;
            let response = null;
            if (product.pack) {
                response = await axios.post(`${API_URL}/api/shop/orderPackProduct/${storeSlug}/${product.id}`,
                    values
                );
                // return null;
            } else {
                response = await axios.post(`${API_URL}/api/shop/orderSingleProduct/${storeSlug}/${product.id}/${quantity}/${sizeParam}`,
                    values
                );
            }


            const data = await response.data;
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
        // setSelectedProduct(null);
        // setSelectedSize(null);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        carouselRef.current.goTo(index);
    };

    if (loading) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">{error}</div>;
    }

    if (!product) {
        return null;
    }

    let selectionSelected = false;

    return (
        <div>
            <Header2 store={store} />
            <div className="container mx-auto px-4 py-8 md:px-20">
                <Helmet>
                    <title>{store.name} | Product: {product.name} | Magyon</title>
                    <meta name="description" content={product.description} />

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
                    {/* <TiktokPixelHelmet id={store?.tiktok_pixel_id} /> */}
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

                    <meta property="og:title" content={store.name + " | Product: " + product.name + " | Magyon"} />
                    <meta property="og:description" content={product.description} />
                    <meta property="og:image" content={`${API_URL}${product.product_images[0].path} `} />
                    <meta property="og:url" content={`https://magyon.com/${store.slug}/product/${product.slug}`} />
                    <meta property="og:type" content="website" />


                </Helmet>
                {/* back to store button */}
                <div className="flex justify-between items-center mb-8">
                    <Link to={"/" } className="text-lg font-bold text-gray-800 hover:text-gray
                    800">
                        <CaretLeftOutlined />
                        {t('Back to Store')}

                    </Link>
                </div>
                <Row gutter={[24, 24]}>
                    {/* Product Images */}
                    <Col xs={24} md={12}>
                        <ProductCarousel product={product} index={currentImageIndex}></ProductCarousel>

                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {product.product_images.map((image, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer border-2 rounded-lg ${currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                                        }`}
                                    onClick={() => handleThumbnailClick(index)}
                                >
                                    <img
                                        src={API_URL + image.path}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-auto rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </Col>

                    {/* Product Details */}
                    <Col xs={24} md={12} ref={productNameRef} >
                    {storeAdmin && (
                                            <>
                                            <a target="_blank" className="text-blue-600" 
                                            // onClick={() => navigate("/store/stock/products/edit/"+product.id)}
                                            href={"/store/stock/products/edit/"+product.id}
                                            >
                                             Edit product ({productQuantity(product)}) <EditFilled />
                                            </a>
                                            </>
                                        )}
                        <h1 className="text-3xl font-bold mb-4" >{product.name}</h1>

                        <div className="mb-6">
                            {product.sale_price ? (
                                <>
                                    <span className="text-2xl font-bold text-red-500">
                                        {product.sale_price} DH
                                    </span>
                                    <span className="text-xl line-through text-gray-500 ml-2">
                                        {product.price} DH
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold">
                                    {product.price} DH
                                </span>
                            )}
                        </div>

                        {/* Conditionally render Select Size section */}
                        {product.pack ? (
                            <>
                                <div ref={packProductsRef} className="absolute top-16 right-4">
                                    {product.instagram_reel_link &&
                                        <Button
                                            onClick={() => showModalInstagramReel(product)}
                                            // shape="circle"
                                            icon={<PlayCircleOutlined className="text-white" style={{ fontSize: '24px' }} />}
                                            className="flex items-center justify-center rounded-lg"
                                            style={{
                                                background: 'linear-gradient(-65deg,  #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)',
                                                border: 'none',
                                                width: '90px',
                                                height: '45px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        >Video</Button>
                                    }

                                </div>
                                {product.pack_products.map((list, i) => {
                                    const hasSelected = packProducts[i]?.some(p => p.selected); // en az bir seçili ürün var mı

                                    return (
                                        <>
                                        <div key={i}
                                        ref={(el) => (sectionRefs.current[i+1] = el)} className='py-1'>
                                            {i!=0 &&
                                            (
                                                <div className="flex flex-row justify-center">

                                                    {/* <div className="flex flex-col justify-center items-center font-bold text-center text-red-700 pb-6- py-5 text-6xl w-16 h-16  bg-red-700 text-white rounded-full">+</div> */}
                                                    <PlusOutlined
                                                    onClick={() => scrollToNext(i)}
                                                    className='flex flex-col justify-center items-center font-bold text-center text-red-700 pb-6- py-5 text-7xl w-16 h-16  bg-red-700 text-white rounded-full' />
                                                
                                                </div>
                                            )
                                            }
                                            <div className="py-1 border-4 my-5 rounded-xl  px-2 "
                                              style={{ borderColor: store.color_2 }}
                                            >
                                            <div
                                              

                                            className='w-full text-center degrade-bg py-2 rounded-lg text-white font-bold'
                                            style={{
    background: `linear-gradient(to right, ${store.color_1}, ${store.color_2})` // #06b6d4 = cyan-500
  }}
                                            >
                                                {t("Selection")} {i + 1} : 
                                            </div>

                                            {!hasSelected && (
                                                <div className="text-red-700 font-bold text-xl text-center pt-2 animate-shake">
                                                    {t("You must choose one product")}
                                                </div>
                                            )}

                                            <div>
                                                <AutoScrollList products={packProducts[i]?.length || 0}>
                                                    {packProducts[i]?.map((p) => (
                                                        !p.stockOut && (
                                                            <li
                                                            key={p.id}
                                                            className="min-w-[150px] max-w-[160px] min-h-[200px] cursor-pointer text-center rounded-3xl transition-all  text-black flex flex-col justify-center items-center gap-2"
                                                        >
                                                            <PackProducts
                                                                selection={i}
                                                                product={p}
                                                                packProducts={packProducts}
                                                                setPackProducts={setPackProducts}
                                                            />
                                                        </li>
                                                        ) 
                                                        
                                                    ))}
                                               </AutoScrollList>
                                            </div>
                                              </div>                                      

                                        </div>
                                        
                                                                                    </>
                                    );
                                    
                                })}
                                <div className="text-center font-bold text-2xl pt-5">
                                                                                       Total: {((product.sale_price || product.price) * quantity)  + additionalTotalPrice} DH
                                                                                    </div>
                                <div className="w-full flex justify-center items-center">

                                    <Button
                                        type="default"
                                        size="large"
                                        onClick={handleOrderPackNow}
                                        className="w-[250px]- rounded-2xl text-2xl p-8 bg-green-600 text-white font-bold mt-5 animate-shake"
                                        disabled={isOutOfStock}
                                        
                                    >
                                        {t('Order Now')}
                                    </Button>
                                </div>
                            </>


                        )
                            :
                            (<>
                                {product.product_sizes && product.product_sizes.length > 0 && (
                                    <div
                                        ref={sizeSectionRef}
                                        className={`mb-6 p-4 ${showSizeError && !selectedSize ? 'border border-red-500 rounded-lg' : ''}`}
                                    >
                                        <h3 className="text-lg font-semibold mb-2">{t('Select Size')}</h3>
                                        <div className="flex space-x-2">
                                            {product.product_sizes.map((size, index) => (
                                                <Button
                                                    key={index}
                                                    type={selectedSize === size.name ? 'primary' : 'default'}
                                                    style={
  selectedSize === size.name
    ? {
        background: `linear-gradient(to right, ${store.color_1}, ${store.color_2})`,
        color: 'white'
      }
    : {}
}
                                                    onClick={() => {
                                                        if (size.quantity > 0) {
                                                            setSelectedSize(size.name);
                                                            setShowSizeError(false);
                                                            setQuantity(1); // Reset quantity when size changes
                                                        }
                                                    }}
                                                    className={`rounded-full ${size.quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={size.quantity <= 0}
                                                    
                                                >
                                                    {size.name}
                                                </Button>
                                            ))}
                                        </div>
                                        {showSizeError && !selectedSize && (
                                            <p className="text-red-500 mt-2">{t('Please select a size before proceeding.')} </p>
                                        )}
                                    </div>
                                )}

                                {/* Quantity Section */}
                                <div className="mb-6">
                                    <div className="absolute top-16 right-4">
                                        {product.instagram_reel_link &&
                                            <Button
                                                onClick={() => showModalInstagramReel(product)}
                                                // shape="circle"
                                                icon={<PlayCircleOutlined className="text-white" style={{ fontSize: '24px' }} />}
                                                className="flex items-center justify-center rounded-lg"
                                                style={{
                                                    background: 'linear-gradient(-65deg,  #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)',
                                                    border: 'none',
                                                    width: '90px',
                                                    height: '45px',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            >Video</Button>
                                        }

                                    </div>
                                    {
                                        store?.otherColors.length > 0 && (
                                    <div className="">
                                    {/* {store?.otherColors.map((p) => {
                                      return <div key={p.id}>{p.name}</div>;
                                    })} */}
                                    <OtherColors store={store}
                                    setPackProductsAdditional={setPackProductsAdditional}
                                    setAdditionalTotalPrice={setAdditionalTotalPrice}
                                    />
                                    </div>
                                        )
                                    }
                                    
                                    {isOutOfStock ? (
                                        <p className="text-red-500 font-bold text-3xl">{t('Sold Out')} </p>
                                    ) : ( <div className="">
                                        <h3 className="text-lg font-semibold mb-2">{t('Quantity')} </h3>
                                        <div className="flex items-center space-x-4">
                                            <Button
                                                onClick={handleDecrement}
                                                disabled={quantity <= 1}
                                                className="w-10 h-10 flex items-center justify-center"
                                                style={{
                                                color:'white',
                                                background: `linear-gradient(to top, ${store.color_1}, ${store.color_2})`  // #06b6d4 = cyan-500
                                            }}
                                            >
                                                -
                                            </Button>
                                            <span className="text-xl">{quantity}</span>
                                            <Button
                                                onClick={handleIncrement}
                                                disabled={quantity >= availableQuantity}
                                                className="w-10 h-10 flex items-center justify-center"
                                                style={{
                                                color:'white',
                                                background: `linear-gradient(to top, ${store.color_1}, ${store.color_2})`  // #06b6d4 = cyan-500
                                            }}
                                            >
                                                +
                                            </Button>
                                        </div>
                                        </div>
                                    )}
                                </div>

                                {/* Add to Cart and Order Now Buttons */}
                                <div className="flex space-x-4 mb-6">
                                { !isOutOfStock && 
 <Button
                                        type="primary"
                                        size="large"
                                        onClick={handleAddToCart}
                                        className="w-1/2 rounded-2xl"
                                        disabled={isOutOfStock}
                                        style={{
                                                color:'white',
                                                background: `linear-gradient(to right, ${store.color_1}, ${store.color_2})`  // #06b6d4 = cyan-500
                                            }}
                                    >
                                        {t('Add to Cart')} +
                                    </Button>
                                }
                                   
                                    <Button
                                        type="default"
                                        size="large"
                                        onClick={handleOrderNow}
                                        className="w-1/2 rounded-2xl bg-green-600 text-white font-bold"
                                        disabled={isOutOfStock}
                                    >
                                        {t('Order Now')}
                                    </Button>
                                </div> </>)}


                    </Col>




                       

                    <div className="mb-6 flex flex-col items-center justify-center w-full px-2">
                        <h3 className="text-lg font-semibold mb-2">{t('Description')} </h3>
                        {/* <p className="text-gray-700">{product.description}</p> */}
                        <div
                            className="text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(product.description, {
                                    ADD_TAGS: ["iframe"],
                                    ADD_ATTR: ["class", "style", "allow", "allowfullscreen", "frameborder", "scrolling"]
                                }),
                            }}
                        />
                    </div>
                </Row>
{!isOutOfStock && 
<div className="w-full">


                                {product2?.pack_products?.map((list, i) => {
                                    // const hasSelected = PackProductsAdditional[i]?.some(p => p.selected); // en az bir seçili ürün var mı

                                    return (
                                        <div key={i} className='py-5' ref={addProductRef}>
                                            <div className='w-full text-center degrade-bg-- bg-teal-600 py-2 rounded-lg text-white font-bold'
                                            style={{ background: store.color_2 }}
                                            >
                                                {t("Additional Products")} : 
                                            </div>

                                            {/* {!hasSelected && (
                                                <div className="text-red-700 font-bold text-xl text-center pt-2 animate-shake">
                                                    {t("You must choose one product")}
                                                </div>
                                            )} */}

                                            <div>
                                                <ul className='flex flex-row gap-4 md:w-auto overflow-auto  py-3 '>
                                                    <AutoScrollList products={PackProductsAdditional[i]?.length || 0}>
                                                    {PackProductsAdditional[i]?.map((p) => (
                                                        !p.stockOut && (
                                                            <li
                                                            key={p.id}
                                                            className="min-w-[150px] max-w-[160px] min-h-[200px] cursor-pointer text-center rounded-3xl transition-all  text-black flex flex-col justify-center items-center gap-2"
                                                        >
                                                            
                                                            <ProductPacksAdditionalPage
                                                                selection={i}
                                                                product={p}
                                                                PackProductsAdditional={PackProductsAdditional}
                                                                setPackProductsAdditional={setPackProductsAdditional}
                                                                additionalTotalPrice={additionalTotalPrice}
                                                                setAdditionalTotalPrice={setAdditionalTotalPrice}
                                                            />
                                                        </li>
                                                        ) 
                                                        
                                                    ))}
                                                    </AutoScrollList>
                                                </ul>
                                            </div>
                                            <div className="flex justify-center">

                                            <Button
                                        type="default"
                                        size="large"
                                        onClick={handleOrderNow2}
                                        className="w-1/2 rounded-2xl bg-green-600 text-white font-bold"
                                        disabled={isOutOfStock}
                                    >
                                        {t('Continue')} <CaretDownOutlined />
                                    </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                                
</div>
}
                

                {(product.product_packs?.length>0 && !product.pack) &&
                    (
                
                    <ProductPacks storeSlug={storeSlug} productPacks={product.product_packs} color_2={store.color_2}/>
                )
                    
                }

                {/* Order Details and Form */}
                {!isOutOfStock && (
                    <>
                        <Divider />
                        <div className='md:px-8 flex md:flex-row flex-col justify-between gap-8' ref={orderFormRef}>
                            <div className={`md:w-1/2 
                            md:max-h-max
                            p-8 border-2 border-cyan-600 rounded-xl`}
                              style={{ borderColor: store.color_2 }}

                            
                            >
                                <h3 className="text-lg font-semibold mb-2">{t('Order Details')} </h3>
                                <div className="flex flex-col justify-between gap-5">
                                    <div className='flex flex-col gap-5 mt-5'>
                                        <div className="flex justify-between">
                                            <span>{product.name}</span>
                                            <b>{product.sale_price || product.price} DH</b>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t('Quantity')} </span>
                                            <b>
                                                {quantity > 1 ? (
                                                    <span style={{ color: 'red' }}>X {quantity}</span>
                                                ) : (
                                                    quantity
                                                )}
                                            </b>
                                        </div>
                                        {additionalTotalPrice>0 && (
                                            <div className="flex justify-between ">
                                            <span>{t('Additional Products')} </span>
                                            <b>{additionalTotalPrice} DH</b>
                                        </div>
                                        )}
                                        
                                        <div className="flex justify-between ">
                                            <span>{t('Delivery')} </span>
                                            <b>{deliveryPrice} DH</b>
                                        </div>
                                    </div>

                                    <div className="flex justify-between border-t-2 border-x-cyan-800 pt-5">
                                        <span>{t('Total')}</span>
                                        <b className='text-2xl'>{((product.sale_price || product.price) * quantity) + deliveryPrice + additionalTotalPrice} DH</b>
                                    </div>
                                </div>
                            </div>
                            <div className='md:w-1/2'>
                                <h3 className="text-lg font-semibold mb-4">{t('Order Form')} </h3>
                                <Form className='w-full'
                                    layout="vertical"
                                    onFinish={onFinishOrderForm} >
                                    <Form.Item
                                        label={t('Full Name')}
                                        name="fullName"
                                        rules={[{ required: true, message: t('Please enter your full name') }]}
                                    >
                                        <Input className='rounded-2xl border-cyan-700 py-2' 
                                          style={{ borderColor: store.color_2 }}

                                        placeholder={t('Enter your full name')} />
                                    </Form.Item>
                                    {/* <Form.Item
                                        label={t('Email')}
                                        name="email"
                                        rules={[{ required: false, message: t('Please enter your email') }]}
                                    >
                                        <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your email')} />
                                    </Form.Item> */}
                                    <div className="flex flex-row justify-between gap-3">
                                        <Form.Item
                                            className='w-full'
                                            label={t('City')}
                                            name="city"
                                            rules={[{ required: true, message: t('Please enter your city') }]}
                                        >
                                            {deliveryCities.length > 0 ? (
                                                <>
                                                    <Select className='rounded-2xl border-cyan-700 '
                                                      style={{ borderColor: store.color_2 }}

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
                                                                <div className="flex items-center gap-2 py-3">
                                                                    {value}
                                                                </div>
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </>

                                            ) :
                                                (
                                                    <>

                                                        <Input className='rounded-2xl border-cyan-700 py-2' placeholder={t('Enter your city')} />

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
                                        <Input className='rounded-2xl border-cyan-700 py-2' 
                                          style={{ borderColor: store.color_2 }}
placeholder={t('Enter your address')} />
                                    </Form.Item>
                                    <div className="flex flex-row justify-between gap-3">
                                        <Form.Item
                                            className='w-full'
                                            label={t('Phone')}
                                            name="phone"
                                            rules={[{ required: true, message: t('Please enter your phone number') }]}
                                        >
                                            <Input className='rounded-2xl border-cyan-700 py-2' 
                                              style={{ borderColor: store.color_2 }}
placeholder={t('Enter your phone number')} />
                                        </Form.Item>
                                        <Form.Item
                                            className='w-full'
                                            label={t('Whatsapp')}
                                            name="whatsapp"
                                            rules={[{ required: false, message: t('Please enter your Whatsapp number') }]}
                                        >
                                            <Input className='rounded-2xl border-cyan-700 py-2'
                                              style={{ borderColor: store.color_2 }}
 placeholder={t('Enter your Whatsapp number')} />
                                        </Form.Item>
                                    </div>
                                    <Button
                                        // type="primary" 
                                        htmlType="submit"
                                        className="w-full rounded-2xl font-bold bg-green-600 text-white focus:!bg-green-600 hover:!bg-green-600 focus:!text-white hover:!text-white py-5 mt-3 text-2xl animate-shake"
                                        loading={orderLoading}
                                    >
                                        {t('Order')}
                                    </Button>
                                </Form>
                            </div>
                        </div>

                        <InstagramReelModal
                            visible={isModalVisibleInstagramReel}
                            onCancel={handleInstagramReelModalCancel}
                            reelUrl={selectedProductInstagramReelLink}
                        />
                    </>
                )}
            </div>
            <Footer store={store} />
        </div>
    );
};

export default ProductPage;