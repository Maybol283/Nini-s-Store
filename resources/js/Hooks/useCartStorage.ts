import { router } from "@inertiajs/react";

interface CartItem {
    id: string;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: {
        imageSrc: string;
        imageAlt: string;
    };
    category: string;
}

interface Cart {
    items: { [key: string]: CartItem };
    total: number;
    itemCount: number;
}

const CART_STORAGE_KEY = "crocheted_with_love_cart";

export const useCartStorage = () => {
    const getStoredCart = (): Cart => {
        if (typeof window === "undefined")
            return { items: {}, total: 0, itemCount: 0 };

        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            return JSON.parse(storedCart);
        }
        return { items: {}, total: 0, itemCount: 0 };
    };

    const updateStoredCart = (cart: Cart) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    };

    const clearStoredCart = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    };

    const syncWithServer = (serverCart: Cart) => {
        const localCart = getStoredCart();

        // If local cart exists and server cart is empty, push local cart to server
        if (
            Object.keys(localCart.items).length > 0 &&
            Object.keys(serverCart.items).length === 0
        ) {
            router.post("/cart/sync", {
                items: JSON.stringify(localCart.items),
                total: localCart.total,
                itemCount: localCart.itemCount,
            });
            return;
        }

        // Otherwise, update local storage with server cart
        updateStoredCart(serverCart);
    };

    return {
        getStoredCart,
        updateStoredCart,
        clearStoredCart,
        syncWithServer,
    };
};
