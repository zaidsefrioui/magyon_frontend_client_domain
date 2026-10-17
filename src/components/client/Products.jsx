import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Slider, Select, Button, Tooltip, Drawer, Form, Input, Result, Modal, message, Spin } from 'antd';
import { EditFilled, FilterOutlined, MinusOutlined, PlayCircleOutlined, PlusOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useScreenSize from './useScreenSize';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, clearCart } from '../../redux/shopCartSlice';
import axios from 'axios';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import InstagramReelModal from './InstagramReelModal';
import { pixelTrack } from '../../utils/fbpixel';
import { tiktokTrack } from '../../utils/tiktokPixel';

import { useAuth } from '../../context/AuthContext';

const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL;

const getRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/300/200?random=${randomId}`;
};

const Products = ({ products, storeSlug, deliveryFee, freeDeliveryFrom, loadMore, hasMore, delivery_company_id,color_1,color_2 }) => {
    const navigate = useNavigate();
    const { isMdOrLarger } = useScreenSize();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.shopCart);

    const { t } = useTranslation();


    const [filteredProducts, setFilteredProducts] = useState(products || []);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [sortOrder, setSortOrder] = useState('bst');
    const [showFilters, setShowFilters] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductQuantity, setSelectedProductQuantity] = useState(1);
    const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);
    const [selectedProductForCart, setSelectedProductForCart] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    //const [currentPage, setCurrentPage] = useState(1);
    const [selectedProductInstagramReelLink, setSelectedProductInstagramReelLink] = useState(null);
    const [isModalVisibleInstagramReel, setIsModalVisibleInstagramReel] = useState(false);
    const [deliveryPrice,setDeliveryPrice] = useState(0);
    const [storeAdmin, setStoreAdmin] = useState(false);
        const { currentStore } = useAuth();
    
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
    }, [products]);

const productQuantity = (product) => {
        if(product.quantity>0) return product.quantity;
        if (!product.product_sizes) return 0;
        return product.product_sizes.reduce((sum, size) => sum + size.quantity, 0);
        
    };

    const showModalInstagramReel = (p) => {
        setSelectedProductInstagramReelLink(p.instagram_reel_link);
        setIsModalVisibleInstagramReel(true);
    };
    const handleInstagramReelModalCancel = () => {
        setIsModalVisibleInstagramReel(false);
        setSelectedProductInstagramReelLink(null);
    };


    const loadingRef = useRef(false);
    const observerRef = useRef(null);
    const sentinelRef = useRef(null);
    const isLoadingRef = useRef(false); // loading durumu için ref


    const currentPrice = (product) => {
        return product.sale_price ? product.sale_price : product.price;
    }

    const minPrice = Math.min(...(products || []).map(product => currentPrice(product)));
    const maxPrice = Math.max(...(products || []).map(product => currentPrice(product)));

    const uniqueColors = [...new Set((products || []).map(product => product.color?.name).filter(Boolean))];

    const [deliveryCities, setDeliveryCities] = useState(1);
    const fetchDeliveryCities = async () => {
        try {
            if (delivery_company_id == 2) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/cathedis-cities`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            } else if (delivery_company_id == 3) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/ozon-express-cities`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            }
            else if (delivery_company_id == 4) {
                const response = await axios.get(`${API_URL}/api/stores/delivery/ameex-cities/${currentStore}`);
                // console.log(response.data);
                setDeliveryCities(response.data);
            }

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchDeliveryCities();
        setFilteredProducts(products || []);
        setPriceRange([minPrice, maxPrice]);
    }, [products, minPrice, maxPrice]);

    useEffect(() => {
        filterProducts();
    }, [priceRange, selectedCategory, selectedColors, sortOrder, products]);

    const filterProducts = () => {
        let filtered = (products || []).filter(product =>
            currentPrice(product) >= priceRange[0] && currentPrice(product) <= priceRange[1] &&
            (selectedColors.length > 0 ? selectedColors.includes(product.color?.name) : true)
        );

        if (sortOrder === 'bst') {
            filtered.sort((a, b) => a.sorting - b.sorting);
        } else if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(filtered);
    };

    // Intersection Observer ile infinite scroll
    useEffect(() => {
        if (!hasMore) {
            setLoadingMore(false);
            return;
        }

        const handleObserver = async (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !isLoadingRef.current && hasMore) {
                isLoadingRef.current = true;
                setLoadingMore(true);

                try {
                    await loadMore();
                } catch (error) {
                    console.error('Error loading more products:', error);
                } finally {
                    isLoadingRef.current = false;
                    setLoadingMore(false);
                }
            }
        };

        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 0.1,
        });

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        // Cleanup observer on unmount
        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, [hasMore, loadMore]);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleAddToCartClick = (product) => {
        setSelectedProductForCart(product);
        setSelectedSize(null);

        if (product.product_sizes && product.product_sizes.length > 0) {
            setIsAddToCartModalVisible(true);
        } else {
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

    const isButtonDisabled = (product) => {
        return false;
    };

    const showDrawer = (product) => {
        setSelectedProduct(product);

        setDrawerVisible(true);
    };

    const onCloseDrawer = () => {
        setDrawerVisible(false);
        setSelectedSize(null);
    };

    const onFinishOrder = async (values) => {
        setOrderLoading(true);

        try {
            const sizeParam = selectedSize || 0;
            const response = await axios.post(
                `${API_URL}/api/shop/orderSingleProduct/${storeSlug}/${selectedProduct.id}/${selectedProductQuantity}/${sizeParam}`,
                values
            );

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


            message.success(t('Order placed successfully!'));
            setOrderLoading(false);
            setDrawerVisible(false);
            dispatch(clearCart());
            window.scrollTo(0, 0);
            navigate(`/orderconfirmed/${data.order_code}`);
        } catch (error) {
            setOrderLoading(false);
            setDrawerVisible(false);
            message.error(t('An error occurred while placing your order'));
        }
        setSelectedProduct(null);
        setSelectedSize(null);
    };

    const handleSizeSelection = (product) => {
        setSelectedProduct(product);

        setSelectedProductQuantity(1);
        setSelectedSize(null);
        if (product.product_sizes && product.product_sizes.length > 0) {
            setIsSizeModalVisible(true);
        } else {
            showDrawer(product);
        }
    };

    const onFinishSizeModal = () => {
        if (selectedSize && selectedProduct) {
            const updatedItem = { ...selectedProduct, selectedSize };
            setSelectedProduct(updatedItem);

            showDrawer(updatedItem);
        }
        setIsSizeModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsSizeModalVisible(false);
        setSelectedSize(null);
    };

    const selectedProductMaxQuantity = (product) => {
        const availableQuantity = selectedSize == null ?
            product?.quantity
            :
            product?.product_sizes?.find((size) => size.name === selectedSize)?.quantity;

        return availableQuantity;
    };

    const onFinishAddToCart = () => {
        if (selectedSize && selectedProductForCart) {
            const updatedItem = { ...selectedProductForCart, selectedSize };
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
        }
        setIsAddToCartModalVisible(false);
        setSelectedSize(null);
    };

    const handleAddToCartModalCancel = () => {
        setIsAddToCartModalVisible(false);
        setSelectedSize(null);
    };

    const goToProduct = (slug) => {
        window.scrollTo(0, 0);
        navigate(`/product/${slug}`);
    };

    const productSizeQuantity = (productSizes) => {
        if (!productSizes) return 0;
        return productSizes.reduce((sum, size) => sum + size.quantity, 0);
    };

    if (!products || products.length === 0) {
        return (
            <div className="container mx-auto px-4">
                <Result
                    status="404"
                    title={t("Sorry")}
                    subTitle={t("Sorry, no products were found.")}
                />
            </div>
        );
    }

    useEffect(() => {
       setDeliveryPrice(( freeDeliveryFrom > 0 && (((selectedProduct?.sale_price || selectedProduct?.price)*selectedProductQuantity) >= freeDeliveryFrom )) ? 0 : deliveryFee); 
    },[selectedProduct,selectedProductQuantity]);

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t('Products')}</h2>
                <div className="flex items-center space-x-4">
                    <div className="md:hidden">
                        <FilterOutlined className="text-xl cursor-pointer" onClick={toggleFilters} />
                    </div>
                    <Select
                        defaultValue="bst"
                        style={{ width: 120 }}
                        onChange={value => setSortOrder(value)}
                    >
                        <Option value="bst">{t('Best Seller')}</Option>
                        <Option value="asc">{t('Price: Low to High')}</Option>
                        <Option value="desc">{t('Price: High to Low')}</Option>
                    </Select>
                </div>
            </div>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={6} className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                    <div className="bg-white p-4 shadow rounded">
                        <h3 className="font-bold mb-2">{t('Filters')}</h3>
                        <div className="mb-4">
                            <label className="block mb-2">{t('Price Range')}</label>
                            <Slider
                                range
                                min={minPrice}
                                max={maxPrice}
                                defaultValue={[minPrice, maxPrice]}
                                onChange={value => setPriceRange(value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">{t('Color')}</label>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                placeholder={t("Select Color")}
                                onChange={value => setSelectedColors(value)}
                            >
                                {uniqueColors.map(color => (
                                    <Option key={color} value={color}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    backgroundColor: products.find(p => p.color?.name === color)?.color?.color_code ? '#' + products.find(p => p.color?.name === color)?.color?.color_code : '#ccc',
                                                    marginRight: '8px',
                                                    borderRadius: '50%',
                                                }}
                                            />
                                            {t(color)}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={18}>
                    <Row gutter={[16, 16]}>
                        {filteredProducts.map(product => (
                            <Col key={product.id} xs={12} md={6}>
                                <div className="product-item border hover:shadow-lg cursor-pointer transition-all select-none relative p-3 rounded-md">
                                    <div className="product-img relative">
  {(!product.pack) &&
    ((product.quantity < 1) && (productSizeQuantity(product.product_sizes) < 1)) && (
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-600/60 w-full h-16 flex items-center justify-center text-center font-bold text-white z-10">
        {t("Stock out")}
      </div>
    )
  }

  <div className="absolute bottom-2 right-2 z-20">
    {product.instagram_reel_link && (
      <Button
        onClick={() => showModalInstagramReel(product)}
        icon={<PlayCircleOutlined className="text-white" style={{ fontSize: '24px' }} />}
        className="flex items-center justify-center rounded-lg"
        style={{
          background: 'linear-gradient(45deg,  #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)',
          border: 'none',
          width: '35px',
          height: '35px',
        }}
      />
    )}
  </div>

  <img
    onClick={() => goToProduct(product.slug)}
    src={product.product_images[0]?.path ? `${API_URL}${product.product_images[0].path}` : getRandomImage()}
    alt={product.name}
    className={((product.quantity > 0 || productSizeQuantity(product.product_sizes) > 0) || product.pack)
      ? "h-[200px] md:h-[300px] w-full object-cover rounded-md"
      : "h-[200px] md:h-[300px] w-full object-cover rounded-md grayscale"}
    loading="lazy"
  />
</div>

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
                                    <div
                                    onClick={() => goToProduct(product.slug)}
                                    className="product-info flex flex-col p-3">
                                        
                                        <span className="font-bold">{product.name} </span>
                                        
                                        <span>
                                            {product.sale_price ? (
                                                <>
                                                    <span className="line-through text-gray-500 mr-2 text-xs">
                                                        {product.price} DH
                                                    </span>
                                                    <span className="text-red-500 font-bold">
                                                        {product.sale_price} DH
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{product.price} DH</span>
                                            )}
                                        </span>
                                    </div>
                                    
                                    {(product.pack) ? (
                                        <div className="w-full">
                                            <Button
                                                onClick={() => goToProduct(product.slug)}
                                                className="flex items-center justify-center rounded-2xl w-full  bg-sky-800-- degrade-bg--  text-white font-bold "
                                                style={{
    background: `linear-gradient(to right, ${color_1}, ${color_2})` // #06b6d4 = cyan-500
  }}
                                            >
                                                Pack 
                                            </Button>
                                        </div>
                                    ) : ((product.quantity > 0 || productSizeQuantity(product.product_sizes) > 0 ) ? (
                                        <div>
                                            <div className="absolute bottom-14 right-2">
                                                <Tooltip title={t('Add to Cart')} color="#2563eb" >
                                                    <Button
                                                        onClick={() => handleAddToCartClick(product)}
                                                        type="primary"
                                                        shape="circle"
                                                        icon={<PlusOutlined />}
                                                        className="flex items-center justify-center bg-sky-800 text-white"
                                                        disabled={isButtonDisabled(product)}
                                                        style={{
    background: `linear-gradient(to left, ${color_1}, ${color_2})` // #06b6d4 = cyan-500
  }}
                                                    />
                                                </Tooltip>
                                            </div>
                                            <div className="w-full">
                                                <Button 
                                                    onClick={() => handleSizeSelection(product)}
                                                    className="flex items-center justify-center w-full bg-green-600 font-semibold text-white rounded-2xl"
                                                >
                                                    {t('Order Now')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <Button
                                                disabled
                                                className="flex items-center justify-center rounded-2xl w-full bg-gray-600 text-white "
                                            >
                                                {t('Stock out')}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        ))}
                    </Row>
                    {loadingMore && (
                        <div className="flex justify-center my-4">
                            <Spin />
                        </div>
                    )}
                    <div ref={sentinelRef} style={{ height: '1px' }} />
                    {/* {!hasMore && filteredProducts.length > 0 && (
                        <div className="text-center py-4 text-gray-500">
                            No more products to load
                        </div>
                    )} */}
                </Col>
            </Row>

            <Drawer
                title={t('Order Details')}
                placement={'left'}
                onClose={onCloseDrawer}
                visible={drawerVisible}
                height={isMdOrLarger ? '100%' : 700}
                width={isMdOrLarger ? 500 : '100%'}
            >
                {selectedProduct && (
                    <div className=' '>
                        <div className="mb-4">
                            <div className="flex flex-row gap-5">
                                <img
                                    src={`${API_URL}${selectedProduct.product_images[0].path}`}
                                    alt={selectedProduct.name}
                                    className="h-16 w-16 object-cover rounded-md mb-4"
                                />
                                <div className="">
                                    <h3 className="font-bold">{selectedProduct.name}</h3>
                                    <p>
                                        {selectedProduct.sale_price ? (
                                            <>
                                                <span className="line-through text-gray-500 mr-2">
                                                    {selectedProduct.price} DH
                                                </span>
                                                <span className="text-red-500 font-bold">
                                                    {selectedProduct.sale_price} DH
                                                </span>
                                            </>
                                        ) : (
                                            <span>{selectedProduct.price} DH</span>
                                        )}
                                    </p>
                                    {selectedSize && (
                                        <p className="mt-2">
                                            <strong>{t('Selected Size:')}</strong> {selectedSize}
                                        </p>
                                    )}
                                    <div className="flex flex-row mt-3 gap-2">
                                        <Button
                                            type="primary"
                                            icon={<MinusOutlined />}
                                            size="small"
                                            disabled={selectedProductQuantity === 1}
                                            onClick={() => setSelectedProductQuantity(selectedProductQuantity - 1)}
                                            style={{
    background: `linear-gradient(to right, ${color_1}, ${color_2})` // #06b6d4 = cyan-500
  }}
                                        ></Button>
                                        <div className="quantity">{selectedProductQuantity}</div>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            size="small"
                                            onClick={() => setSelectedProductQuantity(selectedProductQuantity + 1)}
                                            style={{
                                                color:'white',
                                                background: `linear-gradient(to bottom, ${color_1}, ${color_2})`  // #06b6d4 = cyan-500
                                            }}
                                            disabled={selectedProductQuantity === selectedProductMaxQuantity(selectedProduct)}
                                        ></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-b py-4 my-4">
                            <div className="flex justify-between">
                                <span>{t('Delivery Fee')}</span>
                                <span>{deliveryPrice} DH</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>{t('Total')}</span>
                            <span className='font-bold text-3xl'>
                                {(selectedProduct.sale_price || selectedProduct.price) * selectedProductQuantity + deliveryPrice} DH
                            </span>
                        </div>
                        <Form className='w-full'
                            layout="vertical"
                            onFinish={onFinishOrder} >
                            <Form.Item
                                label={t('Full Name')}
                                name="fullName"
                                rules={[{ required: true, message: t('Please enter your full name') }]}
                            >
                                <Input className='rounded-2xl border-cyan-700' placeholder={t('Enter your full name')} />
                            </Form.Item>
                            {/* <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: false, message: 'Please enter your email' }]}
                            >
                                <Input className='rounded-2xl border-cyan-700' placeholder="Enter your email" />
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
                )}
            </Drawer>

            <Modal
                title={t('Select Size')}
                visible={isSizeModalVisible}
                footer={null}
                onCancel={handleModalCancel}
            >
                <Form onFinish={onFinishSizeModal}>
                    <Form.Item
                        label={t('Size')}
                        rules={[{ required: true, message: 'Please select a size' }]}
                    >
                        <Select
                            placeholder={t('Select a size')}
                            onChange={value => setSelectedSize(value)}
                            value={selectedSize}
                        >
                            {selectedProduct?.product_sizes?.map(size => (
                                <Option key={size.name} value={size.name} disabled={size.quantity <= 0}>
                                    {size.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary" htmlType="submit" className="w-full"
                            style={{
                                                color:'white',
                                                background: `linear-gradient(to bottom, ${color_1}, ${color_2})`  // #06b6d4 = cyan-500
                                            }}>
                            {t('Select')}
                            
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={t('Select Size')}
                visible={isAddToCartModalVisible}
                footer={null}
                onCancel={handleAddToCartModalCancel}
            >
                <Form onFinish={onFinishAddToCart}>
                    <Form.Item
                        label="Size"
                        rules={[{ required: true, message: t('Please select a size') }]}
                    >
                        <Select
                            placeholder={t('Select a size')}
                            onChange={value => setSelectedSize(value)}
                            value={selectedSize}
                        >
                            {selectedProductForCart?.product_sizes?.map(size => (
                                <Option key={size.name} value={size.name} disabled={size.quantity <= 0}>
                                    {size.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full"
                        style={{
                                                color:'white',
                                                background: `linear-gradient(to bottom, ${color_1}, ${color_2})`  // #06b6d4 = cyan-500
                                            }}>
                            {t('Add to Cart')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <InstagramReelModal
                visible={isModalVisibleInstagramReel}
                onCancel={handleInstagramReelModalCancel}
                reelUrl={selectedProductInstagramReelLink}
            />

        </div>


    );
};

export default Products;