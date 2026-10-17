import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // İlk yüklemede localStorage'dan al
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return { token, user: JSON.parse(user) };
        }
        return null;
    });
    const [loading, setLoading] = useState(false);
    const [currentStore, setCurrentStore] = useState(() => {
        return localStorage.getItem('currentStore') || null;
    });
    const [currentStoreSlug, setCurrentStoreSlug] = useState(() => {
        return localStorage.getItem('currentStoreSlug') || null;
    });
    const [currentStorePermissionsStockSeller, setCurrentStorePermissionsStockSeller] = useState(() => {
        return localStorage.getItem('currentStorePermissionsStockSeller') || null
    });
    const [currentStorePermissionsStockEdit, setCurrentStorePermissionsStockEdit] = useState(() => {
        return localStorage.getItem('currentStorePermissionsStockEdit') || null
    });
    const [currentStorePermissionsEcommerce, setCurrentStorePermissionsEcommerce] = useState(() => {
        return localStorage.getItem('currentStorePermissionsEcommerce') || null
    });
    const [currentStorePermissionsStatistics, setCurrentStorePermissionsStatistics] = useState(() => {
        return localStorage.getItem('currentStorePermissionsStatistics') || null
    });
    const [userSuperAdmin, setUserSuperAdmin] = useState(() => {
        return localStorage.getItem('userSuperAdmin') || null
    });

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentStore');
        localStorage.removeItem('currentStoreSlug');
        localStorage.removeItem('currentStorePermissionsStockSeller');
        localStorage.removeItem('currentStorePermissionsStockEdit');
        localStorage.removeItem('currentStorePermissionsEcommerce');
        localStorage.removeItem('currentStorePermissionsStatistics');
        localStorage.removeItem('lastVerification');
        delete axios.defaults.headers.common['Authorization'];
        setAuth(null);
        setCurrentStore(null);
        setCurrentStoreSlug(null);
        setCurrentStorePermissionsStockSeller(null);
        setCurrentStorePermissionsStockEdit(null);
        setCurrentStorePermissionsEcommerce(null);
        setCurrentStorePermissionsStatistics(null);
        setUserSuperAdmin(null);
    }, []);

    // Token kontrolünü sadece gerektiğinde yap ve sonucu cache'le
    const verifyToken = useCallback(async () => {
        if (!auth?.token) return false;

        // Local storage'da verification durumunu kontrol et
        const lastVerification = localStorage.getItem('lastVerification');
        const now = Date.now();

        // Son 5 dakika içinde verify edildiyse tekrar etme
        if (lastVerification && (now - parseInt(lastVerification)) < 5 * 60 * 1000) {
            return true;
        }

        try {
            const response = await axios.get(`${API_URL}/api/auth/verify`);
            const userData = response.data.user;
            setAuth(prev => ({ ...prev, user: userData }));

            // Verification zamanını kaydet
            localStorage.setItem('lastVerification', now.toString());
            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
            return false;
        }
    }, [auth?.token, logout]);

    const login = useCallback((data) => {
        const { token, user } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuth({ token, user });
        // console.log("super admin: " + user.superAdmin);
        localStorage.setItem('userSuperAdmin', user.superAdmin);
        setUserSuperAdmin(user.superAdmin);
        // console.log("super admin 2: " + userSuperAdmin);
    }, []);

    // Axios interceptor - 401 hatalarını yakala
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [logout]);

    const selectStore = async (storeId, storeSlug) => {
        try {
            setLoading(true);
            await axios.post(`${API_URL}/api/users/default-store`, { storeId });
            localStorage.setItem('currentStore', storeId);
            setCurrentStore(storeId);
            localStorage.setItem('currentStoreSlug', storeSlug);
            setCurrentStoreSlug(storeSlug);
            try {
                const storeImage = await axios.get(`${API_URL}/api/stores/getImage/${storeId}`);
                // console.log(storeImage);
                if (storeImage.data.logo_path)
                    localStorage.setItem('currentStoreImage', storeImage.data.logo_path);
            } catch (error) {
                console.error('Failed to set default store Image:', error);
            }
            try {
                const permissons = await axios.get(`${API_URL}/api/stores/${storeId}/permissions`);
                if (permissons) {
                    // console.log(permissons.data.permission_stock_seller);


                    localStorage.setItem('currentStorePermissionsStockSeller', permissons.data.permission_stock_seller);
                    localStorage.setItem('currentStorePermissionsStockEdit', permissons.data.permission_stock_edit);
                    localStorage.setItem('currentStorePermissionsEcommerce', permissons.data.permission_ecommerce);
                    localStorage.setItem('currentStorePermissionsStatistics', permissons.data.permission_statistics);
                    setCurrentStorePermissionsStockSeller(permissons.data.permission_stock_seller);
                    setCurrentStorePermissionsStockEdit(permissons.data.permission_stock_edit);
                    setCurrentStorePermissionsEcommerce(permissons.data.permission_ecommerce);
                    setCurrentStorePermissionsStatistics(permissons.data.permission_statistics);


                }

            } catch (error) {
                console.error('Failed to set permissions:', error);
            }



        } catch (error) {
            console.error('Failed to set default store:', error);
        } finally {
            setLoading(false);
        }
    };

    // Sadece uygulama başlangıcında bir kez token kontrolü yap
    useEffect(() => {
        if (auth?.token) {
            verifyToken();
        }
        setCurrentStorePermissionsStockSeller(localStorage.getItem('currentStorePermissionsStockSeller') === "true");
        setCurrentStorePermissionsStockEdit(localStorage.getItem('currentStorePermissionsStockEdit') === "true");
        setCurrentStorePermissionsEcommerce(localStorage.getItem('currentStorePermissionsEcommerce') === "true");
        setCurrentStorePermissionsStatistics(localStorage.getItem('currentStorePermissionsStatistics') === "true");
        setUserSuperAdmin(localStorage.getItem('userSuperAdmin') === "true");
    }, []); // Boş dependency array



    return (
        <AuthContext.Provider value={{
            auth,
            login,
            logout,
            loading,
            currentStore,
            currentStoreSlug,
            currentStorePermissionsStockSeller,
            currentStorePermissionsStockEdit,
            currentStorePermissionsEcommerce,
            currentStorePermissionsStatistics,
            selectStore,
            verifyToken // checkTokenValidity yerine verifyToken kullan
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 