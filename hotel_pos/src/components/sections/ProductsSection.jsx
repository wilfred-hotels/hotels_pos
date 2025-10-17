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
        // <div className="p-4 bg-white dark:bg-slate-800 rounded shadow">
        //   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        //     <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="input" />
        //     <input placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} className="input" />
        //     <input placeholder="Stock" type="number" value={form.stock} onChange={(e)=>setForm({...form, stock: e.target.value})} className="input" />
        //     <input placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="input md:col-span-2" />
        //   </div>
        //   <div className="mt-3 flex gap-2">
        //     <button className="btn btn-primary" onClick={save}>{editingId ? 'Update' : 'Create'}</button>
        //     <button className="btn" onClick={()=>setShowForm(false)}>Cancel</button>
        //   </div>
        // </div>
  //         <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 relative overflow-hidden">
  //   {/* Sparkle overlay */}
  //   <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>
    
  //   {/* Subtle sparkle particles */}
  //   <div className="absolute top-2 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 blur-[1px] animate-pulse"></div>
  //   <div className="absolute bottom-4 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-40 blur-[1px] animate-pulse delay-1000"></div>
    
  //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
  //     <div className="relative">
  //       <input 
  //         placeholder=""
  //         value={form.name}
  //         onChange={(e) => setForm({...form, name: e.target.value})}
  //         className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder-transparent"
  //       />
  //       <label className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-purple-400 peer-placeholder-shown:opacity-0 peer-focus:opacity-100">
  //         Product Name
  //       </label>
  //     </div>

  //     <div className="relative">
  //       <input 
  //         placeholder=" "
  //         type="number"
  //         value={form.price}
  //         onChange={(e) => setForm({...form, price: e.target.value})}
  //         className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder-transparent"
  //       />
  //       <label className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-purple-400 peer-placeholder-shown:opacity-0 peer-focus:opacity-100">
  //         Price ($)
  //       </label>
  //     </div>

  //     <div className="relative">
  //       <input 
  //         placeholder=" "
  //         type="number"
  //         value={form.stock}
  //         onChange={(e) => setForm({...form, stock: e.target.value})}
  //         className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder-transparent"
  //       />
  //       <label className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-purple-400 peer-placeholder-shown:opacity-0 peer-focus:opacity-100">
  //         Stock Quantity
  //       </label>
  //     </div>

  //     <div className="relative md:col-span-2">
  //       <input 
  //         placeholder=" "
  //         value={form.description}
  //         onChange={(e) => setForm({...form, description: e.target.value})}
  //         className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder-transparent"
  //       />
  //       <label className="absolute left-4 top-3 text-slate-500 dark:text-slate-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-purple-400 peer-placeholder-shown:opacity-0 peer-focus:opacity-100">
  //         Product Description
  //       </label>
  //     </div>
  //   </div>

  //   <div className="mt-6 flex gap-3 relative z-10">
  //     <button 
  //       className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
  //       onClick={save}
  //     >
  //       {editingId ? 'Update Product' : 'Create Product'}
  //     </button>
  //     <button 
  //       className="px-6 py-3 bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-300/70 dark:hover:bg-slate-600/70 text-slate-700 dark:text-slate-300 rounded-xl font-medium backdrop-blur-sm border border-slate-300/50 dark:border-slate-600/50 transition-all duration-300 hover:shadow-lg"
  //       onClick={() => setShowForm(false)}
  //     >
  //       Cancel
  //     </button>
  //   </div>
  // </div>
  <div className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 relative overflow-hidden">
  {/* Sparkle overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none"></div>
  
  {/* Subtle sparkle particles */}
  <div className="absolute top-2 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 blur-[1px] animate-pulse"></div>
  <div className="absolute bottom-4 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-40 blur-[1px] animate-pulse delay-1000"></div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
    <div className="relative">
      <input 
        placeholder="Enter product name"
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
        className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
      <label className="absolute left-4 -top-2 px-1 bg-white/80 dark:bg-slate-900/80 text-xs text-blue-600 dark:text-purple-400 transition-all duration-300 pointer-events-none opacity-0 peer-focus:opacity-100 peer-focus:top-0">
        Product Name
      </label>
    </div>

    <div className="relative">
      <input 
        placeholder="0.00"
        type="number"
        value={form.price}
        onChange={(e) => setForm({...form, price: e.target.value})}
        className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
      <label className="absolute left-4 -top-2 px-1 bg-white/80 dark:bg-slate-900/80 text-xs text-blue-600 dark:text-purple-400 transition-all duration-300 pointer-events-none opacity-0 peer-focus:opacity-100 peer-focus:top-0">
        Price ($)
      </label>
    </div>

    <div className="relative">
      <input 
        placeholder="0"
        type="number"
        value={form.stock}
        onChange={(e) => setForm({...form, stock: e.target.value})}
        className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
      <label className="absolute left-4 -top-2 px-1 bg-white/80 dark:bg-slate-900/80 text-xs text-blue-600 dark:text-purple-400 transition-all duration-300 pointer-events-none opacity-0 peer-focus:opacity-100 peer-focus:top-0">
        Stock Quantity
      </label>
    </div>

    <div className="relative md:col-span-2">
      <input 
        placeholder="Describe the product features and details"
        value={form.description}
        onChange={(e) => setForm({...form, description: e.target.value})}
        className="peer w-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-purple-500/50 dark:focus:border-purple-500 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
      />
      <label className="absolute left-4 -top-2 px-1 bg-white/80 dark:bg-slate-900/80 text-xs text-blue-600 dark:text-purple-400 transition-all duration-300 pointer-events-none opacity-0 peer-focus:opacity-100 peer-focus:top-0">
        Product Description
      </label>
    </div>
  </div>

  <div className="mt-6 flex gap-3 relative z-10">
    <button 
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-blue-500/25 hover:shadow-blue-500/40"
      onClick={save}
    >
      {editingId ? 'Update Product' : 'Create Product'}
    </button>
    <button 
      className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-rose-500/25 hover:shadow-rose-500/40 glow-red"
      onClick={() => setShowForm(false)}
    >
      Cancel
    </button>
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
