import React, { useState } from 'react';
import './AddNewSale.css';

interface SaleFormData {
  category: string;
  foodItem: string;
  price: string;
  customerName: string;
  roomNumber: string;
  paymentMethod: string;
}

const AddNewSale: React.FC = () => {
  const [formData, setFormData] = useState<SaleFormData>({
    category: 'Restaurant',
    foodItem: '',
    price: '12.50',
    customerName: '',
    roomNumber: '',
    paymentMethod: ''
  });

  const [isDark, setIsDark] = useState(false);

  const handleInputChange = (field: keyof SaleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sale Data:', formData);
    // Here you would typically send data to your API
    alert('Sale added successfully!');
  };

  const foodItems = [
    'Select Food Item',
    'Classic Burger',
    'Margherita Pizza',
    'Caesar Salad',
    'Club Sandwich',
    'Cheeseburger',
    'Grilled Salmon'
  ];

  const categories = ['Restaurant', 'Room Service', 'Bar', 'Events'];
  const paymentMethods = ['Cash', 'Card', 'M-Pesa', 'Stripe'];

  return (
    <div className={`add-sale-container ${isDark ? 'dark' : ''}`}>
      <div className="add-sale-layout">
        <div className="add-sale-content">
          {/* Header */}
          <header className="add-sale-header">
            <div className="header-inner">
              <button className="back-button" onClick={() => window.history.back()}>
                <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
              </button>
              <h1 className="page-title">Add New Sale</h1>
              <div className="w-6"></div>
            </div>
          </header>

          {/* Main Form */}
          <main className="add-sale-main">
            {/* Category Section */}
            <section className="section">
              <h2 className="section-title">Category</h2>
              <div className="category-selector">
                {categories.map(category => (
                  <label
                    key={category}
                    className={`category-label ${formData.category === category ? 'selected' : ''}`}
                  >
                    <span>{category}</span>
                    <input
                      className="category-input"
                      name="category"
                      type="radio"
                      value={category}
                      checked={formData.category === category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* Food Item Section */}
            <section className="section">
              <h2 className="section-title">Food Item</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="food-item">Food Item</label>
                  <div className="select-wrapper">
                    <select
                      className="form-select"
                      id="food-item"
                      value={formData.foodItem}
                      onChange={(e) => handleInputChange('foodItem', e.target.value)}
                    >
                      {foodItems.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="price">Price</label>
                  <div className="input-wrapper">
                    <span className="currency-symbol">$</span>
                    <input
                      className="form-input price-input"
                      id="price"
                      placeholder="Price"
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Details Section */}
            <section className="section">
              <h2 className="section-title">Customer Details</h2>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="customer-name">Customer Name</label>
                  <input
                    className="form-input"
                    id="customer-name"
                    placeholder="Customer Name"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="room-number">Room Number</label>
                  <input
                    className="form-input"
                    id="room-number"
                    placeholder="Room Number (if applicable)"
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Payment Method Section */}
            <section className="section">
              <h2 className="section-title">Payment Method</h2>
              <div className="payment-grid">
                {paymentMethods.map(method => (
                  <label
                    key={method}
                    className={`payment-label ${formData.paymentMethod === method ? 'selected' : ''}`}
                  >
                    <span>{method}</span>
                    <input
                      className="payment-input"
                      name="payment-method"
                      type="radio"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    />
                  </label>
                ))}
              </div>
            </section>
          </main>
        </div>

        {/* Footer with Submit Button */}
        <footer className="add-sale-footer">
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={!formData.foodItem || !formData.paymentMethod}
          >
            Add Sale
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddNewSale;