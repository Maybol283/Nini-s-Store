import { Config } from "ziggy-js";
import { FormDataConvertible } from "@inertiajs/core";

// Base interfaces
export interface Image {
    imageSrc: string;
    imageAlt: string;
}

export interface Auth {
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
}

// Product related interfaces
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category:
        | "scarves"
        | "sweaters"
        | "hats"
        | "gloves"
        | "dresses"
        | "miscellaneous";
    age_group: "adult" | "baby";
    sizes: string[];
    images: Image[];
    in_stock: boolean;
    stock_quantity: number;
    created_at?: string;
}

export interface ProductForm {
    name: string;
    price: number;
    description: string;
    category: string;
    age_group: string;
    size: string;
    images: File[];
    inStock: boolean;
    [key: string]: FormDataConvertible | FormDataConvertible[] | undefined;
}

export interface ImageError {
    file: File;
    error: string;
}

// Cart related interfaces
export interface CartItem {
    id: string;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: Image;
    category: string;
}

export interface Cart {
    items: { [key: string]: CartItem };
    total: number;
    itemCount: number;
}

// Component Props interfaces
export interface ProductCardProps {
    product: Product;
    style?: any;
    className?: string;
    showDescription?: boolean;
    truncateDescription?: boolean;
    onClick?: () => void;
}

export interface CartPanelProps {
    cartItems: CartItem[];
    position?: "mobile" | "desktop";
}

export interface Filters {
    search: string;
    category: string;
    age_group: string;
    stock_status: string;
    sort: string;
    direction: string;
}

// Page Props
export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: Auth;
    flash: {
        success: string | null;
        error: string | null;
        stripe_payment_intent?: string | null;
        clientSecret?: string | null;
    };
    ziggy: Config & { location: string };
    cart: Cart;
    stripeKey?: string;
    clientSecret?: string;
    stripeError?: string;
};
