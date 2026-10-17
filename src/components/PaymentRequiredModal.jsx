import React from 'react';
import { Modal, Button, Result } from 'antd';

const PaymentRequiredModal = ({ visible, onRedirect, message, buttonText, redirectPath }) => {
    return (
        <Modal
            visible={visible}
            footer={null} // Footer'ı kaldırıyoruz
            closable={false} // Kapatma butonunu kaldırıyoruz
            // maskStyle={{ backdropFilter: 'blur(5px)' }} // Arka planı bulanık yapıyoruz
            styles={{
                mask: { backdropFilter: 'blur(5px)' } // Arka planı bulanık yapıyoruz
            }}
        >
            {/* <div style={{ textAlign: 'center' }}>
                <p>{message}</p>
                <Button className='mt-5' type="primary" onClick={() => onRedirect(redirectPath)}>
                    {buttonText}
                </Button>
            </div> */}
            <Result
                title={message}
                extra={
                    <Button className='mt-5' type="primary" onClick={() => onRedirect(redirectPath+"?p=required")}>
                        {buttonText}
                    </Button>
                }
            />
        </Modal>
    );
};

export default PaymentRequiredModal;