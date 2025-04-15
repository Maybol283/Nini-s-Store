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

const navigation = {
    categories: [
        {
            id: "women",
            name: "Women",
            featured: [
                {
                    name: "New Arrivals",
                    href: "#",
                    imageSrc:
                        "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg",
                    imageAlt:
                        "Models sitting back to back, wearing Basic Tee in black and bone.",
                },
                {
                    name: "Basic Tees",
                    href: "#",
                    imageSrc:
                        "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg",
                    imageAlt:
                        "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
                },
            ],
            sections: [
                {
                    id: "clothing",
                    name: "Clothing",
                    items: [
                        { name: "Tops", href: "#" },
                        { name: "Dresses", href: "#" },
                        { name: "Pants", href: "#" },
                        { name: "Denim", href: "#" },
                        { name: "Sweaters", href: "#" },
                        { name: "T-Shirts", href: "#" },
                        { name: "Jackets", href: "#" },
                        { name: "Activewear", href: "#" },
                        { name: "Browse All", href: "#" },
                    ],
                },
                {
                    id: "accessories",
                    name: "Accessories",
                    items: [
                        { name: "Watches", href: "#" },
                        { name: "Wallets", href: "#" },
                        { name: "Bags", href: "#" },
                        { name: "Sunglasses", href: "#" },
                        { name: "Hats", href: "#" },
                        { name: "Belts", href: "#" },
                    ],
                },
                {
                    id: "brands",
                    name: "Brands",
                    items: [
                        { name: "Full Nelson", href: "#" },
                        { name: "My Way", href: "#" },
                        { name: "Re-Arranged", href: "#" },
                        { name: "Counterfeit", href: "#" },
                        { name: "Significant Other", href: "#" },
                    ],
                },
            ],
        },
        {
            id: "men",
            name: "Men",
            featured: [
                {
                    name: "New Arrivals",
                    href: "#",
                    imageSrc:
                        "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
                    imageAlt:
                        "Drawstring top with elastic loop closure and textured interior padding.",
                },
                {
                    name: "Artwork Tees",
                    href: "#",
                    imageSrc:
                        "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg",
                    imageAlt:
                        "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
                },
            ],
            sections: [
                {
                    id: "clothing",
                    name: "Clothing",
                    items: [
                        { name: "Tops", href: "#" },
                        { name: "Pants", href: "#" },
                        { name: "Sweaters", href: "#" },
                        { name: "T-Shirts", href: "#" },
                        { name: "Jackets", href: "#" },
                        { name: "Activewear", href: "#" },
                        { name: "Browse All", href: "#" },
                    ],
                },
                {
                    id: "accessories",
                    name: "Accessories",
                    items: [
                        { name: "Watches", href: "#" },
                        { name: "Wallets", href: "#" },
                        { name: "Bags", href: "#" },
                        { name: "Sunglasses", href: "#" },
                        { name: "Hats", href: "#" },
                        { name: "Belts", href: "#" },
                    ],
                },
                {
                    id: "brands",
                    name: "Brands",
                    items: [
                        { name: "Re-Arranged", href: "#" },
                        { name: "Counterfeit", href: "#" },
                        { name: "Full Nelson", href: "#" },
                        { name: "My Way", href: "#" },
                    ],
                },
            ],
        },
    ],
    pages: [
        { name: "Company", href: "#" },
        { name: "Stores", href: "#" },
    ],
};
const breadcrumbs = [{ id: 1, name: "Men", href: "#" }];
const filters = [
    {
        id: "category",
        name: "Category",
        options: [
            { value: "scarves", label: "Scarves" },
            { value: "sweaters", label: "Sweaters" },
            { value: "hats", label: "Hats" },
            { value: "gloves", label: "Gloves" },
            { value: "miscellaneous", label: "Miscelleaneous" },
        ],
    },
];
const products = [
    {
        id: 1,
        name: "Basic Tee 8-Pack",
        href: "#",
        price: "$256",
        description:
            "Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.",
        options: "8 colors",
        imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-01.jpg",
        imageAlt:
            "Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.",
    },
    {
        id: 2,
        name: "Basic Tee",
        href: "#",
        price: "$32",
        description:
            "Look like a visionary CEO and wear the same black t-shirt every day.",
        options: "Black",
        imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-02.jpg",
        imageAlt: "Front of plain black t-shirt.",
    },
    // More products...
];
const footerNavigation = {
    products: [
        { name: "Bags", href: "#" },
        { name: "Tees", href: "#" },
        { name: "Objects", href: "#" },
        { name: "Home Goods", href: "#" },
        { name: "Accessories", href: "#" },
    ],
    company: [
        { name: "Who we are", href: "#" },
        { name: "Sustainability", href: "#" },
        { name: "Press", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Terms & Conditions", href: "#" },
        { name: "Privacy", href: "#" },
    ],
    customerService: [
        { name: "Contact", href: "#" },
        { name: "Shipping", href: "#" },
        { name: "Returns", href: "#" },
        { name: "Warranty", href: "#" },
        { name: "Secure Payments", href: "#" },
        { name: "FAQ", href: "#" },
        { name: "Find a store", href: "#" },
    ],
};

export default function ShopBrowse() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <ShopLayout>
            <div className="bg-beige font-sans">
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

                                {/* Links */}
                                <TabGroup className="mt-2">
                                    <div className="border-b border-gray-200">
                                        <TabList className="-mb-px flex space-x-8 px-4">
                                            {navigation.categories.map(
                                                (category) => (
                                                    <Tab
                                                        key={category.name}
                                                        className="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-[selected]:border-indigo-600 data-[selected]:text-indigo-600"
                                                    >
                                                        {category.name}
                                                    </Tab>
                                                )
                                            )}
                                        </TabList>
                                    </div>
                                    <TabPanels as={Fragment}>
                                        {navigation.categories.map(
                                            (category) => (
                                                <TabPanel
                                                    key={category.name}
                                                    className="space-y-10 px-4 pb-8 pt-10"
                                                >
                                                    <div className="grid grid-cols-2 gap-x-4">
                                                        {category.featured.map(
                                                            (item) => (
                                                                <div
                                                                    key={
                                                                        item.name
                                                                    }
                                                                    className="group relative text-sm"
                                                                >
                                                                    <img
                                                                        alt={
                                                                            item.imageAlt
                                                                        }
                                                                        src={
                                                                            item.imageSrc
                                                                        }
                                                                        className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                                                    />
                                                                    <a
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        className="mt-6 block font-medium text-gray-900"
                                                                    >
                                                                        <span
                                                                            aria-hidden="true"
                                                                            className="absolute inset-0 z-10"
                                                                        />
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </a>
                                                                    <p
                                                                        aria-hidden="true"
                                                                        className="mt-1"
                                                                    >
                                                                        Shop now
                                                                    </p>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                    {category.sections.map(
                                                        (section) => (
                                                            <div
                                                                key={
                                                                    section.name
                                                                }
                                                            >
                                                                <p
                                                                    id={`${category.id}-${section.id}-heading-mobile`}
                                                                    className="font-medium text-gray-900"
                                                                >
                                                                    {
                                                                        section.name
                                                                    }
                                                                </p>
                                                                <ul
                                                                    role="list"
                                                                    aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                                                    className="mt-6 flex flex-col space-y-6"
                                                                >
                                                                    {section.items.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    item.name
                                                                                }
                                                                                className="flow-root"
                                                                            >
                                                                                <a
                                                                                    href={
                                                                                        item.href
                                                                                    }
                                                                                    className="-m-2 block p-2 text-gray-500"
                                                                                >
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </a>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        )
                                                    )}
                                                </TabPanel>
                                            )
                                        )}
                                    </TabPanels>
                                </TabGroup>
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

                        <div className="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
                            <aside>
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
                                    <form className="divide-y divide-gray-200">
                                        {filters.map((section) => (
                                            <div
                                                key={section.name}
                                                className="py-10 first:pt-0 last:pb-0"
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
                                                                        className="text-sm text-gray-600"
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
                            </aside>

                            <section
                                aria-labelledby="product-heading"
                                className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
                            >
                                <h2 id="product-heading" className="sr-only">
                                    Products
                                </h2>

                                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                                        >
                                            <img
                                                alt={product.imageAlt}
                                                src={product.imageSrc}
                                                className="aspect-[3/4] bg-gray-200 object-cover group-hover:opacity-75 sm:h-96"
                                            />
                                            <div className="flex flex-1 flex-col space-y-2 p-4">
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    <a href={product.href}>
                                                        <span
                                                            aria-hidden="true"
                                                            className="absolute inset-0"
                                                        />
                                                        {product.name}
                                                    </a>
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {product.description}
                                                </p>
                                                <div className="flex flex-1 flex-col justify-end">
                                                    <p className="text-sm italic text-gray-500">
                                                        {product.options}
                                                    </p>
                                                    <p className="text-base font-medium text-gray-900">
                                                        {product.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </ShopLayout>
    );
}
