import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import i18next from "i18next";

const shopCartSlice = createSlice({
    name: "shopCart",
    initialState: {
        cartItems: [],
        cartTotal: 0,
        cartTotalQuantity: 0,
    },
    reducers: {
        addProduct(state, action) {
            const product = action.payload;
            const withSize = product.selectedSize ? true : false;
            const productPrice = product.sale_price ? product.sale_price : product.price;

            if (withSize) {
                product.quantity = product.product_sizes.find((item) => item.name === product.selectedSize).quantity;
            }

            const existingProduct = state.cartItems.find((item) => item.id === product.id && item.size === product.selectedSize);

            if (existingProduct) {
                if (existingProduct.quantity < product.quantity) {
                    existingProduct.quantity += 1;
                    state.cartTotal += productPrice;
                    state.cartTotalQuantity += 1;
                    message.success(i18next.t('Product added to cart'));
                } else {
                    message.error(i18next.t('Product not added, out of stock'));
                }
            } else {
                const newProduct = {
                    id: product.id,
                    name: product.name,
                    price: productPrice,
                    size: product.selectedSize,
                    image: product.product_images[0].path,
                    quantity: 1,
                    maxQuantity: product.quantity, // Stok miktarını sakla
                };
                state.cartItems.push(newProduct);
                state.cartTotal += productPrice;
                state.cartTotalQuantity += 1;
                message.success(i18next.t('Product added to cart'));
            }
        },
        removeProduct(state, action) {
            const product = action.payload;
            let existingProduct = null;
            if (product.size) {
                existingProduct = state.cartItems.find((item) => item.id === product.id && item.size === product.size);
            } else {
                existingProduct = state.cartItems.find((item) => item.id === product.id);
            }

            if (existingProduct) {
                state.cartItems = state.cartItems.filter((item) => item.id !== product.id || item.size !== product.size);
                state.cartTotal -= existingProduct.price * existingProduct.quantity;
                state.cartTotalQuantity -= existingProduct.quantity;
            }
        },
        increaseQuantity(state, action) {
            const product = action.payload;
            const existingProduct = state.cartItems.find((item) => item.id === product.id && item.size === product.size);

            if (existingProduct && existingProduct.quantity < existingProduct.maxQuantity) {
                existingProduct.quantity += 1;
                state.cartTotal += existingProduct.price;
                state.cartTotalQuantity += 1;
            }
        },
        decreaseQuantity(state, action) {
            const product = action.payload;
            const existingProduct = state.cartItems.find((item) => item.id === product.id && item.size === product.size);

            if (existingProduct && existingProduct.quantity > 1) {
                existingProduct.quantity -= 1;
                state.cartTotal -= existingProduct.price;
                state.cartTotalQuantity -= 1;
            }
        },
        clearCart(state) {
            state.cartItems = [];
            state.cartTotal = 0;
            state.cartTotalQuantity = 0;
        },
    },
});

export const { addProduct, removeProduct, increaseQuantity, decreaseQuantity, clearCart } = shopCartSlice.actions;
export default shopCartSlice.reducer;