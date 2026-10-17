import { Button, Card, Modal, Table } from "antd";
import Header from "../components/admin/header/Header";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from "react";
import CreateBill from "../components/admin/cart/CreateBill";
import HeaderSecond from "../components/admin/header/HeaderSecond";
import { useSelector, useDispatch } from "react-redux";
import { removeProduct, increaseQuantity, decreaseQuantity, clearCart } from "../redux/cartSlice"; // Redux action'larını import et
import PaymentRequiredModal from "../components/PaymentRequiredModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const CartPage = () => {
  const cart = useSelector((state) => state.cart); // Redux state'ini dinle
  const dispatch = useDispatch(); // Redux dispatch fonksiyonunu al
  const navigate = useNavigate()

  //payment modal
  const [paymentModalVisible, setPaymentModalVisible] = useState(false); // Modal görünürlüğü için state
  const [redirectPath, setRedirectPath] = useState(''); // Yönlendirme path'i için state
  const [modalMessage, setModalMessage] = useState(''); // Modal mesajı için state
  const [buttonText, setButtonText] = useState(''); // Buton metni için state

  const { t } = useTranslation();


  const handleRedirect = (path) => {
    setPaymentModalVisible(false); // Modal'ı kapat
    navigate(path); // Yönlendirme yap
  };
  //en payment modal

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const setCategoryNullBill = () => {
    // setCategoryNull(null);
  }

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

  const columns = [
    {
      title: t('Image'),
      dataIndex: 'image',
      key: 'image',
      width: "125px",
      render: (image) => {
        return <img src={`${API_URL}${image}`} alt="" className="w-full h-20 object-cover rounded-md" />;
      },
    },
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Price'),
      dataIndex: 'price',
      key: 'price',
      render: (price) => {
        return <div className="price flex justify-center items-center gap-2">{price} DH</div>;
      },
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => {
        return (
          <div className="item-quantity flex justify-center items-center gap-2">
            <Button
              type="primary"
              icon={<MinusOutlined />}
              size="small"
              disabled={quantity === 1}
              onClick={() => handleDecreaseQuantity(record)} // Miktarı azalt
            ></Button>
            <div className="quantity">{quantity}</div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="small"
              disabled={quantity === record.maxQuantity}
              onClick={() => handleIncreaseQuantity(record)} // Miktarı artır
            ></Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleRemoveProduct(record)} // Ürünü sepetten kaldır
            ></Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-auto flex flex-col">
      <HeaderSecond />
      <div className="px-6 flex-grow">
        <h2 className="text-xl font-semibold mb-5">{t('Cart')} </h2>

        <Table
          dataSource={cart.cartItems} // Sepetteki ürünleri göster
          columns={columns}
          pagination={false}
          scroll={{
            x: 'max-content',
            y: 55 * 5,
          }}
          bordered
        />

        <div className="cart-total flex justify-end mt-4">
          <Card className='w-72'>
            <div className="cart-with-remise flex flex-row justify-between mt-1">
              <span> {t('Quantity')} </span>
              <span>{cart.cartTotalQuantity}</span>
            </div>
            <div className="cart-with-remise flex flex-row justify-between mt-2">
              <b> {t('Total')} </b>
              <b>{cart.cartTotal} DH</b>
            </div>

            <div className='flex flex-col gap-2 py-2 px-2'>
              <Button
                className="w-full mt-3"
                type="primary"
                size="large"
                onClick={showModal}
                disabled={cart.cartTotalQuantity === 0} // Sepet boşsa butonu devre dışı bırak
              >
                {t('Order')}
              </Button>
              <Button type='primary' size='large' icon={<DeleteOutlined />} danger onClick={handleClearCart} disabled={cart.cartTotalQuantity == 0}>{t('Delete items')} </Button>
            </div>
          </Card>
        </div>
      </div>

      <CreateBill setCategoryNullBill={setCategoryNullBill} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <PaymentRequiredModal
        visible={paymentModalVisible}
        onRedirect={handleRedirect}
        message={modalMessage}
        buttonText={buttonText}
        redirectPath={redirectPath}
      />
    </div>
  );
};

export default CartPage;