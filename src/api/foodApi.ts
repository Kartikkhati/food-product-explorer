import { Product, ProductResponse, SearchResponse, CategoryResponse } from '../types/productTypes';

const BASE_URL = 'https://world.openfoodfacts.org';

export const fetchProducts = async (page: number = 1, pageSize: number = 24): Promise<SearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?action=process&sort_by=unique_scans_n&page_size=${pageSize}&page=${page}&json=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const searchProductsByName = async (query: string, page: number = 1, pageSize: number = 24): Promise<SearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&page_size=${pageSize}&page=${page}&json=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const searchProductByBarcode = async (barcode: string): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product by barcode: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product by barcode:', error);
    throw error;
  }
};

export const fetchProductDetails = async (barcode: string): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchCategories = async (): Promise<CategoryResponse> => {
  try {
    // Updated endpoint to use the correct API path for categories
    const response = await fetch(`${BASE_URL}/api/v0/categories.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Ensure we have the expected data structure
    if (!data || !Array.isArray(data.tags)) {
      throw new Error('Invalid categories data received from API');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchProductsByCategory = async (category: string, page: number = 1, pageSize: number = 24): Promise<SearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}&page_size=${pageSize}&page=${page}&json=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products by category: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};