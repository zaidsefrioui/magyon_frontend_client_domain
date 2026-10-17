import { Button } from "antd"
import HeaderSecond from "../components/admin/header/HeaderSecond"
import { useEffect, useState } from "react"
import { AppstoreOutlined, ShopOutlined } from "@ant-design/icons"
import Orders from "../components/admin/ecommerce/Orders"
import Extensions from "../components/admin/ecommerce/Extensions"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTranslation } from "react-i18next"

const EcommercePage = () => {

    const { t } = useTranslation();


    const [activePage, SetActivePage] = useState('Orders');
    const [orderNum, setOrderNum] = useState(0);
    const { currentStoreSlug } = useAuth();
    const renderContent = () => {
        switch (activePage) {
            case 'Orders':
                return (
                    <Orders orderNum={orderNum} />
                );
            // case 'Extensions':
            //     return (
            //         <Extensions />
            //     );
            default:
                return null;
        }
    };
    useEffect(() => {
            console.log(orderNum);
            
        }, [orderNum]);
    return (
        <>
            <HeaderSecond onSetOrderNum={setOrderNum} />
            <div className="pb-3 flex justify-center gap-10">
                <Button type={activePage === 'Orders' ? 'primary' : 'default'} size="large" onClick={() => { SetActivePage('Orders') }}>
                    <ShopOutlined />
                    {t('Orders')}
                    </Button>
                <Link to={'/' + currentStoreSlug} target="_blank" rel="noopener noreferrer">
                    <Button type={'default'} size="large"
                        onClick={() => { SetActivePage('Orders') }}
                    >
                        <ShopOutlined />
                        {t("Shop Store")}
                        </Button>
                </Link>
                {/* <Button type={activePage === 'Extensions' ? 'primary' : 'default'} size="large" onClick={() => { SetActivePage('Extensions') }}>
                    <AppstoreOutlined />
                    Extensions</Button> */}
            </div>
            <div className="px-3">
                {renderContent()}
            </div>
        </>
    )
}

export default EcommercePage 