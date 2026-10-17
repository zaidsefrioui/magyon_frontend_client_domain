import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import Header from '../../components/client/Header';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Categories from '../../components/client/Categories';
import Products from '../../components/client/Products';
import Footer from '../../components/client/Footer';
import { Helmet } from 'react-helmet';
import FacebookPixelHelmet from '../../components/FacebookPixelHelmet';
import { pixelTrack } from '../../utils/fbpixel';
import { tiktokTrack } from '../../utils/tiktokPixel';
import { LoadingOutlined } from '@ant-design/icons';


const API_URL = import.meta.env.VITE_API_URL;

function Homepage() {
    const storeSlug  = import.meta.env.VITE_STORE_SLUG;
    const navigate = useNavigate();
    const [store, setStore] = useState({
        products: [],
        categories: [],
        delivery_price: 0,
        free_delivery_from: 0
    });
      const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl ? Number(categoryFromUrl) : null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchStore = async (pageNum = 1, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
                setPage(1);
                setHasMore(true);
            }

            const url = new URL(`${API_URL}/api/shop/getStore/${storeSlug}`);
            url.searchParams.append('page', pageNum);
            url.searchParams.append('limit', 8);

            if (selectedCategory) {
                url.searchParams.append('selectedCategory', selectedCategory);
            }
            if (searchKeyword) {
                url.searchParams.append('searchKeyword', searchKeyword);
                pixelTrack('Search', {
                    search_string: searchKeyword,
                    // content_category: 'Kolye',
                });
                tiktokTrack('Search', {
                    search_string: searchKeyword
                });
            }

            const response = await fetch(url);
            const data = await response.json();

            if (reset) {
                setStore(data);
            } else {
                setStore(prev => ({
                    ...data,
                    products: [...prev.products, ...data.products],
                    categories: data.categories || prev.categories
                }));
            }
                    // await new Promise(resolve => setTimeout(resolve, 2000));
            setHasMore(data.products.length > 0 && pageNum < data.totalPages);

            if (data.message === "Store not found") {
                navigate('/');
            }
                    // await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching store:', error);
            navigate('/');
        }
    };

    useEffect(() => {
        fetchStore(1, true);
    }, [storeSlug, selectedCategory]);

    const loadMoreProducts = () => {

        if (!hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStore(nextPage);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchStore(1, true);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin  indicator={<LoadingOutlined style={{ fontSize: 48, color: store.color_1 }} spin />} />

            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Helmet>
                <title>{store.name} | Magyon</title>
                <meta name="description" content={store.description} />

                {/* GA Script */}
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${store.google_analytics}`} />

                {/* gtag setup */}
                <script>
                    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${store.google_analytics}');
    `}
                </script>

                {/* Facebook Pixel Script */}
                <script type="text/javascript">
                    {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${store.meta_pixel_id}');
            fbq('track', 'PageView');
          `}
                </script>

                {/* Facebook Pixel Noscript */}
                <noscript>
                    {`<img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=${store.meta_pixel_id}&ev=PageView&noscript=1"
          />`}
                </noscript>

                <script>
                {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;
  var ttq=w[t]=w[t]||[];
  ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
  ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
  for(var i=0;i<ttq.methods.length;i++){ttq.setAndDefer(ttq,ttq.methods[i])};
  ttq.load=function(e,n){
    var i="https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i=ttq._i||{};
    ttq._i[e]=[];
    ttq._i[e]._u=i;
    ttq._t=ttq._t||{};
    ttq._t[e]=+new Date;
    ttq._o=ttq._o||{};
    ttq._o[e]=n||{};
    var o=document.createElement("script");
    o.type="text/javascript";
    o.async=true;
    o.src=i+"?sdkid="+e+"&lib="+t;
    var a=document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(o,a);
  };

  ttq.load('${store.tiktok_pixel_id}');
  ttq.page();
}(window, document, 'ttq');
`}
            </script>


                <meta property="og:title" content={store.name + " | Magyon"} />
                <meta property="og:description" content={store.description} />
                <meta property="og:image" content={`${API_URL}${store.logo_path} `} />
                {/* <meta property="og:url" content={`https://magyon.com/${store.slug}`}  /> */}
                <meta property="og:type" content="website" />

            </Helmet>
            <Header
                store={store}
                onSetSearchKeyword={setSearchKeyword}
                onSearchKeyPress={handleSearchKeyPress}
                searchKeyword={searchKeyword}
            />
            <Categories
                categories={store.categories || []}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchKeyword={setSearchKeyword}
            />
            <main className="flex-grow">
                <Products
                    products={store.products}
                    deliveryFee={store.delivery_price}
                    freeDeliveryFrom={store.free_delivery_from}
                    storeSlug={storeSlug}
                    loadMore={loadMoreProducts}
                    hasMore={hasMore}
                    delivery_company_id={store.delivery_company_id}
                    color_1={store.color_1}
                    color_2={store.color_2}
                />
                    { hasMore && (
                <div className="flex items-center justify-center mt-5">
<Spin  
style={{ color: store.color_1 }} 
indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />

                </div>
                    )

                    }
                    

            </main>
            <Footer store={store} />
        </div>
    );
}

export default Homepage;