import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, Search, X, Grid3X3, List, Loader2 } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import MetaHelmet from '../components/MetaHelmet';
import './ProductsPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest' },
];

const CATEGORIES = ['Arts', 'Outfits', 'Study', 'Sports'];

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);

    const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
    const [selectedCats, setSelectedCats] = useState(() => {
        const cat = searchParams.get('category');
        return cat ? [cat] : [];
    });
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [gridView, setGridView] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (selectedCats.length === 1) params.set('category', selectedCats[0]);
            if (priceRange[0] > 0) params.set('minPrice', priceRange[0]);
            if (priceRange[1] < 10000) params.set('maxPrice', priceRange[1]);
            if (sort !== 'featured') params.set('sort', sort);
            params.set('page', page);
            params.set('limit', 12);

            const { data } = await axios.get(`${API}/api/products?${params.toString()}`);
            if (data.success) {
                setProducts(data.products);
                setTotal(data.total);
                setPages(data.pages);
            }
        } catch (err) {
            console.warn('API unavailable, using empty state:', err.message);
            setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [search, selectedCats, priceRange, sort, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Sync URL params
    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (selectedCats.length === 1) params.set('category', selectedCats[0]);
        if (sort !== 'featured') params.set('sort', sort);
        if (page > 1) params.set('page', page);
        setSearchParams(params, { replace: true });
    }, [search, selectedCats, sort, page]);

    const toggleCategory = (cat) => {
        setSelectedCats(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
        setPage(1);
    };

    const clearFilters = () => {
        setSelectedCats([]);
        setSearch('');
        setPriceRange([0, 10000]);
        setPage(1);
    };

    const pageTitle = selectedCats.length === 1 ? selectedCats[0] : 'All Products';

    return (
        <div className="products-page section-pad-sm">
            <MetaHelmet
                title={`${pageTitle} — The Unique Dimension`}
                description={`Shop premium ${pageTitle.toLowerCase()} at The Unique Dimension.`}
            />
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link> <span>/</span>
                    <span>All Products</span>
                    {selectedCats.length === 1 && <><span>/</span><span>{selectedCats[0]}</span></>}
                </nav>

                {/* Page Header */}
                <div className="products-header">
                    <div>
                        <h1 className="products-title">{pageTitle}</h1>
                        <p className="products-count">{loading ? '...' : `${total} products`}</p>
                    </div>
                    <div className="products-controls">
                        {/* Search */}
                        <div className="products-search">
                            <Search size={15} />
                            <input
                                type="text"
                                placeholder="Search…"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                            />
                            {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
                        </div>
                        {/* Sort */}
                        <div className="sort-select-wrap">
                            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} className="sort-select">
                                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <ChevronDown size={14} />
                        </div>
                        {/* View Toggle */}
                        <div className="view-toggle">
                            <button className={gridView ? 'active' : ''} onClick={() => setGridView(true)} aria-label="Grid view"><Grid3X3 size={16} /></button>
                            <button className={!gridView ? 'active' : ''} onClick={() => setGridView(false)} aria-label="List view"><List size={16} /></button>
                        </div>
                        {/* Mobile Filter Toggle */}
                        <button className="btn btn-outline btn-sm filter-toggle-btn" onClick={() => setFiltersOpen(!filtersOpen)}>
                            <SlidersHorizontal size={15} /> Filters
                        </button>
                    </div>
                </div>

                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <aside className={`products-sidebar ${filtersOpen ? 'open' : ''}`}>
                        <div className="filter-group">
                            <h4 className="filter-title">Categories</h4>
                            <div className="filter-options">
                                {CATEGORIES.map(cat => (
                                    <label key={cat} className="filter-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedCats.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                        />
                                        <span>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4 className="filter-title">Price Range</h4>
                            <div className="price-range">
                                <div className="price-inputs">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                                        placeholder="Min"
                                        min={0}
                                    />
                                    <span>–</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                                        placeholder="Max"
                                        min={0}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min={0} max={10000} step={100}
                                    value={priceRange[1]}
                                    onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                                    className="price-slider"
                                />
                            </div>
                        </div>

                        {(selectedCats.length > 0 || search) && (
                            <button className="btn btn-ghost btn-sm clear-filters-btn" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        )}
                    </aside>

                    {/* Products Grid */}
                    <div className={`products-grid-wrap ${gridView ? 'grid-view' : 'list-view'}`}>
                        {loading ? (
                            <div className="products-loading">
                                <Loader2 size={32} className="spin" />
                                <p>Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="products-empty">
                                <p>No products found. Try adjusting your filters.</p>
                                <button className="btn btn-primary" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {products.map(p => <ProductCard key={p._id} product={p} />)}

                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            disabled={page <= 1}
                                            onClick={() => setPage(p => p - 1)}
                                        >
                                            Previous
                                        </button>
                                        <span className="page-info">Page {page} of {pages}</span>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            disabled={page >= pages}
                                            onClick={() => setPage(p => p + 1)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
