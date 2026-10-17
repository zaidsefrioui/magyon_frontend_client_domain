import CartTotals from "../components/admin/cart/CartTotals"
import Categories from "../components/admin/categories/Categories"
import Header from "../components/admin/header/Header"
import Products from "../components/admin/products/Products"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(null);
    //useauth ten currentStorePermissionStockSeller
    // const { currentStorePermissionsStockSeller,
    //     currentStorePermissionsStockEdit,
    //     currentStorePermissionsEcommerce,
    //     currentStorePermissionsStatistics
    // } = useAuth();
    // const navigate = useNavigate()
    // if (currentStorePermissionsStockSeller) {

    // } else if (currentStorePermissionsStockEdit) {
    //     console.log("test44");
        
    //     navigate("/store/stock");
    // } else if (currentStorePermissionsEcommerce) {
    //     navigate("/store/ecommerce");
    // } else if (currentStorePermissionsStatistics) {
    //     navigate("/store/statistic");
    // }




    return (
        <>
            <Header onSearch={setSearchKeyword} />
            <div className="Home flex flex-col md:flex-row justify-between gap-5">
                <div className="categories pl-2 overflow-auto max-h-[calc(100vh_-_101px)] md:pb-[50px]">
                    <Categories onSelectCategory={setSelectedCategory} />
                </div>
                <div className="products flex-[8] overflow-auto max-h-[calc(100vh_-_101px)] pb-56 px-2">
                    <Products selectedCategory={selectedCategory} searchKeyword={searchKeyword} />
                </div>
                <div className="cart-wrapper border md:min-w-[300px]  md:-mt-[24px] hidden md:block">
                    <CartTotals setCategoryNull={setSelectedCategory} />
                </div>
            </div>
        </>
    )
}

export default HomePage