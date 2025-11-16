import React, { useEffect, useState } from 'react';
import AdminHeader from '../common/AdminHeader';
import { getProductPerformance } from '../../actions/analytics';
import type { ProductPerformance } from '../../types/analytics';

const ProfitCatalog: React.FC = () => {
  const [products, setProducts] = useState<ProductPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    minMargin: 0,
    maxMargin: 100,
    sortBy: 'revenue' as 'revenue' | 'profitMargin' | 'unitsSold'
  });

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token || !userId) return;

      try {
        setLoading(true);
        setError(null);

        const timeframe = {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        };

        const data = await getProductPerformance(token, userId, timeframe);
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch product performance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, userId]);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'sortBy' ? value : Number(value)
    }));
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const margin = product.profitMargin * 100;
      return margin >= filters.minMargin && margin <= filters.maxMargin;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'revenue':
          return b.revenue - a.revenue;
        case 'profitMargin':
          return b.profitMargin - a.profitMargin;
        case 'unitsSold':
          return (b.salesTrend[0].quantity) - (a.salesTrend[0].quantity);
        default:
          return 0;
      }
    });

  if (loading) return <div>Loading catalog...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profit-catalog">
      <AdminHeader title="Profit Catalog" subtitle="Analyze product profitability" />
      <div className="filters">
        <div className="filter-group">
          <label>
            Min Profit Margin (%)
            <input
              type="number"
              name="minMargin"
              value={filters.minMargin}
              onChange={handleFilterChange}
              min="0"
              max="100"
            />
          </label>
          <label>
            Max Profit Margin (%)
            <input
              type="number"
              name="maxMargin"
              value={filters.maxMargin}
              onChange={handleFilterChange}
              min="0"
              max="100"
            />
          </label>
        </div>
        <div className="filter-group">
          <label>
            Sort By
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="revenue">Revenue</option>
              <option value="profitMargin">Profit Margin</option>
              <option value="unitsSold">Units Sold</option>
            </select>
          </label>
        </div>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Cost</th>
            <th>Profit Margin</th>
            <th>Revenue</th>
            <th>Units Sold</th>
            <th>Total Profit</th>
            <th>Inventory</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedProducts.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${(product.totalSales / product.salesTrend[0].quantity).toFixed(2)}</td>
              <td>${(product.cost / product.salesTrend[0].quantity).toFixed(2)}</td>
              <td>{(product.profitMargin * 100).toFixed(1)}%</td>
              <td>${product.revenue.toFixed(2)}</td>
              <td>{product.salesTrend[0].quantity}</td>
              <td>${product.profit.toFixed(2)}</td>
              <td>
                <span className={product.stockLevels[0].inStock < product.stockLevels[0].reorderPoint ? 'low-stock' : ''}>
                  {product.stockLevels[0].inStock}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredAndSortedProducts.length === 0 && (
        <div className="no-results">
          No products found matching the current filters
        </div>
      )}
    </div>
  );
};

export default ProfitCatalog;