//import confige Store
import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';
import shopCartSlice from './shopCartSlice';

export default configureStore({
    reducer: {
        // Add your reducers here
        cart: cartSlice,
        shopCart: shopCartSlice,
    },
})

