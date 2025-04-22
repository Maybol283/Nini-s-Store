import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    owner: string;
    photo: string;
    deleted_at: string;
    account: Account;
}

export interface Account {
    id: number;
    name: string;
    users: User[];
    contacts: Contact[];
    organizations: Organization[];
}

export interface Contact {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
    deleted_at: string;
    organization_id: number;
    organization: Organization;
}

export interface Organization {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
    deleted_at: string;
    contacts: Contact[];
}

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };

    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;

        links: {
            url: null | string;
            label: string;
            active: boolean;
        }[];
    };
};

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: "scarves" | "sweaters" | "hats" | "gloves" | "miscellaneous";
    age_group: "adult" | "baby";
    sizes: string[];
    images: {
        imageSrc: string;
        imageAlt: string;
    }[];
    in_stock: boolean;
    stock_quantity: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    flash: {
        success: string | null;
        error: string | null;
    };
    ziggy: Config & { location: string };
};

declare module "@inertiajs/core" {
    interface PageProps {
        "Shop/ShopItem": {
            product: Product;
        };
    }
}
