import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // ProtectedRoute'ı import et

const StoreLayout = () => {
    return (
        <ProtectedRoute>
            <Outlet /> {/* Bu, alt sayfalara yönlendirecek */}
        </ProtectedRoute>
    );
};

export default StoreLayout;
