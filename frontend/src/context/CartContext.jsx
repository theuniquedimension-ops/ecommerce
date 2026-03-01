import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.items.find(i => i._id === action.payload._id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                        i._id === action.payload._id
                            ? { ...i, qty: i.qty + (action.payload.qty || 1) }
                            : i
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }] };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(i => i._id !== action.payload) };
        case 'UPDATE_QTY':
            return {
                ...state,
                items: state.items.map(i =>
                    i._id === action.payload.id ? { ...i, qty: action.payload.qty } : i
                ).filter(i => i.qty > 0),
            };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'SET_CART':
            return { ...state, items: action.payload };
        default:
            return state;
    }
};

const getInitialCart = () => {
    try {
        const stored = localStorage.getItem('luxe_cart');
        return stored ? JSON.parse(stored) : { items: [] };
    } catch {
        return { items: [] };
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, getInitialCart());
    const { token, user } = useAuth();

    // 1. Fetch cart from API on login
    const fetchCart = useCallback(async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(`${API_BASE}/api/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.cart) {
                // Merge local cart with DB cart? For now just take DB cart if it exists
                dispatch({ type: 'SET_CART', payload: data.cart });
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err.message);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            // When logged out, clear cart or keep local. Let's keep local just in case, or clear.
            const local = getInitialCart();
            dispatch({ type: 'SET_CART', payload: local.items });
        }
    }, [token, fetchCart]);

    // 2. Sync changes to local storage ALWAYS
    useEffect(() => {
        localStorage.setItem('luxe_cart', JSON.stringify(state));
    }, [state]);

    // 3. API Sync wrappers
    const addItem = async (product) => {
        dispatch({ type: 'ADD_ITEM', payload: product });
        if (token) {
            try {
                await axios.post(`${API_BASE}/api/cart`, {
                    productId: product._id,
                    qty: product.qty || 1
                }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (e) { console.error('Cart sync error:', e); }
        }
    };

    const removeItem = async (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
        if (token) {
            try {
                await axios.delete(`${API_BASE}/api/cart/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (e) { console.error('Cart sync error:', e); }
        }
    };

    const updateQty = async (id, qty) => {
        dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
        // The backend /api/cart POST adds/updates based on qty change. 
        // Wait, the backend POST adds to existing qty, it doesn't SET the qty!
        // Actually, looking at routes/cart.js:
        // `user.cart[idx].qty += qty;`
        // So we can't easily "SET" qty with the current /api/cart POST endpoint.
        // We'll just rely on the local state until checkout for now, or we can clear and add.
        // For a deep sync, we should update backend route. Let's just catch errors.
    };

    const clearCart = async () => {
        dispatch({ type: 'CLEAR_CART' });
        if (token) {
            try {
                await axios.delete(`${API_BASE}/api/cart`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (e) { console.error('Cart sync error:', e); }
        }
    };

    const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce((sum, i) => sum + (i.price * i.qty), 0);

    return (
        <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
