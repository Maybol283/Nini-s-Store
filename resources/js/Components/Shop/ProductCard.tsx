import React from "react";
import { Link } from "@inertiajs/react";
import { Product } from "@/types";

interface ProductCardProps {
    product: Product;
    // For react-spring compatibility, we'll use refs
    style?: any;
    className?: string;
    // Option to show/hide description
    showDescription?: boolean;
    // Option to truncate description
    truncateDescription?: boolean;
    // Option for custom action on click
    onClick?: () => void;
}

export default function ProductCard({
    product,
    style,
    className = "group relative bg-white rounded-lg shadow overflow-hidden",
    showDescription = false,
    truncateDescription = false,
    onClick,
}: ProductCardProps) {
    const formattedPrice =
        typeof product.price === "number"
            ? product.price.toFixed(2)
            : product.price;

    // Truncate description if needed
    const displayDescription =
        truncateDescription && product.description?.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description;

    // Create the card content
    const cardContent = (
        <>
            <div className="aspect-square w-full overflow-hidden">
                <img
                    src={
                        product.images && product.images.length > 0
                            ? product.images[0].imageSrc
                            : "/images/placeholder.png"
                    }
                    alt={
                        product.images && product.images.length > 0
                            ? product.images[0].imageAlt
                            : product.name
                    }
                    className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-90"
                />
            </div>
            <div className="p-4">
                <h3 className="text-sm font-bold text-gray-700">
                    {product.name}
                </h3>
                {showDescription && product.description && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                        {displayDescription}
                    </p>
                )}
                <p className="mt-1 text-lg font-medium text-gray-900">
                    £{formattedPrice}
                </p>
            </div>
        </>
    );

    // For animated cards, we'll let the parent component handle it
    // by returning just the content
    return (
        <div style={style} className={className}>
            {onClick ? (
                <button onClick={onClick} className="w-full text-left">
                    {cardContent}
                </button>
            ) : (
                <Link href={`/shop/item/${product.id}`}>{cardContent}</Link>
            )}
        </div>
    );
}
