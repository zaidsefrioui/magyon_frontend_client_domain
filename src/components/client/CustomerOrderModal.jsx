import { Modal } from "antd";
import { useTranslation } from "react-i18next";

export default function CustomerOrderModal({
    isModalOpen,
    setIsModalOpen,
    order,
}) {
    const API_URL = import.meta.env.VITE_API_URL;
    const { t } = useTranslation();

    // console.log(order);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            width={800}
        >
            <h1 className="text-lg mb-4">
                <span className="font-bold">{t("Order")}:</span>{" "}
                {order?.order_code}
            </h1>

            {/* Pack */}
            {order?.pack_product && (
                <>
                    <h3 className="text-lg font-semibold mb-4">
                        {t("Pack")}
                    </h3>

                    <div className="p-4 border rounded-lg bg-gray-50 grid grid-cols-12 gap-4 mb-5">
                        <div className="md:col-span-2 col-span-4">
                            <img
                                src={
                                    order.pack_product.product_images?.[0]?.path
                                        ? `${API_URL}${order.pack_product.product_images[0].path}`
                                        : "https://via.placeholder.com/80"
                                }
                                className="w-20 h-20 object-cover rounded"
                            />
                        </div>

                        <div className="md:col-span-6 col-span-4 font-medium">
                            {order.pack_product.name}
                        </div>

                        <div className="col-span-2 text-right">
                            <div className="text-gray-500">
                                {t("Price")}
                            </div>

                            <div className="font-bold">
                                {order.pack_product.sale_price ||
                                    order.pack_product.price}{" "}
                                DH
                            </div>
                        </div>

                        <div className="col-span-2 text-right">
                            <div className="text-gray-500">
                                {t("Quantity")}
                            </div>

                            <div>1</div>
                        </div>
                    </div>
                </>
            )}

            {/* Products */}

            <h3 className="text-lg font-semibold mb-4">
                {t("Products")}
            </h3>

            <div className="space-y-4 mb-6">
                {order?.ecommerce_cart_products?.map((product, index) => (
                    <div
                        key={index}
                        className="p-4 border rounded-lg bg-gray-50 grid grid-cols-12 gap-4"
                    >
                        <div className="md:col-span-2 col-span-4">
                            <img
                                src={
                                    product.product?.product_images?.[0]?.path
                                        ? `${API_URL}${product.product.product_images[0].path}`
                                        : "https://via.placeholder.com/80"
                                }
                                className="w-20 h-20 object-cover rounded"
                            />
                        </div>

                        <div className="md:col-span-6 col-span-4">
                            <div className="font-medium">
                                {product.product?.name}
                            </div>

                            <div className="text-gray-500 text-sm">
                                {product.product?.code}
                            </div>

                            {product.size && (
                                <div className="text-sm">
                                    {t("Size")}: {product.size}
                                </div>
                            )}
                        </div>

                        <div className="col-span-2 text-right">
                            <div className="text-gray-500">
                                {t("Price")}
                            </div>

                            <div
                                className={
                                    order?.pack_product &&
                                    !product.additional
                                        ? "line-through"
                                        : "font-bold"
                                }
                            >
                                {product.price} DH
                            </div>
                        </div>

                        <div className="col-span-2 text-right">
                            <div className="text-gray-500">
                                {t("Quantity")}
                            </div>

                            <div>{product.quantity}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}

            <div className="grid grid-cols-2 gap-y-2 text-lg border-t pt-4">
                <div>{t("Delivery")}</div>
                <div className="text-right">
                    {order?.delivery_price} DH
                </div>
{ order?.discount > 0 &&
(<>
<div className="text-red-700">{t("Discount")}</div>
                <div  className="text-right text-red-700">
                    {order?.discount} DH
                </div>
                </>
)

}
                

                <div className="font-semibold">{t("Total")}</div>
                <div className="text-right font-bold text-2xl">
                    {order?.total-order?.discount} DH
                </div>
            </div>
        </Modal>
    );
}