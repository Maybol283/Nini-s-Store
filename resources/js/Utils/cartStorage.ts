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

const CART_STORAGE_KEY = "shopping_cart";

export const cartStorage = {
    // Get cart from localStorage
    getCart(): Cart {
        try {
            const cartData = localStorage.getItem(CART_STORAGE_KEY);
            if (cartData) {
                return JSON.parse(cartData);
            }
        } catch (error) {
            console.error("Error reading cart from localStorage:", error);
        }
        return { items: {}, total: 0, itemCount: 0 };
    },

    // Save cart to localStorage
    saveCart(cart: Cart): void {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving cart to localStorage:", error);
        }
    },

    // Sync local cart with server cart
    syncWithServer(serverCart: Cart): void {
        try {
            // If server cart is empty but we have local items, keep local items
            const localCart = this.getCart();
            if (
                Object.keys(serverCart.items).length === 0 &&
                Object.keys(localCart.items).length > 0
            ) {
                return;
            }

            // Otherwise, update local storage with server cart
            this.saveCart(serverCart);
        } catch (error) {
            console.error("Error syncing cart with server:", error);
        }
    },

    // Clear cart from localStorage
    clearCart(): void {
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch (error) {
            console.error("Error clearing cart from localStorage:", error);
        }
    },

    // Add item to cart
    addItem(item: CartItem): Cart {
        const cart = this.getCart();
        if (cart.items[item.id]) {
            cart.items[item.id].quantity += item.quantity;
        } else {
            cart.items[item.id] = item;
        }
        cart.itemCount = Object.values(cart.items).reduce(
            (sum, item) => sum + item.quantity,
            0
        );
        cart.total = Object.values(cart.items).reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        this.saveCart(cart);
        return cart;
    },

    // Remove item from cart
    removeItem(itemId: string): Cart {
        const cart = this.getCart();
        if (cart.items[itemId]) {
            delete cart.items[itemId];
            cart.itemCount = Object.values(cart.items).reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            cart.total = Object.values(cart.items).reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            this.saveCart(cart);
        }
        return cart;
    },

    // Update item quantity
    updateItemQuantity(itemId: string, quantity: number): Cart {
        const cart = this.getCart();
        if (cart.items[itemId]) {
            cart.items[itemId].quantity = quantity;
            cart.itemCount = Object.values(cart.items).reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            cart.total = Object.values(cart.items).reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            this.saveCart(cart);
        }
        return cart;
    },
};
