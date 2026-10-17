import { Button, Form, Image, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { FilterOutlined, MinusOutlined, PlayCircleOutlined, PlusOutlined, VideoCameraOutlined } from '@ant-design/icons';
import InstagramReelModal from './InstagramReelModal';
import { useTranslation } from 'react-i18next';
import ProductImages from './ProductImagePreview';
import ProductImagePreview from './ProductImagePreview';



const API_URL = import.meta.env.VITE_API_URL;


const PackProducts = ({ selection, product, packProducts, setPackProducts }) => {
    const [selectedProductInstagramReelLink, setSelectedProductInstagramReelLink] = useState(null);
    const [isModalVisibleInstagramReel, setIsModalVisibleInstagramReel] = useState(false);

    const { t } = useTranslation();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isSizeModalVisible, setIsSizeModalVisible] = useState(false);

    const productSizeQuantity = (productSizes) => {
        if (!productSizes) return 0;
        return productSizes.reduce((sum, size) => sum + size.quantity, 0);
    };

    const onFinishAddSectionProduct = () => {
        if (selectedSize && selectedProduct) {
            // const updatedItem = { ...selectedProduct, selectedSize };
            changeSelected(selectedSize);
        }
        setIsSizeModalVisible(false);
        setSelectedSize(null);
    };
    const handleAddToCartModalCancel = () => {
        setIsSizeModalVisible(false);
        setSelectedSize(null);
    };

    const handleSizeSelection =  (product) => {
        if(!((product.quantity > 0 || productSizeQuantity(product.product_sizes) > 0 )&& !product.hidden)) return null;
        setSelectedProduct(product);
        //  deleteSelected();

        setSelectedSize(null);
        if (product.product_sizes && product.product_sizes.length > 0) {
            setIsSizeModalVisible(true);
            
        } else {
            // save with out size
            // console.log(packProducts);
            

            changeSelected(null);
            
        }
        
    };

    

    const changeSelected = (size) => {
        const updated1 = { ...packProducts }; // mevcut objeyi kopyala

        updated1[selection] = packProducts[selection].map((p) => {
            if (p.id !== product.id) {
                return { ...p, selected: false, selectedSize: null };
            }
            return p;
        });

        // setPackProducts(updated1);

        const updated2 = { ...packProducts }; // mevcut objeyi kopyala

        updated2[selection] = updated1[selection].map((p) => (
            p.id === product.id
                ? {
                    ...p,
                    selected: true,
                    selectedSize: size,
                } // sadece hedef ürünü güncelle
                : p
        ));

        //packProducts[selection] belirli osection disinda bulunan p.id === product.id ayni ise sil
        Object.keys(updated2).forEach((key) => {
            if (parseInt(key) !== selection) {
                updated2[key] = updated2[key].map((p) =>
                    p.id !== product.id ? { ...p,  hidden: false } : p
                );
            }
        });

        Object.keys(updated2).forEach((key) => {
            if (parseInt(key) !== selection) {
                updated2[key] = updated2[key].map((p) =>
                    p.id === product.id ? { ...p, selected:false,selectedSize:null,hidden: true } : p
                );
            }
        });

        setPackProducts(updated2);
    };




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

    // if(product.stockOut){
    //     return null;
    // }

    return (
        <> 
            <div
            onClick={() => handleSizeSelection(product)}
            className={`product-item border ${product.selected && "border-red-800 border-2"}  hover:shadow-lg cursor-pointer transition-all select-none relative p-3 rounded-3xl`}>
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
                    <div className="!static">
                    <ProductImagePreview product={product} ></ProductImagePreview>
                    </div>
                </div>
                <div className="product-info flex flex-col p-3">
                    <span className="text-left font-bold">{product.name + " " + (product.selectedSize != null ? "(" + product.selectedSize +")":"")}</span>
                    <span>
                        {/* {product.sale_price ? (
                            <> */}
                        <span className="line-through text-gray-500 mr-2 text-[15px]">
                            {product.sale_price ? product.sale_price : product.price} DH
                        </span>
                        {/* <span className="text-red-500 font-bold">
                                    {product.sale_price} DH
                                </span> */}
                        {/* </>
                        ) : (
                            <span>{product.price} DH</span>
                        )} */}
                    </span>
                </div>

                {(((product.quantity > 0 || productSizeQuantity(product.product_sizes) > 0 )&& !product.hidden) ? (
                    <div>
                        <div className="absolute bottom-14 right-2">
                            {/* <Tooltip title={t('Add to Cart')} color="#2563eb" >
                                <Button
                                    onClick={() => handleAddToCartClick(product)}
                                    type="primary"
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                    className="flex items-center justify-center bg-sky-800 text-white"
                                    disabled={isButtonDisabled(product)}
                                />
                            </Tooltip> */}
                        </div>
                        <div className="w-full">
                            <Button
                                onClick={() => handleSizeSelection(product)}
                                className={`flex items-center justify-center w-full  ${product.selected ? "!bg-red-800  hover:!bg-red-800 hover:!text-white hover:!border-red-800 focus:!bg-red-800 " : "!bg-green-600 hover:!border-green-600 hover:!text-white"} font-semibold text-white rounded-2xl`}
                            >
                                {product.selected ? t("Selected") : t("Select")}

                                {/* {t("Select")} */}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <Button
                            disabled
                            className="flex items-center justify-center rounded-2xl w-full bg-gray-600 text-white "
                        >
                                {product.hidden ? t("Selected") :t('Stock out')}
                        </Button>
                    </div>
                ))}

            </div>

            <Modal
                title={t('Select Size')}
                visible={isSizeModalVisible}
                footer={null}
                onCancel={handleAddToCartModalCancel}
            >
                <Form onFinish={onFinishAddSectionProduct}>
                    <Form.Item
                        label="Size"
                        rules={[{ required: true, message: t('Please select a size') }]}
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
                        <Button type="primary" htmlType="submit" className="w-full">
                            {/* {product.selected ? ("Selected " + product.selectedSize && product.selectedSize) : "Select"} */}
                        {t('Select')}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


            <InstagramReelModal
                visible={isModalVisibleInstagramReel}
                onCancel={handleInstagramReelModalCancel}
                reelUrl={selectedProductInstagramReelLink}
            />

        </>
    )
}

export default PackProducts