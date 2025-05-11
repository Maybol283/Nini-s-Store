import { Fragment, useState, useEffect } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import {
    XMarkIcon,
    AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import ShopLayout from "@/Layouts/ShopLayout";
import { useTransition, a } from "@react-spring/web";
import { router } from "@inertiajs/react";
import { Product } from "@/types";
import ProductCard from "@/Components/Shop/ProductCard";

interface Props {
    ageGroup: string;
    products: Product[];
    categories: string[];
    filters?: {
        q: string;
        category: string;
        age_group: string;
        sort: string;
        direction: string;
        show_out_of_stock: boolean;
    };
}

const categories = [
    { value: "scarves", label: "Scarves" },
    { value: "sweaters", label: "Sweaters" },
    { value: "hats", label: "Hats" },
    { value: "gloves", label: "Gloves" },
    { value: "miscellaneous", label: "Miscellaneous" },
];

const sizes: {
    adult: { value: string; label: string }[];
    baby: { value: string; label: string }[];
    [key: string]: { value: string; label: string }[];
} = {
    adult: [
        { value: "S", label: "S" },
        { value: "M", label: "M" },
        { value: "L", label: "L" },
        { value: "XL", label: "XL" },
    ],
    baby: [
        { value: "0-3", label: "0-3 Months" },
        { value: "3-6", label: "3-6 Months" },
        { value: "6-9", label: "6-9 Months" },
        { value: "9-12", label: "9-12 Months" },
        { value: "12-18", label: "12-18 Months" },
        { value: "18-24", label: "18-24 Months" },
    ],
};

const initialFilterOptions = [
    {
        id: "category",
        name: "Category",
        options: categories,
    },
    {
        id: "size",
        name: "Size",
        options: [], // Will be populated based on age group
    },
];

export default function ShopBrowse({
    ageGroup,
    products,
    categories,
    filters,
}: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        category:
            filters?.category !== "all" && filters?.category
                ? [filters.category]
                : [],
        size: [] as string[],
    });

    // Convert filterOptions to a state variable
    const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

    // Set the appropriate size options based on age group
    useEffect(() => {
        if (typeof ageGroup === "string" && ageGroup in sizes) {
            setFilterOptions((prevOptions) => {
                // Create a new array to ensure React detects the change
                return prevOptions.map((option) =>
                    option.id === "size"
                        ? { ...option, options: sizes[ageGroup] }
                        : option
                );
            });
        } else {
            setFilterOptions((prevOptions) => {
                return prevOptions.map((option) =>
                    option.id === "size" ? { ...option, options: [] } : option
                );
            });
        }
    }, [ageGroup]);

    // Keep track of products from the server
    const [searchTerm, setSearchTerm] = useState(filters?.q || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || "all"
    );
    const [sortOption, setSortOption] = useState(filters?.sort || "created_at");
    const [sortDirection, setSortDirection] = useState(
        filters?.direction || "desc"
    );
    const [showOutOfStock, setShowOutOfStock] = useState(
        filters?.show_out_of_stock || false
    );
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    // Transitions for animation
    const transitions = useTransition(products, {
        keys: (product) => product.id,
        from: { opacity: 0, transform: "translate3d(0,-40px,0)" },
        enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
        trail: 200,
    });

    const sortOptions = [
        {
            value: "created_at:desc",
            label: "Newest",
            option: "created_at",
            direction: "desc",
        },
        {
            value: "price:asc",
            label: "Price: Low to High",
            option: "price",
            direction: "asc",
        },
        {
            value: "price:desc",
            label: "Price: High to Low",
            option: "price",
            direction: "desc",
        },
    ];

    // When checkbox filters change, update the filter state
    const updateFilters = (
        checked: boolean,
        value: string,
        filterType: keyof typeof selectedFilters
    ) => {
        const newFilters = { ...selectedFilters };

        if (checked) {
            newFilters[filterType] = [...newFilters[filterType], value];
        } else {
            newFilters[filterType] = newFilters[filterType].filter(
                (val) => val !== value
            );
        }

        setSelectedFilters(newFilters);

        // If it's a category filter, also update the selectedCategory
        if (filterType === "category") {
            if (checked && newFilters.category.length === 1) {
                setSelectedCategory(value);
            } else if (!checked && selectedCategory === value) {
                setSelectedCategory("all");
            }
        }

        // Auto-apply filters after a short delay to avoid too many requests
        const timeoutId = setTimeout(() => {
            applyFiltersFromRouter(newFilters);
        }, 100);

        return () => clearTimeout(timeoutId);
    };

    // Apply filters and sorting via backend with optional filter override
    const applyFiltersFromRouter = (filterOverride?: {
        category: string[];
        size: string[];
    }) => {
        const filtersToUse = filterOverride || selectedFilters;

        // Update the local state immediately to ensure UI consistency
        if (filterOverride) {
            setSelectedFilters(filterOverride);
        }

        // Always make sure size options are populated based on the original age group
        if (typeof ageGroup === "string" && ageGroup in sizes) {
            setFilterOptions((prevOptions) => {
                return prevOptions.map((option) =>
                    option.id === "size"
                        ? { ...option, options: sizes[ageGroup] }
                        : option
                );
            });
        }

        // Check if all filters are cleared and we should go back to the base URL
        const allFiltersCleared =
            filtersToUse.category.length === 0 &&
            filtersToUse.size.length === 0 &&
            !searchTerm &&
            sortOption === "created_at" &&
            sortDirection === "desc" &&
            !showOutOfStock;

        // If all filters cleared, just go to the base age group page
        if (allFiltersCleared && typeof ageGroup === "string") {
            router.visit(`/shop/${ageGroup}`, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
            return;
        }

        // For category, use the selected category from dropdown or the first selected filter if any
        const categoryParam =
            selectedCategory !== "all"
                ? selectedCategory
                : filtersToUse.category.length > 0
                ? filtersToUse.category[0]
                : "all";

        // Always include parameters (even empty ones) to ensure consistent behavior
        const params = new URLSearchParams();

        // Search term (optional)
        if (searchTerm) {
            params.append("q", searchTerm);
        }

        // Always append category parameter
        params.append("category", categoryParam);

        // Always append size parameter (even if empty)
        params.append("size", filtersToUse.size.join(","));

        // Sort parameters (if non-default)
        if (sortOption !== "created_at" || sortDirection !== "desc") {
            params.append("sort", sortOption);
            params.append("direction", sortDirection);
        }

        // Stock parameter (if showing out of stock)
        if (showOutOfStock) {
            params.append("show_out_of_stock", "true");
        }

        // Use the correct route based on the age group
        const baseRoute =
            typeof ageGroup === "string" ? `/shop/${ageGroup}s` : "/shop";

        router.visit(
            `${baseRoute}${params.toString() ? `?${params.toString()}` : ""}`,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    // Handle sort selection from dropdown
    const handleSortSelection = (sortValue: string) => {
        const [option, direction] = sortValue.split(":");
        setSortOption(option);
        setSortDirection(direction as "asc" | "desc");
        setSortDropdownOpen(false);

        // Check if this would clear all filters and we should go back to the base URL
        const allFiltersCleared =
            selectedFilters.category.length === 0 &&
            selectedFilters.size.length === 0 &&
            !searchTerm &&
            option === "created_at" &&
            direction === "desc" &&
            !showOutOfStock;

        // If all filters cleared and we have an age group, go to the age group browse page
        if (allFiltersCleared && typeof ageGroup === "string") {
            router.visit(`/shop/${ageGroup}`, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
            return;
        }

        // Always include all parameters for consistency
        const params = new URLSearchParams();

        // Search term (optional)
        if (searchTerm) {
            params.append("q", searchTerm);
        }

        // Always include category
        params.append("category", selectedCategory);

        // Size parameter (even if empty)
        params.append("size", selectedFilters.size.join(","));

        // Always include sort parameters
        params.append("sort", option);
        params.append("direction", direction);

        // Stock parameter (if showing out of stock)
        if (showOutOfStock) {
            params.append("show_out_of_stock", "true");
        }

        // Use the correct route based on the age group
        const baseRoute =
            typeof ageGroup === "string" ? `/shop/${ageGroup}s` : "/shop";

        router.visit(
            `${baseRoute}${params.toString() ? `?${params.toString()}` : ""}`,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <ShopLayout>
            <div className="min-h-svh bg-beige font-sans">
                <div>
                    {/* Mobile menu */}
                    <Dialog
                        open={mobileMenuOpen}
                        onClose={setMobileMenuOpen}
                        className="relative z-40 lg:hidden"
                    >
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                        />

                        <div className="fixed inset-0 z-40 flex">
                            <DialogPanel
                                transition
                                className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                            >
                                <div className="flex px-4 pb-2 pt-5">
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                    >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <XMarkIcon
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </button>
                                </div>
                            </DialogPanel>
                        </div>
                    </Dialog>
                </div>

                <div>
                    {/* Mobile filter dialog */}
                    <Dialog
                        open={mobileFiltersOpen}
                        onClose={setMobileFiltersOpen}
                        className="relative z-40 lg:hidden"
                    >
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                        />

                        <div className="fixed inset-0 z-40 flex">
                            <DialogPanel
                                transition
                                className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
                            >
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Filters
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileFiltersOpen(false)
                                        }
                                        className="relative -mr-2 flex size-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="absolute -inset-0.5" />
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <XMarkIcon
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </button>
                                </div>

                                {/* Filters */}
                                <form className="mt-4">
                                    {filterOptions.map((section) => (
                                        <Disclosure
                                            key={section.name}
                                            as="div"
                                            className="border-t border-gray-200 pb-4 pt-4"
                                        >
                                            <fieldset>
                                                <legend className="w-full px-2">
                                                    <DisclosureButton className="group flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {section.name}
                                                        </span>
                                                        <span className="ml-6 flex h-7 items-center">
                                                            <ChevronDownIcon
                                                                aria-hidden="true"
                                                                className="size-5 rotate-0 transform group-data-[open]:-rotate-180"
                                                            />
                                                        </span>
                                                    </DisclosureButton>
                                                </legend>
                                                <DisclosurePanel className="px-4 pb-2 pt-4">
                                                    <div className="space-y-6">
                                                        {section.options.map(
                                                            (
                                                                option,
                                                                optionIdx
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    className="flex gap-3"
                                                                >
                                                                    <div className="flex h-5 shrink-0 items-center">
                                                                        <div className="group grid size-4 grid-cols-1">
                                                                            <input
                                                                                value={
                                                                                    option.value
                                                                                }
                                                                                id={`${section.id}-${optionIdx}-mobile`}
                                                                                name={`${section.id}[]`}
                                                                                type="checkbox"
                                                                                checked={
                                                                                    section.id ===
                                                                                    "category"
                                                                                        ? selectedFilters.category.includes(
                                                                                              option.value
                                                                                          )
                                                                                        : section.id ===
                                                                                          "size"
                                                                                        ? selectedFilters.size.includes(
                                                                                              option.value
                                                                                          )
                                                                                        : false
                                                                                }
                                                                                className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    updateFilters(
                                                                                        e
                                                                                            .target
                                                                                            .checked,
                                                                                        option.value,
                                                                                        section.id as keyof typeof selectedFilters
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <label
                                                                        htmlFor={`${section.id}-${optionIdx}-mobile`}
                                                                        className="text-sm text-gray-500"
                                                                    >
                                                                        {
                                                                            option.label
                                                                        }
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </DisclosurePanel>
                                            </fieldset>
                                        </Disclosure>
                                    ))}
                                </form>
                            </DialogPanel>
                        </div>
                    </Dialog>

                    <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-6 pt-24">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {filters?.age_group &&
                                filters.age_group !== "all"
                                    ? filters.age_group
                                          .charAt(0)
                                          .toUpperCase() +
                                      filters.age_group.slice(1)
                                    : typeof ageGroup === "string"
                                    ? ageGroup.charAt(0).toUpperCase() +
                                      ageGroup.slice(1)
                                    : ""}{" "}
                                Products
                            </h1>

                            {/* Sort dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setSortDropdownOpen(!sortDropdownOpen)
                                    }
                                    className="flex items-center text-gray-600 hover:text-gray-900"
                                >
                                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
                                    <span className="hidden sm:inline-block">
                                        Sort
                                    </span>
                                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                                </button>

                                {sortDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                        <div
                                            className="py-1"
                                            role="menu"
                                            aria-orientation="vertical"
                                        >
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() =>
                                                        handleSortSelection(
                                                            option.value
                                                        )
                                                    }
                                                    className={`${
                                                        sortOption ===
                                                            option.option &&
                                                        sortDirection ===
                                                            option.direction
                                                            ? "bg-gray-100 text-gray-900"
                                                            : "text-gray-700"
                                                    } block px-4 py-2 text-sm w-full text-left hover:bg-gray-50`}
                                                    role="menuitem"
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pb-24 pt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
                            {/* Filters section - takes 1 column */}
                            <div className="lg:col-span-1">
                                <h2 className="sr-only">Filters</h2>

                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="inline-flex items-center lg:hidden"
                                >
                                    <span className="text-sm font-medium text-gray-700">
                                        Filters
                                    </span>
                                    <PlusIcon
                                        aria-hidden="true"
                                        className="ml-1 size-5 shrink-0 text-gray-400"
                                    />
                                </button>

                                <div className="hidden lg:block">
                                    <div className="border-b border-gray-200">
                                        {/* Filter sections */}
                                        <div className="pt-6">
                                            {filterOptions.map(
                                                (section, sectionIdx) => (
                                                    <div
                                                        key={section.name}
                                                        className={
                                                            sectionIdx === 0
                                                                ? undefined
                                                                : "pt-10"
                                                        }
                                                    >
                                                        <fieldset>
                                                            <legend className="block text-sm font-medium text-gray-900">
                                                                {section.name}
                                                            </legend>
                                                            <div className="space-y-3 pt-6">
                                                                {section.options.map(
                                                                    (
                                                                        option,
                                                                        optionIdx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            className="flex gap-3"
                                                                        >
                                                                            <div className="flex h-5 shrink-0 items-center">
                                                                                <div className="group grid size-4 grid-cols-1">
                                                                                    <input
                                                                                        value={
                                                                                            option.value
                                                                                        }
                                                                                        id={`${section.id}-${optionIdx}`}
                                                                                        name={`${section.id}[]`}
                                                                                        type="checkbox"
                                                                                        checked={
                                                                                            section.id ===
                                                                                            "category"
                                                                                                ? selectedFilters.category.includes(
                                                                                                      option.value
                                                                                                  )
                                                                                                : section.id ===
                                                                                                  "size"
                                                                                                ? selectedFilters.size.includes(
                                                                                                      option.value
                                                                                                  )
                                                                                                : false
                                                                                        }
                                                                                        className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            updateFilters(
                                                                                                e
                                                                                                    .target
                                                                                                    .checked,
                                                                                                option.value,
                                                                                                section.id as keyof typeof selectedFilters
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <svg
                                                                                        fill="none"
                                                                                        viewBox="0 0 14 14"
                                                                                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                                                                    >
                                                                                        <path
                                                                                            d="M3 8L6 11L11 3.5"
                                                                                            strokeWidth={
                                                                                                2
                                                                                            }
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            className="opacity-0 group-has-[:checked]:opacity-100"
                                                                                        />
                                                                                        <path
                                                                                            d="M3 7H11"
                                                                                            strokeWidth={
                                                                                                2
                                                                                            }
                                                                                            strokeLinecap="round"
                                                                                            strokeLinejoin="round"
                                                                                            className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                                                                        />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                            <label
                                                                                htmlFor={`${section.id}-${optionIdx}`}
                                                                                className="text-sm text-gray-500"
                                                                            >
                                                                                {
                                                                                    option.label
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products section - takes 3 columns */}
                            <div className="lg:col-span-3">
                                {products.length === 0 ? (
                                    <div className="flex items-center justify-center h-full py-56">
                                        <p className="text-lg text-gray-500">
                                            No products available that fit your
                                            description.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                        {transitions((style, product) => (
                                            <a.div
                                                style={style}
                                                key={product.id}
                                            >
                                                <ProductCard
                                                    product={product}
                                                    showDescription={true}
                                                />
                                            </a.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ShopLayout>
    );
}
