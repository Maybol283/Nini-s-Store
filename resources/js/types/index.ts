export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
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
