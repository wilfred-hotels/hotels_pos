import React, { useEffect, useState } from 'react';
import ProductsAPI from '../../actions/products';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '' });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductsAPI.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const persistLocal = (next) => {
    setProducts(next);
    try { localStorage.setItem('pos_products', JSON.stringify(next)); } catch (e) { }
  };

  const createProduct = async (payload) => {
    setSaving(true);
    try {
      const hid = ProductsAPI.resolveHotelId();
      const apiCall = ProductsAPI.createProduct(payload, hid);
      const res = await toast.promise(apiCall, {
        loading: 'Creating product...',
        success: 'Product created',
        error: 'Failed to create product',
      });

      // refresh from server so we only display server-confirmed products
      await load();
      return res;
    } catch (err) {
      toast.error((err && err.message) ? err.message : 'Could not create product on server');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async (id, payload) => {
    setSaving(true);
    try {
      const hid = ProductsAPI.resolveHotelId();
      const apiCall = ProductsAPI.updateProduct(id, payload, hid);
      const res = await toast.promise(apiCall, {
        loading: 'Saving changes...',
        success: 'Product updated',
        error: 'Failed to update product',
      });

      // refresh from server to reflect canonical state
      await load();
      return res;
    } catch (err) {
      // keep local state unchanged on failure and notify
      toast.error((err && err.message) ? err.message : 'Could not update product on server');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    setDeletingId(id);
    try {
      const hid = ProductsAPI.resolveHotelId();
      const apiCall = ProductsAPI.deleteProduct(id, hid);
      await toast.promise(apiCall, {
        loading: 'Deleting...',
        success: 'Product deleted',
        error: 'Failed to delete product',
      });

      // refresh list from server after successful delete
      await load();
      return true;
    } catch (err) {
      toast.error((err && err.message) ? err.message : 'Could not delete product on server');
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  const openNew = () => { setEditingId(null); setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' }); setShowAddModal(true); };
  const openEdit = (p) => { setEditingId(p.id); setForm({ name: p.name || '', description: p.description || '', price: String(p.price || ''), stock: String(p.stock || ''), imageUrl: p.imageUrl || '' }); setShowEditModal(true); };

  const save = async () => {
    const payload = { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-slate-300 mt-1">Manage items available at this hotel — create, edit, and track stock.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md ring-1 ring-slate-800" disabled={saving}>+ Add Product</button>
        </div>
      </div>

      {loading && <div className="text-slate-300">Loading...</div>}
      {error && <div className="text-rose-400">Error: {error.message || String(error)}</div>}
      <div className="relative">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(products) && products.length === 0 && !loading && (
          <div className="col-span-full p-6 bg-slate-800/60 rounded-lg border border-slate-700">No products available.</div>
        )}
        {Array.isArray(products) && products.map(p => (
          <motion.div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-4 flex flex-col" whileHover={{ scale: 1.02 }}>
            <div className="h-40 rounded-md overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 mb-3 flex items-center justify-center border border-slate-700">
              {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-4xl font-bold text-sky-400">{p.name?.charAt(0).toUpperCase()}</div>}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg text-slate-100">{p.name}</div>
              {p.description ? (
                <div title={p.description} className="text-sm text-slate-300 mt-1 whitespace-pre-wrap max-h-12 overflow-hidden">{p.description}</div>
              ) : null}
              <div className="text-sm text-slate-300 mt-2">${Number(p.price ?? 0).toFixed(2)} • <span className="font-medium">Stock: {p.stock ?? 0}</span></div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-300">In stock: <span className="font-bold text-slate-100">{p.stock ?? 0}</span></div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="px-3 py-1 border border-sky-600 text-sky-300 rounded hover:bg-sky-700/10">Edit</button>
                <button onClick={() => { setDeleteTarget(p); setShowDeleteModal(true); }} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded" disabled={!!deletingId}>{deletingId === p.id ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </motion.div>
        ))}
        </div>

        {/* Modals rendered inside the products section so blur only affects this area */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div className="absolute inset-0 z-40 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.div className="relative z-50 bg-slate-900 rounded-xl p-6 shadow-2xl w-full max-w-md sm:max-w-md mx-4 sm:mx-0 border border-slate-700" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
                <h4 className="text-xl font-semibold mb-3 text-slate-100">Create Product</h4>
                <div className="space-y-3">
                  <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                  <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="px-4 py-2 rounded border border-slate-700 text-slate-200 hover:bg-slate-800" onClick={() => setShowAddModal(false)}>Cancel</button>
                    <button type="button" className="px-4 py-2 rounded bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow" onClick={async () => {
                      const res = await createProduct({ name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl });
                      if (res) {
                        setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
                        setShowAddModal(false);
                      }
                    }} disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditModal && (
            <motion.div className="absolute inset-0 z-40 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.div className="relative z-50 bg-slate-900 rounded-xl p-6 shadow-2xl w-full max-w-md sm:max-w-md mx-4 sm:mx-0 border border-slate-700" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
                <h4 className="text-xl font-semibold mb-3 text-slate-100">Edit Product</h4>
                <div className="space-y-3">
                  <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                  <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <button type="button" className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-md" onClick={() => setForm({ ...form, stock: String(Math.max(0, Number(form.stock || 0) - 1)) })}>-</button>
                    <input className="w-20 text-center bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                    <button type="button" className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-md" onClick={() => setForm({ ...form, stock: String(Number(form.stock || 0) + 1) })}>+</button>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="px-4 py-2 rounded border border-slate-700 text-slate-200 hover:bg-slate-800" onClick={() => { setShowEditModal(false); setEditingId(null); }}>Cancel</button>
                    <button type="button" className="px-4 py-2 rounded bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow" onClick={async () => { await updateProduct(editingId, { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl }); setShowEditModal(false); setEditingId(null); }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-slate-900 rounded-xl p-6 shadow-2xl w-full max-w-md border border-slate-700" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h4 className="text-xl font-semibold mb-3 text-slate-100">Create Product</h4>
              <div className="space-y-3">
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="px-4 py-2 rounded border border-slate-700 text-slate-200 hover:bg-slate-800" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="button" className="px-4 py-2 rounded bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow" onClick={async () => { await createProduct({ name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl }); setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' }); setShowAddModal(false); }} disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deleteTarget && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-slate-900 rounded-xl p-6 shadow-2xl w-full max-w-lg border border-slate-700" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h4 className="text-xl font-semibold mb-3 text-rose-300">Delete product — are you sure?</h4>
              <p className="text-slate-300 mb-4">Deleting a product is destructive and cannot be undone through this UI. Customers or sales referencing this product may be affected. Please confirm you want to permanently remove <span className="font-semibold text-slate-100">{deleteTarget.name}</span>.</p>
              <div className="flex justify-end gap-2">
                <button className="px-4 py-2 rounded border border-slate-700 text-slate-200 hover:bg-slate-800" onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}>Cancel</button>
                <button className="px-4 py-2 rounded bg-rose-600 text-white" onClick={async () => {
                  if (!deleteTarget) return;
                  const id = deleteTarget.id;
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                  await deleteProduct(id);
                }}>{deletingId ? 'Deleting...' : 'Delete product'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEditModal && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-slate-900 rounded-xl p-6 shadow-2xl w-full max-w-md border border-slate-700" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h4 className="text-xl font-semibold mb-3 text-slate-100">Edit Product</h4>
              <div className="space-y-3">
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-100" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="px-4 py-2 rounded border border-slate-700 text-slate-200 hover:bg-slate-800" onClick={() => { setShowEditModal(false); setEditingId(null); }}>Cancel</button>
                  <button type="button" className="px-4 py-2 rounded bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow" onClick={async () => {
                      const res = await updateProduct(editingId, { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl });
                      if (res) {
                        setShowEditModal(false);
                        setEditingId(null);
                      }
                    }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
