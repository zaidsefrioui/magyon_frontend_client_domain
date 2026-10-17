import React, { useEffect, useRef } from "react";
import { Carousel, Image } from "antd";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProductCarousel({ product, index = 0 }) {
    const carouselRef = useRef(null);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.goTo(index, false); // ikinci parametre: animasyon
        }
    }, [index,product.id]);

    return (
        <PhotoProvider
        key={product.id}
            speed={() => 800}
            easing={(type) =>
                type === 2
                    ? 'cubic-bezier(0.36, 0, 0.66, -0.56)'
                    : 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }
            maskClassName="custom-mask"
        >
            <Carousel
                ref={carouselRef}
                dots={false}
                afterChange={(current) => console.log("Current image:", current)}
            >
                {product.product_images.map((image, i) => (
                    <div key={i} className='flex justify-center items-center'>
                        <PhotoView src={API_URL + image.path}>
                            <Image
                                preview={false} // AntD preview kapalı
                                src={API_URL + image.path}
                                alt={`Product ${i + 1}`}
                                className="mx-auto w-full h-auto md:max-h-[550px] md:w-auto rounded-lg cursor-pointer"
                            />
                        </PhotoView>
                    </div>
                ))}
            </Carousel>
        </PhotoProvider>
    );
}
