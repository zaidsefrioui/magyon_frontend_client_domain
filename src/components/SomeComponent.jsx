import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SomeComponent = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ... diğer kodlar
}; 