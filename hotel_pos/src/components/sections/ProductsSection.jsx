import React, { useEffect, useState } from 'react';
import * as ProductsAPI from '../../actions/products';

export default function ProductsSection(){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductsAPI.getProducts();
      setProducts(data || []);
    } catch (err) {
      setError(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditingId(null); setForm({ name: '', description: '', price: '', stock: '' }); setShowForm(true); };
  const openEdit = (p) => { setEditingId(p.id); setForm({ name: p.name || '', description: p.description || '', price: String(p.price || ''), stock: String(p.stock || '') }); setShowForm(true); };

  const save = async () => {
    const payload = { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await ProductsAPI.updateProduct(editingId, payload);
      } else {
        await ProductsAPI.createProduct(payload);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await ProductsAPI.deleteProduct(id);
      await load();
    } catch (err) { setError(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="flex items-center gap-2">
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded">
            <span className="text-xl">+</span> Add Product
          </button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">Error: {error.message || String(error)}</div>}

      {/* protect against non-array responses */}
      {(!Array.isArray(products) || products.length === 0) && !loading && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded">No products available.</div>
      )}

      {showForm && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="input" />
            <input placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} className="input" />
            <input placeholder="Stock" type="number" value={form.stock} onChange={(e)=>setForm({...form, stock: e.target.value})} className="input" />
            <input placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="input md:col-span-2" />
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn btn-primary" onClick={save}>{editingId ? 'Update' : 'Create'}</button>
            <button className="btn" onClick={()=>setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(products) && products.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow hover:shadow-md transition">
            <div className="h-28 bg-gray-100 dark:bg-slate-700 rounded mb-3 flex items-center justify-center text-gray-500">Image</div>
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500">${p.price} • Stock: {p.stock}</div>
            <div className="mt-3 flex gap-2">
              <button className="btn btn-outline" onClick={()=>openEdit(p)}>Edit</button>
              <button className="btn btn-danger" onClick={()=>remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
