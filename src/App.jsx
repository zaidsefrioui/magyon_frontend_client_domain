import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import Homepage from './pages/shop/Homepage'
import Order from './pages/shop/Order'
import OrderConfirmed from './pages/shop/OrderConfirmed'
import ProductPage from './pages/shop/ProductPage'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Shop */}
          <Route path="/" element={<Homepage />} />
          <Route path="/order" element={<Order />} />
          <Route path="/orderconfirmed/:orderCode" element={<OrderConfirmed />} />
          <Route path="/product/:productSlug" element={<ProductPage />} />
          {/* end Shop */}
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

// Public route component for login/register pages
const PublicRoute = ({ children }) => {
  // const { auth } = useAuth()
  // return auth ? <Navigate to="/store/list" /> : children
}

export default App
