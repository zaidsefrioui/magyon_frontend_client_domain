import React from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductImagePreview({ product }) {
    const images = product?.product_images?.length
        ? product.product_images.map(img => `${API_URL}${img.path}`)
        : [];

    if (!images.length) return null;

    return (
        <PhotoProvider
        key={product.id}
            speed={() => 800}
            easing={(type) =>
                type === 2
                    ? 'cubic-bezier(0.36, 0, 0.66, -0.56)'
                    : 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }
            className="!touch-pan-y"
            maskClassName="custom-mask"

        >
            {/* Sadece ilk resim gösteriliyor */}
            <PhotoView src={images[0]} key={0}>
                <img
                    src={images[0]}
                    alt={product.name}
                    className="!h-[170px] !w-full !object-cover !rounded-md cursor-pointer"
                />
            </PhotoView>

            {/* Diğer resimler preview içinde geçiş için */}
            {images.slice(1).map((src, index) => (
                <PhotoView src={src} key={index + 1} />
            ))}
        </PhotoProvider>
    );
}
