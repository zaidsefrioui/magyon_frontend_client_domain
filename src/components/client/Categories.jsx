import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Categories({ categories, selectedCategory, onSelectCategory,searchKeyword }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const { t } = useTranslation();
        const navigate = useNavigate();



    // If categories is empty, return null (hide the entire component)
    if (!categories || categories.length === 0) {
        return (
            <div className="mt-8"></div>
        );
    }

    const handleCategoryClick = (categoryId) => {
        onSelectCategory(categoryId); // Update the selected category in the parent component
                navigate(`?category=${categoryId}`);
            searchKeyword('');
    };

    return (
        <div>
            <ul className='flex flex-row gap-4 w-screen md:w-auto overflow-auto md:overflow-hidden pl-5 py-8 md:justify-center'>
                {/* "All" category */}
                <li
                    className={`min-w-[100px] px-6 py-10 cursor-pointer flex items-center justify-center text-center rounded-xl transition-all bg-gray-100 text-black
                        ${selectedCategory === null
                            ? 'bg-slate-950 text-white'
                            : 'bg-gray-100 text-black hover:bg-slate-950 hover:text-white'}`}
                    onClick={() => handleCategoryClick(null)}
                >
                    <span>{t('All')}</span>
                </li>

                {/* Render each category dynamically */}
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className={`min-w-[100px] py-3 px-3 cursor-pointer text-center rounded-3xl transition-all bg-gray-100 text-black flex flex-col justify-center items-center gap-2
                            ${selectedCategory === category.id
                                ? 'bg-slate-950 text-white'
                                : 'bg-gray-100 text-black hover:bg-slate-950 hover:text-white'}`}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        {/* Display category image if it exists */}
                        {category.image && (
                            <img
                                src={`${API_URL}${category.image}`}
                                className="img-fluid object-cover w-20 h-20 rounded-full"
                                alt={category.name}
                            />
                        )}

                        <span>{category.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categories;