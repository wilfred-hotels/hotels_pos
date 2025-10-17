import React, { useEffect, useState } from 'react';
import './products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editQuantity, setEditQuantity] = useState(1);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('pos_products');
            if (raw) setProducts(JSON.parse(raw));
        } catch (e) {
            console.error('Failed to load products from localStorage', e);
        }
    }, []);

    const persist = (next) => {
        setProducts(next);
        try {
            localStorage.setItem('pos_products', JSON.stringify(next));
        } catch (e) {
            console.error('Failed to save products to localStorage', e);
        }
    };

    const addProduct = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const next = [
            ...products,
            { id: Date.now(), name: name.trim(), quantity: Number(quantity) || 0 }
        ];
        persist(next);
        setName('');
        setQuantity(1);
    };

    const removeProduct = (id) => {
        persist(products.filter(p => p.id !== id));
    };

    const startEdit = (p) => {
        setEditingId(p.id);
        setEditName(p.name);
        setEditQuantity(p.quantity);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditQuantity(1);
    };

    const saveEdit = (id) => {
        const next = products.map(p => p.id === id ? { ...p, name: editName.trim() || p.name, quantity: Number(editQuantity) || 0 } : p);
        persist(next);
        cancelEdit();
    };

    const increment = (id, delta) => {
        const next = products.map(p => p.id === id ? { ...p, quantity: Math.max(0, p.quantity + delta) } : p);
        persist(next);
    };

    return (
        <div className="products-container">
            <h2 className="products-title">Products</h2>

            <form className="product-form" onSubmit={addProduct}>
                <div className="form-row">
                    <input
                        className="input"
                        placeholder="Product name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="input input-small"
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />

                    <button className="btn btn-primary" type="submit">Add</button>
                </div>
            </form>

            <div className="product-list">
                {products.length === 0 && (
                    <div className="empty">No products yet. Add one above.</div>
                )}

                {products.map(p => (
                    <div key={p.id} className="product-card">
                        {editingId === p.id ? (
                            <div className="edit-row">
                                <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                <input className="input input-small" type="number" min="0" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} />
                                <button className="btn btn-primary" onClick={() => saveEdit(p.id)}>Save</button>
                                <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                            </div>
                        ) : (
                            <>
                                <div className="product-info">
                                    <div className="product-name">{p.name}</div>
                                    <div className="product-meta">
                                        <span className="product-qty">Qty: {p.quantity}</span>
                                        <div className="product-actions">
                                            <button className="icon-btn" title="Decrease" onClick={() => increment(p.id, -1)}>-</button>
                                            <button className="icon-btn" title="Increase" onClick={() => increment(p.id, 1)}>+</button>
                                            <button className="btn btn-outline" onClick={() => startEdit(p)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => removeProduct(p.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;