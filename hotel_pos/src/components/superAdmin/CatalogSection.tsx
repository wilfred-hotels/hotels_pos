import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

// Mock types
interface PricingTier {
  hotelId: string;
  basePrice: number;
  markupPercentage: number;
  finalPrice: number;
  profitMargin: number;
  isAvailable: boolean;
  minimumOrder: number;
}

interface ProductData {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  baseProduct: {
    id: string;
    name: string;
    hotelName: string;
    originalPrice: number;
    imageUrl?: string;
    supplierInfo: {
      name: string;
      rating: number;
      reliabilityScore: number;
    };
  };
  createdAt?: string;
  updatedAt?: string;
  customization: {
    modifications: string[];
    additionalCost: number;
    preparationTime: string;
    specialRequirements?: string[];
  };
  pricingTiers: PricingTier[];
  stock: number;
  imageUrl?: string;
  isAvailable: boolean;
  salesData: {
    totalSales: number;
    revenue: number;
    rating: number;
    profitToDate: number;
    popularHotels: string[];
    averageOrderSize: number;
  };
  qualityMetrics: {
    customerSatisfaction: number;
    returnRate: number;
    recommendationScore: number;
  };
}

interface CategoryData {
  id: string;
  name: string;
  customizationOptions: {
    name: string;
    type: 'addon' | 'modification' | 'specification';
    additionalCost: number;
  }[];
}

// Mock data
const mockProducts: ProductData[] = [
  {
    id: '1',
    name: 'Premium Bedding Package',
    description: 'Luxury bedding with customizable options',
    categoryId: '1',
    price: 148.5,
    baseProduct: {
      id: 'BP001',
      name: 'Standard Bedding Set',
      hotelName: 'Grand Plaza Hotel',
      originalPrice: 85.00,
      imageUrl: 'https://example.com/bedding.jpg',
      supplierInfo: {
        name: 'LuxuryLinens Co.',
        rating: 4.8,
        reliabilityScore: 0.95
      }
    },
    customization: {
      modifications: ['Thread count upgrade', 'Hypoallergenic option', 'Monogramming'],
      additionalCost: 25.00,
      preparationTime: '2-3 business days',
      specialRequirements: ['Temperature controlled storage']
    },
    pricingTiers: [
      {
        hotelId: 'H001',
        basePrice: 110.00,
        markupPercentage: 35,
        finalPrice: 148.50,
        profitMargin: 38.50,
        isAvailable: true,
        minimumOrder: 5
      },
      {
        hotelId: 'H002',
        basePrice: 110.00,
        markupPercentage: 40,
        finalPrice: 154.00,
        profitMargin: 44.00,
        isAvailable: true,
        minimumOrder: 3
      }
    ],
    stock: 50,
    imageUrl: 'https://example.com/premium-bedding.jpg',
    isAvailable: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-06-01T12:00:00Z',
    salesData: {
      totalSales: 250,
      revenue: 37125.00,
      rating: 4.7,
      profitToDate: 9625.00,
      popularHotels: ['Grand Plaza Hotel', 'Riverside Inn', 'Mountain View Resort'],
      averageOrderSize: 8
    },
    qualityMetrics: {
      customerSatisfaction: 4.8,
      returnRate: 0.02,
      recommendationScore: 9.2
    }
  },
  {
    id: '2',
    name: 'Luxury Toiletries Set',
    description: 'Customizable premium bathroom amenities',
    categoryId: '2',
    price: 87.0,
    baseProduct: {
      id: 'BP002',
      name: 'Basic Toiletries Kit',
      hotelName: 'Riverside Inn',
      originalPrice: 45.00,
      imageUrl: 'https://example.com/toiletries.jpg',
      supplierInfo: {
        name: 'EcoLux Amenities',
        rating: 4.6,
        reliabilityScore: 0.92
      }
    },
    customization: {
      modifications: ['Organic options', 'Fragrance selection', 'Eco-friendly packaging'],
      additionalCost: 15.00,
      preparationTime: '1-2 business days',
      specialRequirements: ['Fragrance-free storage']
    },
    pricingTiers: [
      {
        hotelId: 'H001',
        basePrice: 60.00,
        markupPercentage: 45,
        finalPrice: 87.00,
        profitMargin: 27.00,
        isAvailable: true,
        minimumOrder: 10
      },
      {
        hotelId: 'H002',
        basePrice: 60.00,
        markupPercentage: 50,
        finalPrice: 90.00,
        profitMargin: 30.00,
        isAvailable: false,
        minimumOrder: 8
      }
    ],
    stock: 120,
    imageUrl: 'https://example.com/luxury-toiletries.jpg',
    isAvailable: true,
    createdAt: '2025-02-20T09:30:00Z',
    updatedAt: '2025-07-02T11:45:00Z',
    salesData: {
      totalSales: 480,
      revenue: 41760.00,
      rating: 4.5,
      profitToDate: 12960.00,
      popularHotels: ['Riverside Inn', 'Grand Plaza Hotel'],
      averageOrderSize: 15
    },
    qualityMetrics: {
      customerSatisfaction: 4.5,
      returnRate: 0.03,
      recommendationScore: 8.8
    }
  }
];

