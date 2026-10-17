import { Button, Form, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { FilterOutlined, MinusOutlined, PlayCircleOutlined, PlusOutlined, VideoCameraOutlined } from '@ant-design/icons';
import InstagramReelModal from './InstagramReelModal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';



const API_URL = import.meta.env.VITE_API_URL;


const ProductPacks = ({ productPacks, storeSlug, color_2 }) => {
    const [selectedProductInstagramReelLink, setSelectedProductInstagramReelLink] = useState(null);
    const [isModalVisibleInstagramReel, setIsModalVisibleInstagramReel] = useState(false);

    const navigate = useNavigate();

    const goToProduct = (slug) => {
        window.scrollTo(0, 0);
        navigate(`/product/${slug}`);
    };

    const { t } = useTranslation();

    // const [selectedProduct, setSelectedProduct] = useState(null);
    // const [selectedSize, setSelectedSize] = useState(null);
    // const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);

    // const productSizeQuantity = (productSizes) => {
    //     if (!productSizes) return 0;
    //     return productSizes.reduce((sum, size) => sum + size.quantity, 0);
    // };

    // const onFinishAddSectionProduct = () => {
    //     if (selectedSize && selectedProduct) {
    //         // const updatedItem = { ...selectedProduct, selectedSize };
    //         changeSelected(selectedSize);
    //     }
    //     setIsSizeModalVisible(false);
    //     setSelectedSize(null);
    // };
    // const handleAddToCartModalCancel = () => {
    //     setIsSizeModalVisible(false);
    //     setSelectedSize(null);
    // };

    // const handleSizeSelection =  (product) => {
    //     setSelectedProduct(product);
    //     //  deleteSelected();

    //     setSelectedSize(null);
    //     if (product.product_sizes && product.product_sizes.length > 0) {
    //         setIsSizeModalVisible(true);

    //     } else {
    //         // save with out size
    //         console.log(packProducts);
    //         changeSelected(null);

    //     }
    // };



    // const changeSelected = (size) => {
    //     const updated1 = { ...packProducts }; // mevcut objeyi kopyala

    //     updated1[selection] = packProducts[selection].map((p) => {
    //         if (p.id !== product.id) {
    //             return { ...p, selected: false, selectedSize: null };
    //         }
    //         return p;
    //     });

    //     // setPackProducts(updated1);

    //     const updated2 = { ...packProducts }; // mevcut objeyi kopyala

    //     updated2[selection] = updated1[selection].map((p) => (
    //         p.id === product.id
    //             ? {
    //                 ...p,
    //                 selected: true,
    //                 selectedSize: size,
    //             } // sadece hedef ürünü güncelle
    //             : p
    //     ));

    //     //packProducts[selection] belirli osection disinda bulunan p.id === product.id ayni ise sil
    //     Object.keys(updated2).forEach((key) => {
    //         if (parseInt(key) !== selection) {
    //             updated2[key] = updated2[key].map((p) =>
    //                 p.id !== product.id ? { ...p,  hidden: false } : p
    //             );
    //         }
    //     });

    //     Object.keys(updated2).forEach((key) => {
    //         if (parseInt(key) !== selection) {
    //             updated2[key] = updated2[key].map((p) =>
    //                 p.id === product.id ? { ...p, selected:false,selectedSize:null,hidden: true } : p
    //             );
    //         }
    //     });

    //     setPackProducts(updated2);
    // };




    const showModalInstagramReel = (p) => {
        setSelectedProductInstagramReelLink(p.instagram_reel_link);
        setIsModalVisibleInstagramReel(true);
    };
    const handleInstagramReelModalCancel = () => {
        setIsModalVisibleInstagramReel(false);
        setSelectedProductInstagramReelLink(null);
    };

    // if(product.hidden){
    //     return (<>
    //     <div className="w-0"></div>
    //     </>);
    // }

    return (
        <>

            {/* <div key={i} className='py-5'> */}

            <div className='w-full text-center degrade-bg py-2 rounded-lg text-white font-bold'
              style={{ background: color_2 }}
>
                Packs
            </div>

            <ul className='flex flex-row gap-4 md:w-auto overflow-auto  py-3 '>
                {productPacks?.map((product) => (
                    <>

                        <li onClick={() => goToProduct(product.slug)}

                            key={product.id}
                            className="min-w-[150px] max-w-[160px] min-h-[250px] cursor-pointer text-center rounded-3xl transition-all  text-black flex flex-col justify-center items-center gap-2"
                        >
                            <div className={`product-item border  hover:shadow-lg cursor-pointer transition-all select-none relative p-3 rounded-3xl`}>
                                <div className="product-img relative" >
                                    <div className="absolute bottom-2 right-2">
                                        {product.instagram_reel_link &&
                                            <Button
                                                onClick={() => showModalInstagramReel(product)}
                                                // shape="circle"
                                                icon={<PlayCircleOutlined className="text-white" style={{ fontSize: '24px' }} />}
                                                className="flex items-center justify-center rounded-lg"
                                                style={{
                                                    background: 'linear-gradient(45deg,  #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45, #FFDC80)',
                                                    border: 'none',
                                                    width: '35px',
                                                    height: '35px',
                                                }}
                                            />
                                        }

                                    </div>
                                    <img
                                        //  onClick={() => goToProduct(product.slug)} 
                                        src={product.product_images[0]?.path ? `${API_URL}${product.product_images[0].path}` : ""}
                                        alt={product.name}
                                        className="h-[150px] w-full object-cover rounded-md"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="product-info flex flex-col p-3">
                                    <span className="text-left font-bold">{product.name}</span>
                                    <span>
                                        {product.sale_price ? (
                                            <>
                                                <span className="line-through text-gray-500 mr-2 text-[12px]">
                                                    {product.price} DH
                                                </span>
                                                <span className="text-red-500 font-bold text-sm">
                                                    {product.sale_price} DH
                                                </span>
                                            </>
                                        ) : (
                                            <span>{product.price} DH</span>
                                        )}
                                    </span>
                                    {product.sale_price &&
                                    <span className='bg-slate-200 rounded-xl p-1 mt-1 font-bold'>{t("SaveM")} 
                                    <br />
                                    <span className='text-green-600'>-{product.price-product.sale_price} DH</span></span>
                                    }
                                </div>



                            </div>
                        </li>
                    </>
                ))}
            </ul>

            


            <InstagramReelModal
                visible={isModalVisibleInstagramReel}
                onCancel={handleInstagramReelModalCancel}
                reelUrl={selectedProductInstagramReelLink}
            />

        </>
    )
}

export default ProductPacks