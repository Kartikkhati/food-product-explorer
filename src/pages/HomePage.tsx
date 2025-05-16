import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProductList from '../components/ProductList';
import CategoryFilter from '../components/CategoryFilter';
import SortSelector from '../components/SortSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  fetchProducts, 
  searchProductsByName, 
  searchProductByBarcode, 
  fetchCategories,
  fetchProductsByCategory
} from '../api/foodApi';
import { Product, SortOption, Category } from '../types/productTypes';

const HomePage: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    const category = params.get('category');
    const sort = params.get('sort') as SortOption;
    
    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
    if (sort && ['name_asc', 'name_desc', 'grade_asc', 'grade_desc'].includes(sort)) {
      setSortOption(sort);
    }
  }, [location.search]);
  
  // Update URL with current filters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    params.set('sort', sortOption);
    
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, selectedCategory, sortOption, navigate]);
  
  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetchCategories();
        setCategories(response.tags || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);
  
  // Load products based on filters
  const loadProducts = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      
      if (reset) {
        setIsLoading(true);
        setProducts([]);
        setPage(1);
      } else {
        setIsLoadingMore(true);
      }
      
      setError(null);
      
      let response;
      
      if (searchQuery) {
        response = await searchProductsByName(searchQuery, currentPage);
      } else if (selectedCategory) {
        response = await fetchProductsByCategory(selectedCategory, currentPage);
      } else {
        response = await fetchProducts(currentPage);
      }
      
      const newProducts = response.products.filter(p => p.product_name);
      
      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
      
      setHasMore(newProducts.length > 0 && response.page < response.page_count);
      
      if (!reset) {
        setPage(currentPage + 1);
      }
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedCategory, page]);
  
  // Initial load and when filters change
  useEffect(() => {
    loadProducts(true);
    updateUrlParams();
  }, [searchQuery, selectedCategory, loadProducts, updateUrlParams]);
  
  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadProducts();
      }
    });
    
    if (lastProductElementRef.current) {
      observer.current.observe(lastProductElementRef.current);
    }
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, isLoadingMore, hasMore, loadProducts]);
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle barcode search
  const handleBarcodeSearch = async (barcode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await searchProductByBarcode(barcode);
      
      if (response.status === 0) {
        setError('Product not found. Please check the barcode and try again.');
        setProducts([]);
      } else if (response.product) {
        // Navigate to product detail page directly
        navigate(`/product/${barcode}`);
      }
    } catch (err) {
      setError('Failed to search product by barcode. Please try again.');
      console.error('Error searching by barcode:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    
    // Sort current products
    const sortedProducts = [...products].sort((a, b) => {
      if (sort === 'name_asc') {
        return (a.product_name || '').localeCompare(b.product_name || '');
      } else if (sort === 'name_desc') {
        return (b.product_name || '').localeCompare(a.product_name || '');
      } else if (sort === 'grade_asc') {
        const gradeA = a.nutrition_grade_fr || a.nutriscore_grade || 'z';
        const gradeB = b.nutrition_grade_fr || b.nutriscore_grade || 'z';
        return gradeA.localeCompare(gradeB);
      } else {
        const gradeA = a.nutrition_grade_fr || a.nutriscore_grade || 'z';
        const gradeB = b.nutrition_grade_fr || b.nutriscore_grade || 'z';
        return gradeB.localeCompare(gradeA);
      }
    });
    
    setProducts(sortedProducts);
    updateUrlParams();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} onBarcodeSearch={handleBarcodeSearch} />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : selectedCategory 
                ? `Category: ${selectedCategory.replace(/-/g, ' ')}` 
                : 'Explore Food Products'}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect}
              isLoading={isLoadingCategories}
            />
            
            <SortSelector currentSort={sortOption} onSortChange={handleSortChange} />
          </div>
        </div>
        
        <ProductList products={products} isLoading={isLoading} error={error} />
        
        {!isLoading && !error && products.length > 0 && (
          <div 
            ref={lastProductElementRef} 
            className="h-10 w-full flex justify-center items-center mt-6"
          >
            {isLoadingMore && <LoadingSpinner size="sm" />}
          </div>
        )}
        
        {!isLoading && !isLoadingMore && !hasMore && products.length > 0 && (
          <div className="text-center mt-8 text-gray-500">
            No more products to load
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;