const mockCategories: CategoryData[] = [
  {
    id: '1',
    name: 'Bedding & Linens',
    customizationOptions: [
      {
        name: 'Thread Count Upgrade',
        type: 'specification',
        additionalCost: 15.00
      },
      {
        name: 'Monogramming',
        type: 'addon',
        additionalCost: 10.00
      },
      {
        name: 'Hypoallergenic',
        type: 'modification',
        additionalCost: 20.00
      }
    ]
  },
  {
    id: '2',
    name: 'Bathroom Amenities',
    customizationOptions: [
      {
        name: 'Organic Materials',
        type: 'modification',
        additionalCost: 12.00
      },
      {
        name: 'Custom Fragrance',
        type: 'specification',
        additionalCost: 8.00
      },
      {
        name: 'Eco-Packaging',
        type: 'addon',
        additionalCost: 5.00
      }
    ]
  }
];

const CatalogSection: React.FC<SectionProps> = ({ userId }) => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [formData, setFormData] = useState<Partial<ProductData>>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stock: 0,
    imageUrl: '',
    isAvailable: true,
  });

  // Load and filter mock data
  useEffect(() => {
    setLoading(true);
    
    try {
      // Filter products based on category and search term
      let filteredProducts = [...mockProducts];
      
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === selectedCategory);
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort products
      filteredProducts.sort((a, b) => {
        if (sortBy === 'name') {
          return order === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        if (sortBy === 'price') {
          return order === 'asc'
            ? (a.price || 0) - (b.price || 0)
            : (b.price || 0) - (a.price || 0);
        }
        if (sortBy === 'createdAt') {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return order === 'asc' ? ta - tb : tb - ta;
        }
        // Fallback to ID sort
        return order === 'asc'
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      });

      setProducts(filteredProducts);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to load catalog data:', error);
      toast.error('Failed to load catalog data');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, order]);

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedProduct) {
        // Edit mode - update existing product in mock data
        const updatedProducts = products.map(p => 
          p.id === selectedProduct.id 
            ? { 
                ...p, 
                ...formData,
                updatedAt: new Date().toISOString(),
                salesData: p.salesData // preserve existing sales data
              }
            : p
        );
        setProducts(updatedProducts);
        toast.success('Product updated successfully');
        setIsEditModalOpen(false);
      } else {
        // Add mode - create new product with mock data
        const maxId = products.length ? Math.max(...products.map(p => parseInt(p.id))) : 0;
        const newProduct: ProductData = {
          id: (maxId + 1).toString(),
          ...(formData as Omit<ProductData, 'id' | 'salesData' | 'createdAt' | 'updatedAt'>),
          price: (formData.price as number) || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          salesData: {
            totalSales: 0,
            revenue: 0,
            rating: 0,
            profitToDate: 0,
            popularHotels: [],
            averageOrderSize: 0
          }
        };
        setProducts([...products, newProduct]);
        toast.success('Product added successfully');
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (!selectedProduct?.id) return;

    try {
      const updatedProducts = products.filter(p => p.id !== selectedProduct.id);
      setProducts(updatedProducts);
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Open edit modal with product data
  const openEditModal = (product: ProductData) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      categoryId: product.categoryId || '',
      stock: product.stock || 0,
      imageUrl: product.imageUrl || '',
      isAvailable: product.isAvailable ?? true,
    });
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (product: ProductData) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Reset form data
  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stock: 0,
      imageUrl: '',
      isAvailable: true,
    });
  };

  // small format helpers
  const fmtNumber = (n: number) => {
    if (n == null) return '0';
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const fmtCurrency = (v: number) => `$${(v || 0).toFixed(2)}`;

  return (
    <div className="grid gap-6 px-6 py-8 bg-gradient-to-br from-slate-50 to-violet-50 dark:from-gray-900 dark:to-violet-900/20 min-h-screen">
      <AdminHeader title="Catalog" subtitle="Manage product catalog" />
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 dark:from-violet-500/20 dark:via-fuchsia-500/20 dark:to-pink-500/20 p-8 rounded-2xl shadow-lg border border-violet-200/50 dark:border-violet-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 dark:from-violet-500/5 dark:via-fuchsia-500/5 dark:to-pink-500/5 opacity-60 blur-3xl pointer-events-none"></div>
        <div className="relative">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 dark:from-violet-400 dark:via-fuchsia-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
            Product Catalog
          </h2>
          <p className="text-violet-600/80 dark:text-violet-300/80 font-medium">
            Manage your products across all hotels
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative">
          <button 
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="group px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white rounded-xl hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-violet-500/25 font-medium flex items-center gap-2"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-300">+</span>
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="grid gap-4 md:flex md:flex-wrap md:items-center md:gap-6 bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-violet-100 dark:border-violet-700/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-pink-500/5 dark:from-violet-500/10 dark:via-fuchsia-500/10 dark:to-pink-500/10 opacity-60"></div>
        <div className="flex-1 min-w-[300px] relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-violet-200 dark:border-violet-700/50 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 placeholder-violet-400 dark:placeholder-violet-500 backdrop-blur-sm"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
        </div>

        <div className="flex flex-wrap gap-4 relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-violet-200 dark:border-violet-700/50 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 min-w-[150px] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22rgb(139,92,246)%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22/></svg>')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-12"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'createdAt')}
            className="px-4 py-3 rounded-xl border border-violet-200 dark:border-violet-700/50 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 min-w-[150px] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22rgb(139,92,246)%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22/></svg>')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-12"
          >
            <option value="createdAt">Date Added</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>

          <button
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {order === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            No products found. {searchTerm || selectedCategory ? 'Try adjusting your filters.' : ''}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const created = product.createdAt ? new Date(product.createdAt) : null;
            const monthsActive = created ? Math.max((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 30), 1) : 1;
            const monthlyAvgSales = product.salesData.totalSales / monthsActive;
            const costPerUnit = (product.baseProduct?.originalPrice || 0) + (product.customization?.additionalCost || 0);
            const unitProfit = (product.price || 0) - costPerUnit;
            const profitMarginPercent = product.price ? (unitProfit / product.price) * 100 : 0;
            const projectedMonthlyProfit = monthlyAvgSales * unitProfit;

            return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden border border-violet-100 dark:border-violet-700/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/20 dark:to-fuchsia-900/20 relative overflow-hidden">
                <img
                  src={product.imageUrl || '/default.jpg'}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {product.isAvailable ? (
                  <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg">
                    In Stock
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg">
                    Out of Stock
                  </span>
                )}
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-2 bg-white/90 dark:bg-gray-800/90 text-violet-600 dark:text-violet-400 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/50 transition-colors duration-200 backdrop-blur-sm"
                    title="Edit Product"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openDeleteModal(product)}
                    className="p-2 bg-white/90 dark:bg-gray-800/90 text-red-500 dark:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-200 backdrop-blur-sm"
                    title="Delete Product"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent mb-1">{product.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>Added: {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}</span>
                  <span>•</span>
                  <span>Updated: {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '—'}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">{product.description}</p>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Level</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            product.stock > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-full' :
                            product.stock > 20 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 w-2/3' :
                            product.stock > 0 ? 'bg-gradient-to-r from-orange-500 to-red-600 w-1/3' :
                            'bg-gray-300 dark:bg-gray-600 w-0'
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Benefit & actions */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-white/70 to-violet-50/70 dark:from-gray-800/40 dark:to-violet-900/20 border border-violet-100 dark:border-violet-700/40 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 w-full">
                      <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <div className="text-xs text-gray-500">Unit Profit</div>
                        <div className="font-semibold text-emerald-600">{fmtCurrency(unitProfit)}</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <div className="text-xs text-gray-500">Profit Margin</div>
                        <div className="font-semibold">{profitMarginPercent.toFixed(1)}%</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <div className="text-xs text-gray-500">Profit to Date</div>
                        <div className="font-semibold text-emerald-600">{fmtCurrency(product.salesData.profitToDate || 0)}</div>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <div className="text-xs text-gray-500">Projected Monthly Profit</div>
                        <div className="font-semibold">{fmtCurrency(projectedMonthlyProfit)}</div>
                      </div>
                    </div>

                    {/* buttons moved to bottom for clearer layout */}
                  </div>
                  <div className="text-xs text-gray-500 mt-3">Active: {monthsActive.toFixed(1)} mo • Avg orders/mo: {monthlyAvgSales.toFixed(1)}</div>
                </div>

                {/* Bottom stats + actions */}
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm font-medium w-full">
                      <div className="space-y-1">
                        <span className="text-gray-400 dark:text-gray-500 block">Sales</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{fmtNumber(product.salesData.totalSales)}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 dark:text-gray-500 block">Revenue</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{fmtCurrency(product.salesData.revenue || 0)}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 dark:text-gray-500 block">Rating</span>
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{(product.qualityMetrics.customerSatisfaction || 0).toFixed(1)}/5</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(product)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg shadow-md hover:scale-[1.02] transition-transform text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11"/></svg>
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteModal(product)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-red-600 border border-red-500 rounded-lg shadow-sm hover:bg-red-50 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onClose={() => (isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false))}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-xl w-full bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-2xl border border-purple-100 dark:border-purple-900">
            <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              {isAddModalOpen ? 'Add New Product' : 'Edit Product'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-violet-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-violet-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-5 h-5 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Available for Purchase
                </label>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => (isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false))}
                  className="px-6 py-2.5 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                >
                  {isAddModalOpen ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-2xl border border-red-100 dark:border-red-900">
            <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Delete Product
            </Dialog.Title>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete "<span className="font-semibold text-red-600 dark:text-red-400">{selectedProduct?.name}</span>"? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default CatalogSection;