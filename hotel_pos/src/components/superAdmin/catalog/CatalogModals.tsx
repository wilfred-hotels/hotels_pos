import React from 'react';
import { Dialog } from '@headlessui/react';

interface CategoryData {
  id: string;
  name: string;
}

interface ProductData {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isAvailable: boolean;
  salesData: any;
  // admin helper fields
  initialPriceDollars?: number;
  finalPriceDollars?: number;
  nameCode?: string;
  images?: string[];
  categories?: string[];
  isFeatured?: boolean;
  brand?: string;
  isVisible?: boolean;
}

interface Props {
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  setIsAddOpen: (v: boolean) => void;
  setIsEditOpen: (v: boolean) => void;
  setIsDeleteOpen: (v: boolean) => void;
  formData: Partial<ProductData>;
  setFormData: (fd: Partial<ProductData>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void> | void;
  handleDelete: () => void;
  categories: CategoryData[];
  selectedProduct: ProductData | null;
  isSubmitting?: boolean;
}

const CatalogModals: React.FC<Props> = ({
  isAddOpen,
  isEditOpen,
  isDeleteOpen,
  setIsAddOpen,
  setIsEditOpen,
  setIsDeleteOpen,
  formData,
  setFormData,
  handleSubmit,
  handleDelete,
  categories,
  selectedProduct,
  isSubmitting,
}) => {
  return (
    <>
      {/* Add / Edit Modal */}
      <Dialog
        open={isAddOpen || isEditOpen}
        onClose={() => (isAddOpen ? setIsAddOpen(false) : setIsEditOpen(false))}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-xl w-full bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-2xl border border-purple-100 dark:border-purple-900">
            <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              {isAddOpen ? 'Add New Product' : 'Edit Product'}
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">SKU / Code</label>
                  <input
                    type="text"
                    value={(formData as any).nameCode || ''}
                    onChange={(e) => setFormData({ ...formData, nameCode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Brand</label>
                  <input
                    type="text"
                    value={(formData as any).brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-purple-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Initial Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={String((formData as any).initialPriceDollars ?? '')}
                    onChange={(e) => setFormData({ ...formData, initialPriceDollars: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Final Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={String((formData as any).finalPriceDollars ?? '')}
                    onChange={(e) => setFormData({ ...formData, finalPriceDollars: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Stock</label>
                  <input
                    type="number"
                    value={String(formData.stock ?? '')}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Removed other price inputs; using Initial and Final Price only above */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Category</label>
                  <select
                    value={((formData as any).categories && (formData as any).categories[0]) || ''}
                    onChange={(e) => setFormData({ ...formData, categories: e.target.value ? [e.target.value] : [] })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-violet-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Category</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Alcoholic Drinks / Bar">Alcoholic Drinks / Bar</option>
                    <option value="Juices / Smoothies">Juices / Smoothies</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Organic / Healthy Options">Organic / Healthy Options</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Categories (comma-separated names)</label>
                  <input
                    type="text"                   
                    placeholder="e.g. 1,2,3 or bedding,amenities"
                    value={((formData as any).categories || []).join(',')}
                    onChange={(e) => setFormData({ ...formData, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-violet-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-violet-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Images (comma-separated URLs)</label>
                <input
                  type="text"
                  value={((formData as any).images || []).join(',')}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-violet-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={!!formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-5 h-5 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Available for Purchase
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isVisible"
                    checked={!!(formData as any).isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-5 h-5 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isVisible" className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Visible in Catalog
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={!!(formData as any).isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium text-purple-700 dark:text-purple-300">Featured</label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => (isAddOpen ? setIsAddOpen(false) : setIsEditOpen(false))}
                  className="px-6 py-2.5 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!isSubmitting}
                  className={
                    `px-6 py-2.5 rounded-lg text-white transition-all duration-200 transform shadow-lg font-medium ` +
                    (isSubmitting
                      ? 'bg-purple-400 cursor-wait'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:scale-105')
                  }
                >
                  {isSubmitting ? (isAddOpen ? 'Adding...' : 'Saving...') : (isAddOpen ? 'Add Product' : 'Save Changes')}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-2xl border border-red-100 dark:border-red-900">
            <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">Delete Product</Dialog.Title>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to delete "<span className="font-semibold text-red-600 dark:text-red-400">{selectedProduct?.name}</span>"? This action cannot be undone.</p>

            <div className="flex justify-end gap-4">
              <button onClick={() => setIsDeleteOpen(false)} className="px-6 py-2.5 border-2 border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium">Cancel</button>
              <button onClick={handleDelete} className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium">Delete</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default CatalogModals;
