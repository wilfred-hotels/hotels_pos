import React from 'react';
import './AddNewSale.css';

const sales = () => {
    const orders = [
        { id: 1, customer: 'John Doe', items: ['Burger x1', 'Coke x2'], total: '$18.50' },
        { id: 2, customer: 'Jane Smith', items: ['Margherita Pizza'], total: '$12.00' }
    ];

    return (
        <div className="sales-container">
            <h2 className="page-title">Sales Overview</h2>

            <div className="sales-list">
                {orders.map(o => (
                    <div key={o.id} className="order-card">
                        <div className="order-header">
                            <div className="order-id">Order #{o.id}</div>
                            <div className="order-total">{o.total}</div>
                        </div>
                        <div className="order-customer">{o.customer}</div>
                        <ul className="order-items">
                            {o.items.map((it, i) => <li key={i}>{it}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default sales;




