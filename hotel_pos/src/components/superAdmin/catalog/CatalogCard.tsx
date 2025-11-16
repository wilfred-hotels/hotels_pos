import React from 'react';

// Minimal Product shape used by the card (kept in sync with CatalogSection)
interface ProductData {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  // possible backend fields (converted to dollars)
  initialPriceDollars?: number;
  finalCostDollars?: number;
  rating?: number;
  brand?: string;
  categories?: string[];
  baseProduct: {
    id: string;
    name: string;
    hotelName: string;
    originalPrice: number;
    imageUrl?: string;
    supplierInfo: { name: string; rating: number; reliabilityScore: number };
  };
  createdAt?: string;
  updatedAt?: string;
  customization: { modifications: string[]; additionalCost: number; preparationTime: string; specialRequirements?: string[] };
  pricingTiers: any[];
  stock: number;
  imageUrl?: string;
  isAvailable: boolean;
  salesData: { totalSales: number; revenue: number; rating: number; profitToDate: number; popularHotels: string[]; averageOrderSize: number };
  qualityMetrics: { customerSatisfaction: number; returnRate: number; recommendationScore: number };
}

interface Props {
  product: ProductData;
  openEditModal: (p: ProductData) => void;
  openDeleteModal: (p: ProductData) => void;
  fmtNumber: (n: number) => string;
  fmtCurrency: (v: number) => string;
}

const CatalogCard: React.FC<Props> = ({ product, openEditModal, openDeleteModal, fmtNumber, fmtCurrency }) => {
  const created = product.createdAt ? new Date(product.createdAt) : null;
  const monthsActive = created ? Math.max((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 30), 1) : 1;
  const monthlyAvgSales = product.salesData.totalSales / monthsActive;
  const costPerUnit = (product.baseProduct?.originalPrice || 0) + (product.customization?.additionalCost || 0);
  // Determine initial price and final cost (prefer explicit fields if present)
  const initialPrice = (product.initialPriceDollars ?? (product.price || 0));
  const finalCost = (product.finalCostDollars ?? costPerUnit);
  const unitProfit = finalCost - initialPrice;
  const profitMarginPercent = product.price ? (unitProfit / product.price) * 100 : 0;
  const projectedMonthlyProfit = monthlyAvgSales * unitProfit;

  return (
    <div className="group bg-white dark:bg-gray-800/60 rounded-2xl shadow-lg overflow-hidden border border-violet-100 dark:border-violet-700/50 hover:shadow-xl hover:shadow-violet-400/20 transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm">
    <div className="aspect-square sm:aspect-[4/3] bg-gradient-to-br from-violet-200 to-pink-200 dark:from-violet-900/10 dark:to-pink-900/10 relative overflow-hidden">
        <img
          src={product.imageUrl || '/default.jpg'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { const t = e.target as HTMLImageElement; t.src = '/default.jpg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {product.isAvailable ? (
          <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-lg">In Stock</span>
        ) : (
          <span className="absolute top-3 right-3 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full shadow-lg">Out of Stock</span>
        )}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => openEditModal(product)} className="p-2 bg-white/90 dark:bg-gray-800/90 text-violet-600 dark:text-violet-400 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/50 transition-colors duration-200 backdrop-blur-sm" title="Edit Product">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={() => openDeleteModal(product)} className="p-2 bg-white/90 dark:bg-gray-800/90 text-red-500 dark:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-200 backdrop-blur-sm" title="Delete Product">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg>
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
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">{fmtCurrency(product.price)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Level</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${product.stock > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-full' : product.stock > 20 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 w-2/3' : product.stock > 0 ? 'bg-gradient-to-r from-orange-500 to-red-600 w-1/3' : 'bg-gray-300 dark:bg-gray-600 w-0'}`}></div>
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{product.stock}</span>
            </div>
          </div>
        </div>

              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-white/70 to-pink-50/80 dark:from-gray-800/40 dark:to-violet-900/20 border border-violet-100 dark:border-violet-700/40 shadow-sm">
          <div className="flex justify-between items-start gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300 w-full">
              <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                <div className="text-xs text-gray-500">Initial Price</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{fmtCurrency(initialPrice)}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                <div className="text-xs text-gray-500">Final Cost</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{fmtCurrency(finalCost)}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                <div className="text-xs text-gray-500">Profit (Final − Initial)</div>
                <div className={`font-semibold ${unitProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmtCurrency(unitProfit)}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/60 dark:bg-gray-800/60">
                <div className="text-xs text-gray-500">Projected Monthly Profit</div>
                <div className="font-semibold">{fmtCurrency(projectedMonthlyProfit)}</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-3">Active: {monthsActive.toFixed(1)} mo • Avg orders/mo: {monthlyAvgSales.toFixed(1)}</div>
        </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm font-medium w-full">
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
              <button onClick={() => openEditModal(product)} className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg shadow-md hover:scale-[1.02] transition-transform text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 11l6 6L21 11" /></svg>
                Edit
              </button>

              <button onClick={() => openDeleteModal(product)} className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-red-600 border border-red-500 rounded-lg shadow-sm hover:bg-red-50 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" /></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;
