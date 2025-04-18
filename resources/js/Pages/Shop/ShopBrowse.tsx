import { Fragment, useState } from "react";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/react";
import {
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import ShopLayout from "@/Layouts/ShopLayout";
import { useTrail, useTransition, a } from "@react-spring/web";
import { Link } from "@inertiajs/react";

const filters = [
    {
        id: "category",
        name: "Category",
        options: [
            { value: "scarves", label: "Scarves" },
            { value: "sweaters", label: "Sweaters" },
            { value: "hats", label: "Hats" },
            { value: "gloves", label: "Gloves" },
            { value: "miscellaneous", label: "Miscellaneous" },
        ],
    },
    {
        id: "age",
        name: "Age",
        options: [
            { value: "babies", label: "Babies" },
            { value: "children", label: "Children" },
            { value: "adults", label: "Adults" },
        ],
    },
];
const products = [
    {
        id: 1,
        name: "Winter Scarf",
        href: "#",
        price: "$45",
        description: "Warm and comfortable winter scarf.",
        category: "scarves",
        age: "adults",
        imageSrc:
            "https://plus.unsplash.com/premium_photo-1668430856694-62c7753fb03b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imageAlt: "Product image",
    },
    {
        id: 2,
        name: "Basic Tee",
        href: "#",
        price: "$32",
        category: "gloves",
        age: "babies",
        description:
            "Look like a visionary CEO and wear the same black t-shirt every day.",
        options: "Black",
        imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-02.jpg",
        imageAlt: "Front of plain black t-shirt.",
    },
    {
        id: 3,
        name: "Test 3",
        href: "#",
        price: "$16",
        category: "gloves",
        age: "babies",
        description:
            "Look like a visionary CEO and wear the same black t-shirt every day.",
        options: "Black",
        imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-02.jpg",
        imageAlt: "Front of plain black t-shirt.",
    },
];

export default function ShopBrowse() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        category: [] as string[],
        age: [] as string[],
    });
    const [filteredProducts, setFilteredProducts] = useState(products);

    const transitions = useTransition(filteredProducts, {
        keys: (product) => product.id,
        from: { opacity: 0, transform: "translate3d(0,-40px,0)" },
        enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
        trail: 200,
    });

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
        applyFilters(newFilters);
    };

    const applyFilters = (filters: { category: string[]; age: string[] }) => {
        const noFiltersSelected = Object.values(filters).every(
            (filterArray) => filterArray.length === 0
        );

        if (noFiltersSelected) {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter((product) => {
            const categoryMatch =
                filters.category.length === 0 ||
                filters.category.includes(product.category);
            const ageMatch =
                filters.age.length === 0 || filters.age.includes(product.age);
            return categoryMatch && ageMatch;
        });

        setFilteredProducts(filtered);
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
                                    {filters.map((section) => (
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
                                                                                defaultValue={
                                                                                    option.value
                                                                                }
                                                                                id={`${section.id}-${optionIdx}-mobile`}
                                                                                name={`${section.id}[]`}
                                                                                type="checkbox"
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
                        <div className="text-center border-b border-gray-200 pb-10 pt-24">
                            <form>
                                <input
                                    type="text"
                                    placeholder="What are you looking for..."
                                    className="border border-gray-300 rounded-md p-2 w-2/3"
                                    onChange={(e) =>
                                        console.log(e.target.value)
                                    }
                                />
                            </form>
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
                                    <form className="space-y-10 divide-y divide-gray-200">
                                        {filters.map((section, sectionIdx) => (
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
                                                                                defaultValue={
                                                                                    option.value
                                                                                }
                                                                                id={`${section.id}-${optionIdx}`}
                                                                                name={`${section.id}[]`}
                                                                                type="checkbox"
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
                                        ))}
                                    </form>
                                </div>
                            </div>

                            {/* Products section - takes 4 columns */}
                            <div className="lg:col-span-3">
                                {filteredProducts.length === 0 ? (
                                    <div className="flex items-center justify-center h-full py-56">
                                        <p className="text-lg text-gray-500">
                                            No products available that fit your
                                            description.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
                                        {transitions((style, product) => (
                                            <Link
                                                href={`/shop/item/${product.id}`}
                                            >
                                                <a.div
                                                    style={style}
                                                    className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                                                >
                                                    <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96">
                                                        <img
                                                            src={
                                                                product.imageSrc
                                                            }
                                                            alt={
                                                                product.imageAlt
                                                            }
                                                            className="h-full w-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div className="flex flex-1 flex-col space-y-2 p-4">
                                                        <h3 className="text-sm font-medium text-gray-900">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 line-clamp-2 h-12 overflow-hidden">
                                                            {
                                                                product.description
                                                            }
                                                        </p>
                                                        <div className="flex flex-1 flex-col justify-end">
                                                            <p className="text-base font-medium text-gray-900">
                                                                {product.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </a.div>
                                            </Link>
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
