import { CartItem, Cart } from "@/types";

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
    syncWithServer(serverCart: Cart | undefined | null): void {
        try {
            // Ensure serverCart is not null or undefined
            if (!serverCart) {
                return;
            }

            // Create a normalized server cart with default values for missing properties
            const normalizedServerCart = {
                items: serverCart.items || {},
                total: serverCart.total || 0,
                itemCount: serverCart.itemCount || 0,
            };

            // If server cart is empty but we have local items, keep local items
            const localCart = this.getCart();
            if (
                Object.keys(normalizedServerCart.items).length === 0 &&
                Object.keys(localCart.items).length > 0
            ) {
                return;
            }

            // Otherwise, update local storage with normalized server cart
            this.saveCart(normalizedServerCart);
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
        // Always set quantity to 1
        item.quantity = 1;

        if (cart.items[item.id]) {
            // If item exists, don't add it again
            return cart;
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
        console.log(cart.items[itemId]);
        console.log(cart.items);
        if (cart.items[itemId]) {
            delete cart.items[itemId];
            console.log(cart);
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
            // Force quantity to be 1
            cart.items[itemId].quantity = 1;
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
