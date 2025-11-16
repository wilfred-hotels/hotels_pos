import React, { useEffect, useState } from 'react';
import AdminHeader from '../common/AdminHeader';
import {
  getDashboardAnalytics,
  getHotelPerformance,
  getProductPerformance
} from '../../actions/analytics';
import type {
  HotelSummary,
  ProductPerformance,
  ReportTimeframe
} from '../../types/analytics';

const AnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<ReportTimeframe>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString()
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [hotelPerformance, setHotelPerformance] = useState<HotelSummary[]>([]);
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([]);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token || !userId) return;
      
      try {
        setLoading(true);
        setError(null);

        const [hotelData, productData] = await Promise.all([
          getHotelPerformance(token, userId, timeframe),
          getProductPerformance(token, userId, timeframe)
        ]);

        setHotelPerformance(hotelData);
        setTopProducts(productData.slice(0, 10)); // Top 10 products
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, userId, timeframe]);

  const handleTimeframeChange = (days: number) => {
    setTimeframe({
      start: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    });
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analytics-dashboard">
      <AdminHeader title="Analytics" subtitle="Platform analytics & KPIs" />
      <div className="timeframe-controls">
        <button onClick={() => handleTimeframeChange(7)}>Last 7 days</button>
        <button onClick={() => handleTimeframeChange(30)}>Last 30 days</button>
        <button onClick={() => handleTimeframeChange(90)}>Last 90 days</button>
      </div>

      <div className="analytics-grid">
        <div className="hotels-performance">
          <h2>Hotel Performance</h2>
          <div className="hotel-cards">
            {hotelPerformance.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <h3>{hotel.name}</h3>
                <div className="metrics">
                  <div>
                    <label>Revenue</label>
                    <span>${hotel.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div>
                    <label>Orders</label>
                    <span>{hotel.totalOrders}</span>
                  </div>
                  <div>
                    <label>Avg Order Value</label>
                    <span>${hotel.averageOrderValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-products">
          <h2>Top Performing Products</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Revenue</th>
                <th>Units Sold</th>
                <th>Profit Margin</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.revenue.toFixed(2)}</td>
                  <td>{product.salesTrend[0].quantity}</td>
                  <td>{(product.profitMargin * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;