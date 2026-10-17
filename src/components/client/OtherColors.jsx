import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function otherColors({ store, setPackProductsAdditional,setAdditionalTotalPrice }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const { t } = useTranslation();
        const navigate = useNavigate();



    

    const handleProductClick = (slug) => {
        // onSelectCategory(categoryId); // Update the selected category in the parent component
        setPackProductsAdditional({});
        setAdditionalTotalPrice(0)
        window.scrollTo(0, 0);
                navigate(`/${store?.slug}/product/${slug}`);

    };

    return (
        <div>
            <ul className='flex flex-row gap-4 w-full md:w-auto overflow-auto md:overflow-hidden pl-- pb-3 py-1 pr-5 md:justify-center--'>
                {/* "All" category */}
                {/* <li
                    className={`min-w-[100px] px-6 py-10 cursor-pointer flex items-center justify-center text-center rounded-xl transition-all bg-gray-100 text-black
                        ${selectedCategory === null
                            ? 'bg-slate-950 text-white'
                            : 'bg-gray-100 text-black hover:bg-slate-950 hover:text-white'}`}
                    // onClick={() => handleCategoryClick(null)}
                >
                    <span>{t('All')}</span>
                </li> */}
                <li
                        key={store.products[0].id}
                        className={`min-w-[100px] py-1 px-1 cursor-pointer text-center rounded-2xl transition-all bg-gray-100 text-black flex flex-col justify-center items-center gap-1
                            border border-red-800 border-2`}
                        // onClick={() => handleProductClick(store.products[0].slug)}
                    >
                        {/* Display category image if it exists */}
                        {store.products[0].product_images?.[0]?.path && (
                            <img
                                src={`${API_URL}${store.products[0].product_images?.[0]?.path}`}
                                className="img-fluid object-cover w-20 h-25 rounded-s"
                                alt={t(store.products[0].color?.name)}
                            />
                        )}

                        <span>{t(store.products[0].color?.name)}</span>
                    </li>

                {/* Render each category dynamically */}
                {store.otherColors.map((product) => (
                    <li
                        key={product.id}
                        className={`min-w-[100px] py-1 px-1 cursor-pointer text-center rounded-3xl transition-all bg-gray-100 text-black flex flex-col justify-center items-center gap-1
                            `}
                        onClick={() => handleProductClick(product.slug)}
                    >
                        {/* Display category image if it exists */}
                        {product.product_images?.[0]?.path && (
                            <img
                                src={`${API_URL}${product.product_images?.[0]?.path}`}
                                className="img-fluid object-cover w-20 h-25 rounded-s"
                                alt={t(product.color?.name)}
                            />
                        )}

                        <span>{t(product.color?.name)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default otherColors;