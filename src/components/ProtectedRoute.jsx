import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth, verifyToken } = useAuth();
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            if (!auth) {
                navigate('/login');
                return;
            }

            // Eğer zaten verify edilmişse tekrar kontrol etme
            if (isVerified) return;

            try {
            const isValid = await verifyToken();
                if (isMounted) {
            if (!isValid) {
                navigate('/login');
                    } else {
                        setIsVerified(true);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (isMounted) {
                    navigate('/login');
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [auth]); // verifyToken ve navigate dependency'den çıkarıldı

    if (!auth || !isVerified) {
        return null;
    }

    return children;
};

export default ProtectedRoute; 