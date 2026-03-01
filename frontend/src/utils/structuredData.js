// Generates JSON-LD for a Product
export const generateProductSchema = (product) => {
    if (!product) return null;
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": product.images || [],
        "description": product.description,
        "sku": product.slug, // Using slug as SKU if actual SKU is not available
        "brand": {
            "@type": "Brand",
            "name": "Luxe"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://luxe.store/products/${product.slug}`,
            "priceCurrency": "USD",
            "price": product.price,
            "priceValidUntil": "2028-12-31", // Arbitrary date in future for schema
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": "Luxe Store"
            }
        }
    };
};

// Generates JSON-LD for Breadcrumbs
export const generateBreadcrumbSchema = (items) => {
    if (!items || items.length === 0) return null;
    // items format: [{ name: 'Home', url: 'https://luxe.store' }, { name: 'Products', url: 'https://luxe.store/products' }]
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
};

// Default Website schema for the homepage
export const generateWebsiteSchema = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Luxe Store",
        "url": "https://luxe.store",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://luxe.store/products?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
};
