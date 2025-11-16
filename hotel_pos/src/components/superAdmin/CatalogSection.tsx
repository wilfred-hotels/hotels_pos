import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';
import CatalogHeader from './catalog/CatalogHeader';
import CatalogModals from './catalog/CatalogModals';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import CatalogFilters from './catalog/CatalogFilters';
import CatalogCard from './catalog/CatalogCard';
import { createCatalogProduct, getCatalogProducts, getCategories } from '../../actions/catalog';

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
  // additional fields for admin payload
  initialPriceDollars?: number;
  finalPriceDollars?: number;
  proposedPriceDollars?: number;
  initialCostDollars?: number;
  finalCostDollars?: number;
  nameCode?: string;
  images?: string[];
  categories?: string[];
  isFeatured?: boolean;
  brand?: string;
  isVisible?: boolean;
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
  customizationOptions?: {
    name: string;
    type: 'addon' | 'modification' | 'specification';
    additionalCost: number;
  }[];
}

// mock product/category data removed — using API-backed functions instead

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
    // admin payload helpers (dollar inputs)
    initialPriceDollars: undefined,
    finalPriceDollars: undefined,
    nameCode: undefined,
    images: undefined,
    categories: undefined,
    isFeatured: undefined,
    brand: undefined,
    isVisible: undefined,
  });

  // Load and filter mock data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        // fetch catalog products from API (falls back to mock inside action)
        const apiData: any[] = await getCatalogProducts((typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token') || '') : '') );

        // map API product shape to local ProductData shape
        const mapNum = (v: any) => (v == null ? 0 : (typeof v === 'string' ? Number(v) : v));
        let mapped = (apiData || []).map((p: any) => {
          const priceCents = mapNum(p.priceCents ?? p.proposedPriceCents ?? p.initialPriceCents ?? 0);
          return {
            id: String(p.id || p._id || ''),
            name: p.name || '',
            description: p.description || '',
            categoryId: (Array.isArray(p.categories) && p.categories[0]) || p.categoryId || '',
            price: Number(priceCents) / 100,
            initialPriceDollars: mapNum(p.initialPriceCents) / 100,
            proposedPriceDollars: mapNum(p.proposedPriceCents) / 100,
            initialCostDollars: mapNum(p.initialCostCents) / 100,
            finalCostDollars: mapNum(p.finalPriceCents) / 100,
            nameCode: p.nameCode,
            images: p.images || [],
            categories: p.categories || [],
            isFeatured: !!p.isFeatured,
            brand: p.brand,
            isVisible: p.isVisible ?? true,
            baseProduct: {
              id: p.nameCode || '',
              name: p.name || '',
              hotelName: p.hotelName || '',
              originalPrice: mapNum(p.initialCostCents) / 100,
              imageUrl: (p.images && p.images[0]) || '',
              supplierInfo: {
                name: p.brand || '',
                rating: p.rating ?? 0,
                reliabilityScore: 0,
              }
            },
            createdAt: p.createdAt || p.created_at,
            updatedAt: p.updatedAt || p.updated_at,
            customization: p.customization || { modifications: [], additionalCost: 0, preparationTime: '', specialRequirements: [] },
            pricingTiers: p.pricingTiers || [],
            stock: Number(p.stock ?? 0),
            imageUrl: (p.images && p.images[0]) || '',
            isAvailable: (p.stock ?? 0) > 0,
            salesData: p.salesData || { totalSales: 0, revenue: 0, rating: p.rating ?? 0, profitToDate: 0, popularHotels: [], averageOrderSize: 0 },
            qualityMetrics: p.qualityMetrics || { customerSatisfaction: p.rating ?? 0, returnRate: 0, recommendationScore: 0 }
          } as ProductData;
        });

        // client-side filter/search/sort --- keep previous UX
        if (selectedCategory) {
          mapped = mapped.filter(p => p.categoryId === selectedCategory || (p.categories || []).includes(selectedCategory));
        }
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          mapped = mapped.filter(p => p.name.toLowerCase().includes(searchLower) || p.description?.toLowerCase().includes(searchLower));
        }
        // sorting
        mapped.sort((a, b) => {
          if (sortBy === 'name') return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
          if (sortBy === 'price') return order === 'asc' ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0);
          if (sortBy === 'createdAt') {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return order === 'asc' ? ta - tb : tb - ta;
          }
          return order === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        });

        if (!mounted) return;
        setProducts(mapped);

        // load categories (action falls back to mocks)
        try {
          const cats = await getCategories((typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token') || '') : ''));
          if (mounted) setCategories(cats || []);
        } catch (e) {
          // ignore category load errors
        }
      } catch (error) {
        console.error('Failed to load catalog data:', error);
        toast.error('Failed to load catalog data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
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
        // Add mode - POST to admin products endpoint
        setLoading(true);
        // helper to convert dollar value -> cents
        const toCents = (d?: number) => Math.round((Number(d) || 0) * 100);

        // Build payload based on expected admin API schema; include sensible defaults
        const payload: any = {
          name: formData.name || 'Untitled Product',
          description: formData.description || '',
          // only send initial and final prices (in cents)
          initialPriceCents: toCents((formData as any).initialPriceDollars),
          finalPriceCents: toCents((formData as any).finalPriceDollars ?? (formData as any).initialPriceDollars),
          stock: formData.stock || 0,
          nameCode: (formData as any).nameCode || undefined,
          isVisible: (formData as any).isVisible ?? true,
          images: (formData as any).images || (formData.imageUrl ? [formData.imageUrl] : []),
          categories: (formData as any).categories || ((formData.categoryId && [formData.categoryId]) || []),
          isFeatured: (formData as any).isFeatured ?? false,
          brand: (formData as any).brand || undefined,
          rating: (formData as any).rating ?? undefined,
        };

        try {
          const res = await createCatalogProduct(payload);
          // Map API response to local ProductData shape for display
          const created = res && (res.data || res) ? (res.data ? (Array.isArray(res.data) ? res.data[0] : res.data) : res) : res;
          const mapped: ProductData = {
            id: String(created.id || created._id || (products.length ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1)),
            name: created.name || payload.name,
            description: created.description || payload.description || '',
            categoryId: (created.categories && created.categories[0]) || payload.categories[0] || (formData.categoryId || ''),
            // price represents the displayed 'listing price' (prefer finalPriceCents if present)
            price: Number((created.finalPriceCents ?? created.initialPriceCents) ? ((created.finalPriceCents ?? created.initialPriceCents) / 100) : payload.initialPriceCents / 100),
            // explicitly surface initial and final cost in dollars so the card displays correctly
            initialPriceDollars: Number((created.initialPriceCents ?? created.initialCostCents ?? payload.initialPriceCents ?? 0) / 100),
            finalCostDollars: Number((created.finalPriceCents ?? created.finalCostCents ?? payload.finalPriceCents ?? payload.finalPriceCents ?? 0) / 100),
            baseProduct: {
              id: (created.nameCode || '') as string,
              name: created.name || payload.name,
              hotelName: '',
              originalPrice: Number((created.initialCostCents ?? 0) / 100),
              imageUrl: created.images && created.images[0] ? created.images[0] : (formData.imageUrl || ''),
              supplierInfo: {
                name: created.brand || (created.supplier && created.supplier.name) || '',
                rating: created.rating ?? 0,
                reliabilityScore: 0,
              }
            },
            createdAt: created.createdAt || created.created_at || new Date().toISOString(),
            updatedAt: created.updatedAt || created.updated_at || new Date().toISOString(),
            customization: (created.customization) || { modifications: [], additionalCost: 0, preparationTime: '', specialRequirements: [] },
            pricingTiers: created.pricingTiers || [],
            stock: Number(created.stock ?? payload.stock ?? 0),
            imageUrl: (created.images && created.images[0]) || formData.imageUrl || '',
            isAvailable: (created.stock ?? payload.stock ?? 0) > 0,
            salesData: created.salesData || { totalSales: 0, revenue: 0, rating: created.rating ?? 0, profitToDate: 0, popularHotels: [], averageOrderSize: 0 },
            qualityMetrics: created.qualityMetrics || { customerSatisfaction: created.rating ?? 0, returnRate: 0, recommendationScore: 0 }
          };

          setProducts(prev => [mapped, ...prev]);
          toast.success('Product added successfully');
          setIsAddModalOpen(false);
        } catch (err: any) {
          console.error('createAdminProduct error', err);
          toast.error(err?.message || 'Failed to create product on server');
        } finally {
          setLoading(false);
        }
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
      // map optional admin fields if present
      initialPriceDollars: product.initialPriceDollars,
      proposedPriceDollars: product.proposedPriceDollars,
      initialCostDollars: product.initialCostDollars,
      finalCostDollars: product.finalCostDollars,
      nameCode: product.nameCode,
      images: product.images,
      categories: product.categories,
      isFeatured: product.isFeatured,
      brand: product.brand,
      isVisible: product.isVisible,
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
      initialPriceDollars: undefined,
      proposedPriceDollars: undefined,
      initialCostDollars: undefined,
      finalCostDollars: undefined,
      nameCode: undefined,
      images: undefined,
      categories: undefined,
      isFeatured: undefined,
      brand: undefined,
      
      isVisible: undefined,
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
      {/* normal admin header  */}
      <AdminHeader title="Products" subtitle="Manage products across hotels" />
      {/* Header (extracted) */}
      <CatalogHeader onAdd={() => { resetForm(); setIsAddModalOpen(true); }} />

      {/* Filters and search (extracted) */}
      <CatalogFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
      />

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
          {products.map((product) => (
            <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <CatalogCard
                product={product}
                openEditModal={openEditModal}
                openDeleteModal={openDeleteModal}
                fmtNumber={fmtNumber}
                fmtCurrency={fmtCurrency}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals (extracted) */}
      <CatalogModals
        isAddOpen={isAddModalOpen}
        isEditOpen={isEditModalOpen}
        isDeleteOpen={isDeleteModalOpen}
        setIsAddOpen={setIsAddModalOpen}
        setIsEditOpen={setIsEditModalOpen}
        setIsDeleteOpen={setIsDeleteModalOpen}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        categories={categories}
        selectedProduct={selectedProduct}
      />

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
