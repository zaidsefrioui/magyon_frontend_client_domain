import React, { useState } from "react";
import { Modal, message } from "antd";
import {
    CreditCardOutlined,
    DollarOutlined,
    LockOutlined,
    TagOutlined,
    StarFilled,
} from "@ant-design/icons";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function PaymentOptionModal({
    open,
    setOpen,
    setLoadingPage,
    setTourVisible,
    order,
    discount = 0,
    storeChariNumber,
}) {
    const API_URL = import.meta.env.VITE_API_URL;
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    // ============================================================
    // TOTALS
    // ============================================================

    const originalTotal = Number(order?.total || 0);
    const discountAmount = Number(discount || 0);

    const finalTotal = Math.max(
        0,
        originalTotal - discountAmount
    );

    // ============================================================
    // CLOSE MODAL
    // ============================================================

    const closeModal = () => {
        if (loading) return;

        setOpen(false);
        if(order?.status_id==1)
        setTourVisible(true); 
    };

    // ============================================================
    // UPDATE PAYMENT OPTION
    // ============================================================

    const updatePaymentOption = async (paymentOption) => {
        return axios.put(
            `${API_URL}/api/shop/orderPaymentMethod/${order.id}`,
            {
                payment_option: paymentOption,
                discount:
                    paymentOption === "cod"
                        ? 0
                        : discountAmount,
            }
        );
    };

    // ============================================================
    // CASH ON DELIVERY
    // ============================================================

    const handleCashOnDelivery = async () => {
        try {
            setLoading(true);

            await updatePaymentOption("cod");

            message.success(
                t("Payment option updated")
            );

            setOpen(false);

            if(order?.status_id == 1)
            setTourVisible(true); 

        } catch (error) {
            console.error(error);

            message.error(
                t("Something went wrong")
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // CARD PAYMENT
    // ============================================================

    const handleCardPayment = async () => {
        try {
            setLoading(true);
            
            setLoadingPage(true);

            await updatePaymentOption("card");

            setOpen(false);

            window.location.href =
                `https://chari.pay.ma/${storeChariNumber}/${finalTotal}`;
        } catch (error) {
            console.error(error);

            message.error(
                t("Something went wrong")
            );
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    const LoadingSpinner = ({ dark = false }) => (
        <div
            className={`
                absolute
                inset-0
                z-50
                flex
                items-center
                justify-center
                rounded-[14px]
                ${
                    dark
                        ? "bg-green-600/60"
                        : "bg-white/70"
                }
                backdrop-blur-[1px]
            `}
        >
            <div
                className={`
                    h-7
                    w-7
                    animate-spin
                    rounded-full
                    border-[3px]
                    ${
                        dark
                            ? "border-white/40 border-t-white"
                            : "border-gray-200 border-t-green-600"
                    }
                `}
            />
        </div>
    );

    return (
        <Modal
            open={open}
            footer={null}
            closable={false}
            centered
            width={700}
            onCancel={closeModal}
            maskClosable={!loading}
            keyboard={!loading}
            styles={{
                content: {
                    padding: 0,
                    borderRadius: 12,
                    overflow: "hidden",
                },
                body: {
                    padding: 0,
                },
            }}
        >
            <div className="w-full bg-white px-5 pb-6 pt-7 sm:px-7 sm:pb-7 sm:pt-8">

                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div className="mb-6 text-center sm:mb-7">

                    <h2 className="m-0 text-[23px] font-bold leading-[1.2] tracking-[-0.6px] text-[#152033] sm:text-[27px]">
                        {t("Choose Payment Method")}
                    </h2>

                    <p className="mt-2 text-[11px] leading-[1.5] text-[#7d8592] sm:text-[13px]">
                        {t(
                            "Please choose how you would like to pay for your order."
                        )}
                    </p>

                </div>

                {/* ================================================== */}
                {/* PAYMENT OPTIONS */}
                {/* ================================================== */}

                <div className="flex flex-col gap-3.5 sm:gap-4">

                    {/* ================================================== */}
                    {/* CASH ON DELIVERY */}
                    {/* ================================================== */}

                    <div
                        onClick={
                            loading
                                ? undefined
                                : handleCashOnDelivery
                        }
                        className={`
                            relative
                            overflow-hidden
                            rounded-[14px]
                            border
                            border-gray-400
                            bg-[#fffdfa]
                            shadow-[0_2px_8px_rgba(245,158,11,0.05)]
                            transition-all
                            duration-200
                            ${
                                loading
                                    ? "cursor-not-allowed opacity-70"
                                    : "cursor-pointer hover:-translate-y-[1px]"
                            }
                        `}
                    >

                        {loading && (
                            <LoadingSpinner />
                        )}

                        {/* COD TOP */}

                        <div className="flex min-h-[100px] items-center gap-4 px-4 py-4 sm:min-h-[100px] sm:gap-5 sm:px-5 sm:py-5">

                            {/* ICON */}

                            <div className="flex h-[58px] w-[58px] flex-shrink-0 items-center justify-center rounded-full bg-[#f6f5f5] text-gray-500 sm:h-[66px] sm:w-[66px]">

                                <DollarOutlined className="text-[29px] sm:text-[33px]" />

                            </div>

                            {/* TEXT */}

                            <div className="min-w-0 flex-1">

                                <div className="text-[16px] font-bold leading-tight text-[#172033] sm:text-[20px]">
                                    {t("Cash on Delivery")}
                                </div>

                                <div className="mt-1.5 text-[11px] leading-[1.4] text-[#747d89] sm:text-[13px]">
                                    {t(
                                        "Pay when you receive your order"
                                    )}
                                </div>

                            </div>

                            {/* ARROW */}

                            <div className="flex-shrink-0 text-[25px] font-light leading-none text-[#858b92] sm:text-[29px]">
                                ›
                            </div>

                        </div>

                        {/* COD TOTAL */}

                        <div className="mx-3 mb-3 flex min-h-[45px] items-center justify-between rounded-[9px] border border-[#e6e6e6] bg-[#ececec] px-4 sm:mx-4 sm:mb-4 sm:min-h-[52px] sm:px-5">

                            <span className="text-[11px] font-semibold text-[#263043] sm:text-[13px]">
                                {t("Total")}
                            </span>

                            <span className="text-[21px] font-black tracking-[-0.5px] text-gray-600 sm:text-[24px]">
                                {originalTotal} DH
                            </span>

                        </div>

                    </div>

                    {/* ================================================== */}
                    {/* CARD PAYMENT */}
                    {/* ================================================== */}

                    <div className="relative">

                        <div
                            onClick={
                                loading
                                    ? undefined
                                    : handleCardPayment
                            }
                            className={`
                                relative
                                overflow-hidden
                                rounded-[14px]
                                border
                                border-[#13a94f]
                                bg-gradient-to-br
                                from-[#11ad50]
                                via-[#16bd5b]
                                to-[#36d878]
                                shadow-[0_5px_16px_rgba(22,163,74,0.15)]
                                transition-all
                                duration-200
                                ${
                                    loading
                                        ? "cursor-not-allowed opacity-80"
                                        : "cursor-pointer hover:-translate-y-[1px] hover:shadow-[0_7px_20px_rgba(22,163,74,0.22)]"
                                }
                            `}
                        >

                            {loading && (
                                <LoadingSpinner dark />
                            )}

                            {/* ================================================== */}
                            {/* CARD TOP */}
                            {/* ================================================== */}

                            <div className="flex min-h-[135px] items-center gap-4 px-4 py-4 sm:min-h-[135px] sm:gap-5 sm:px-5 sm:py-5">

                                {/* ICON */}

                                <div className="flex h-[58px] w-[58px] flex-shrink-0 items-center justify-center rounded-full bg-[#d9f5e3] text-[#07883c] sm:h-[66px] sm:w-[66px]">

                                    <CreditCardOutlined className="text-[29px] sm:text-[33px]" />

                                </div>

                                {/* TEXT */}

                                <div className="min-w-0 flex-1">

                                    <div className="text-[16px] font-bold leading-tight text-white sm:text-[20px]">
                                        {t("Pay with Bank Card")}
                                    </div>

                                    <div className="mt-1.5 flex items-center gap-1 text-[10px] leading-[1.4] text-white/90 sm:text-[12px]">

                                        <LockOutlined className="flex-shrink-0 text-[10px] sm:text-[11px]" />

                                        <span>
                                            {t(
                                                "100% secure bank card payment"
                                            )}
                                        </span>

                                    </div>

                                </div>

                                {/* ARROW */}

                                <div className="flex-shrink-0 text-[25px] font-light leading-none text-white/70 sm:text-[29px]">
                                    ›
                                </div>

                            </div>

                            {/* ================================================== */}
                            {/* CARD PRICE */}
                            {/* ================================================== */}

                            <div className="mx-3 mb-3 flex min-h-[55px] items-center gap-2 rounded-[9px] border-- border-white/30-- bg-[#069b4b] px-2.5 sm:mx-4 sm:mb-4 sm:min-h-[55px] sm:gap-3 sm:px-3">

                                {/* DISCOUNT */}

                                <div className="flex flex-shrink-0 items-center gap-1 rounded-[7px] bg-[#d2f0dc] px-2 py-1.5 text-[15px] font-extrabold text-[#16803d] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-[15px]">

                                    <TagOutlined className="text-[10px] sm:text-[12px]" />

                                    <span>
                                        - 
                                        {discountAmount} DH
                                    </span>

                                </div>

                                {/* PRICES */}

                                <div className="ml-auto flex flex-shrink-0 items-center gap-2 sm:gap-3">

                                    <span className="text-[16px] font-medium text-[#f1f2f486] line-through sm:text-[16px]">
                                        {originalTotal} DH
                                    </span>

                                    <span className="text-[23px] font-black tracking-[-0.5px] text-[#fcfdfd] sm:text-[26px] text-shadow: rgba(0, 0, 0, 0.35) 0px 2px 6px;">
                                        {finalTotal} DH
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* ================================================== */}
                        {/* RECOMMENDED */}
                        {/* ================================================== */}

                        <div className="absolute top-0 right-0 z-20 flex items-center gap-1.5 rounded-bl-[12px] bg-[#069b4b] px-3 py-1.5 text-[10px] font-bold leading-none text-white shadow-[-2px_-2px_8px_rgba(0,0,0,0.08)] sm:gap-1.5 sm:rounded-bl-[13px] sm:px-3.5 sm:py-2 sm:text-[12px]">

                            <StarFilled className="text-[9px] sm:text-[10px]" />

                            {t("Recommended")}

                        </div>

                    </div>

                </div>

                {/* ================================================== */}
                {/* SECURITY */}
                {/* ================================================== */}

                <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-[9px] font-medium text-[#a0a5ad] sm:mt-5 sm:gap-2 sm:text-[11px]">

                    <LockOutlined className="text-[10px] text-[#16a34a] sm:text-[12px]" />

                    <span>
                        {t(
                            "Your payment information is secure"
                        )}
                    </span>

                </div>

            </div>
        </Modal>
    );
}