import { mockProducts, mockCategories } from '../data/mockData';

export interface ProductData {
  id?: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  isAvailable: boolean;
  hotelId: string;
  hotelName: string;
  profitMargin: number;
  salesData: {
    totalSales: number;
    lastMonthSales: number;
    revenue: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryData {
  id?: string;
  name: string;
  description?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Get catalog products with optional filtering
export const getCatalogProducts = async (
  token: string,
  userId?: string,
  filters?: { 
    categoryId?: string;
    search?: string;
    sortBy?: 'name' | 'price' | 'createdAt';
    order?: 'asc' | 'desc';
  }
) => {
  // Filter and sort the mock products
  let filteredProducts = [...mockProducts];
  
  if (filters?.categoryId) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description?.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters?.sortBy) {
    filteredProducts.sort((a, b) => {
      const order = filters.order === 'desc' ? -1 : 1;
      switch (filters.sortBy) {
        case 'name':
          return order * a.name.localeCompare(b.name);
        case 'price':
          return order * (a.price - b.price);
        case 'createdAt':
          return -1; // Mock data doesn't track creation time, default to no change
        default:
          return 0;
      }
    });
  }
  
  return Promise.resolve(filteredProducts);
};

// Add a new product
export const addProduct = async (
  token: string,
  userId: string,
  productData: ProductData
) => {
  const newProduct = {
    ...productData,
    id: `p${mockProducts.length + 1}`,
    description: productData.description || '',
    salesData: {
      totalSales: 0,
      lastMonthSales: 0,
      revenue: 0
    }
  };
  mockProducts.push(newProduct);
  return Promise.resolve(newProduct);
};

// Update a product
export const updateProduct = async (
  token: string,
  userId: string,
  productId: string,
  productData: Partial<ProductData>
) => {
  const index = mockProducts.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  const updatedProduct = {
    ...mockProducts[index],
    ...productData,
    description: productData.description || mockProducts[index].description
  };
  mockProducts[index] = updatedProduct;
  
  return Promise.resolve(mockProducts[index]);
};

// Delete a product
export const deleteProduct = async (
  token: string,
  userId: string,
  productId: string
) => {
  const index = mockProducts.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new Error('Product not found');
  }
  
  mockProducts.splice(index, 1);
  return Promise.resolve({ success: true });
};

// Get product categories
export const getCategories = async (token: string, userId?: string) => {
  return Promise.resolve(mockCategories);
};

// Add a new category
export const addCategory = async (
  token: string,
  userId: string,
  categoryData: CategoryData
) => {
  const newCategory = {
    ...categoryData,
    id: `cat${mockCategories.length + 1}`
  };
  mockCategories.push(newCategory);
  return Promise.resolve(newCategory);
};