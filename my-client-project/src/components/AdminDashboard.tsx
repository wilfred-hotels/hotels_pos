// // import React, { useState } from 'react';
// // import './AdminDashboard.css';

// // const AdminDashboard = () => {
// //   const [activeNav, setActiveNav] = useState('dashboard');

// //   const stats = [
// //     { icon: '👥', value: '1,234', label: 'Total Users' },
// //     { icon: '📦', value: '567', label: 'Products' },
// //     { icon: '💰', value: '$12,456', label: 'Revenue' },
// //     { icon: '📈', value: '89%', label: 'Growth' }
// //   ];

// //   const activities = [
// //     { time: '2 min ago', text: 'New user registered' },
// //     { time: '5 min ago', text: 'Order #1234 completed' },
// //     { time: '1 hour ago', text: 'Product updated' }
// //   ];

// //   const navItems = [
// //     { id: 'dashboard', label: '📊 Dashboard' },
// //     { id: 'users', label: '👥 Users' },
// //     { id: 'products', label: '📦 Products' },
// //     { id: 'orders', label: '💰 Orders' },
// //     { id: 'settings', label: '⚙️ Settings' }
// //   ];

// //   return (
// //     <div className="dashboard">
// //       {/* Sidebar */}
// //       <div className="sidebar">
// //         <div className="logo">
// //           <h2>Admin Panel</h2>
// //         </div>
// //         <nav className="nav">
// //           {navItems.map(item => (
// //             <button
// //               key={item.id}
// //               className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
// //               onClick={() => setActiveNav(item.id)}
// //             >
// //               {item.label}
// //             </button>
// //           ))}
// //         </nav>
// //       </div>

// //       {/* Main Content */}
// //       <div className="main-content">
// //         <header className="header">
// //           <div className=" user-menu">
// //             <h1 className='user-menu'>Dashboard</h1>
// //           </div>
// //           <div className="header-right">
// //             <div className="user-menu">
// //               <span>Admin User</span>
// //               <div className="avatar">A</div>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Stats Cards */}
// //         <div className="stats-grid">
// //           {stats.map((stat, index) => (
// //             <div key={index} className="stat-card">
// //               <div className="stat-icon">{stat.icon}</div>
// //               <div className="stat-info">
// //                 <h3>{stat.value}</h3>
// //                 <p>{stat.label}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Recent Activity */}
// //         <div className="content-grid">
// //           <div className="card user-menu">
// //             <h2>Recent Activity</h2>
// //             <div className="activity-list">
// //               {activities.map((activity, index) => (
// //                 <div key={index} className="activity-item">
// //                   <span className="activity-time">{activity.time}</span>
// //                   <span className="activity-text">{activity.text}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Quick Stats */}
// //           <div className="card user-menu">
// //             <h2>Quick Stats</h2>
// //             <div className="stats-list">
// //               <p>Active Users: 892</p>
// //               <p>Pending Orders: 23</p>
// //               <p>Low Stock Items: 5</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// import React, { useState } from 'react';

// const HotelSalesDashboard: React.FC = () => {
//   const [selectedTimeframe, setSelectedTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

//   const handleTimeframeChange = (timeframe: 'Daily' | 'Weekly' | 'Monthly') => {
//     setSelectedTimeframe(timeframe);
//   };

//   return (
//     <div className="font-display bg-background-light dark:bg-background-dark">
//       <div className="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden">
//         {/* Header */}
//         <div>
//           <header className="flex items-center justify-between bg-background-light dark:bg-background-dark p-4 pb-2 sticky top-0 z-10 border-b border-primary/20">
//             <button className="text-gray-800 dark:text-gray-200">
//               <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
//               </svg>
//             </button>
//             <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1 text-center">Hotel Sales</h1>
//             <div className="w-6"></div>
//           </header>

//           {/* Main Content */}
//           <main className="p-4">
//             {/* Sales Overview Section */}
//             <section className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sales Overview</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {/* Total Revenue Card */}
//                 <div className="flex flex-col gap-2 rounded-lg p-4 bg-white dark:bg-background-dark border border-primary/20">
//                   <p className="text-base font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$12,345</p>
//                   <div className="flex items-center text-green-500">
//                     <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
//                     </svg>
//                     <p className="text-base font-medium">+12%</p>
//                   </div>
//                 </div>

//                 {/* Restaurant Sales Card */}
//                 <div className="flex flex-col gap-2 rounded-lg p-4 bg-white dark:bg-background-dark border border-primary/20">
//                   <p className="text-base font-medium text-gray-600 dark:text-gray-400">Restaurant Sales</p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$7,890</p>
//                   <div className="flex items-center text-red-500">
//                     <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
//                     </svg>
//                     <p className="text-base font-medium">-5%</p>
//                   </div>
//                 </div>

//                 {/* Room Service Card */}
//                 <div className="flex flex-col gap-2 rounded-lg p-4 bg-white dark:bg-background-dark border border-primary/20">
//                   <p className="text-base font-medium text-gray-600 dark:text-gray-400">Room Service</p>
//                   <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$4,455</p>
//                   <div className="flex items-center text-green-500">
//                     <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
//                     </svg>
//                     <p className="text-base font-medium">+20%</p>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Revenue Trends Section */}
//             <section className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Revenue Trends</h2>
              
//               {/* Timeframe Selector */}
//               <div className="mb-4">
//                 <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 p-1">
//                   {(['Daily', 'Weekly', 'Monthly'] as const).map((timeframe) => (
//                     <label
//                       key={timeframe}
//                       className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded px-2 ${
//                         selectedTimeframe === timeframe
//                           ? 'bg-primary text-white dark:text-white'
//                           : 'text-gray-600 dark:text-gray-300'
//                       } text-sm font-medium leading-normal transition-colors`}
//                     >
//                       <span className="truncate">{timeframe}</span>
//                       <input
//                         className="sr-only"
//                         name="revenue-trends"
//                         type="radio"
//                         value={timeframe}
//                         checked={selectedTimeframe === timeframe}
//                         onChange={() => handleTimeframeChange(timeframe)}
//                       />
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Revenue Chart */}
//               <div className="rounded-lg p-4 bg-white dark:bg-background-dark border border-primary/20">
//                 <div className="flex items-baseline justify-between mb-2">
//                   <div>
//                     <p className="text-base font-medium text-gray-600 dark:text-gray-400">Weekly Revenue</p>
//                     <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">$12,345</p>
//                   </div>
//                   <div className="flex items-center text-green-500">
//                     <p className="text-sm font-medium">+12%</p>
//                   </div>
//                 </div>
                
//                 <div className="h-48">
//                   <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
//                     <defs>
//                       <linearGradient gradientUnits="userSpaceOnUse" id="chart-gradient" x1="0" x2="0" y1="0" y2="150">
//                         <stop stopColor="#117dd4" stopOpacity="0.3"></stop>
//                         <stop offset="1" stopColor="#117dd4" stopOpacity="0"></stop>
//                       </linearGradient>
//                     </defs>
//                     <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z" fill="url(#chart-gradient)"></path>
//                     <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#117dd4" strokeLinecap="round" strokeWidth="2"></path>
//                   </svg>
//                 </div>
                
//                 <div className="flex justify-around text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
//                   <p>Week 1</p>
//                   <p>Week 2</p>
//                   <p>Week 3</p>
//                   <p>Week 4</p>
//                 </div>
//               </div>
//             </section>

//             {/* Top Selling Items Section */}
//             <section className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Top Selling Items</h2>
//               <div className="rounded-lg p-4 bg-white dark:bg-background-dark border border-primary/20">
//                 <div className="space-y-3">
//                   {/* Club Sandwich */}
//                   <div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Club Sandwich</p>
//                       <p className="text-sm font-bold text-gray-900 dark:text-gray-100">$1,850</p>
//                     </div>
//                     <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-full h-2">
//                       <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
//                     </div>
//                   </div>

//                   {/* Caesar Salad */}
//                   <div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Caesar Salad</p>
//                       <p className="text-sm font-bold text-gray-900 dark:text-gray-100">$1,520</p>
//                     </div>
//                     <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-full h-2">
//                       <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
//                     </div>
//                   </div>

//                   {/* Cheeseburger */}
//                   <div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cheeseburger</p>
//                       <p className="text-sm font-bold text-gray-900 dark:text-gray-100">$1,230</p>
//                     </div>
//                     <div className="w-full bg-primary/10 dark:bg-primary/20 rounded-full h-2">
//                       <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </main>
//         </div>

//         {/* Footer Navigation */}
//         <footer className="sticky bottom-0 bg-background-light dark:bg-background-dark border-t border-primary/20">
//           <div className="flex justify-around items-center px-4 pt-2 pb-3">
//             {/* Dashboard Link */}
//             <button className="flex flex-col items-center justify-end gap-1 text-primary">
//               <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
//               </svg>
//               <p className="text-xs font-medium tracking-wide">Dashboard</p>
//             </button>

//             {/* Reports Link */}
//             <button className="flex flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
//               <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
//               </svg>
//               <p className="text-xs font-medium tracking-wide">Reports</p>
//             </button>

//             {/* Settings Link */}
//             <button className="flex flex-col items-center justify-end gap-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
//               <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
//               </svg>
//               <p className="text-xs font-medium tracking-wide">Settings</p>
//             </button>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default HotelSalesDashboard;
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';


const HotelSalesDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [isDark, setIsDark] = useState(false);

  const handleTimeframeChange = (timeframe: 'Daily' | 'Weekly' | 'Monthly') => {
    setSelectedTimeframe(timeframe);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`hotel-dashboard ${isDark ? 'dark' : ''}`}>
      <div className="dashboard-container">
        {/* Header */}
        <div>
          <header className="dashboard-header">
            <button className="nav-button" onClick={toggleTheme }>
              <svg fill="currentColor" height="24" viewBox="0 0 256 256" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
              </svg>
            </button>
            <h1 className="dashboard-title">Hotel Sales</h1>
            <div className="w-6"></div>
          </header>

          {/* Main Content */}
          <main className="dashboard-main">
            {/* Sales Overview Section */}
            <section>
              <h2 className="section-title">Sales Overview</h2>
              <div className="cards-grid">
                {/* Total Revenue Card */}
                <div className="stat-card">
                  <p className="stat-label">Total Revenue</p>
                  <p className="stat-value">$12,345</p>
                  <div className="stat-change positive">
                    <svg className="stat-change-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <p>+12%</p>
                  </div>
                </div>

                {/* Restaurant Sales Card */}
                <div className="stat-card">
                  <p className="stat-label">Restaurant Sales</p>
                  <p className="stat-value">$7,890</p>
                  <div className="stat-change negative">
                    <svg className="stat-change-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <p>-5%</p>
                  </div>
                </div>

                {/* Room Service Card */}
                <div className="stat-card">
                  <p className="stat-label">Room Service</p>
                  <p className="stat-value">$4,455</p>
                  <div className="stat-change positive">
                    <svg className="stat-change-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <p>+20%</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Revenue Trends Section */}
            <section>
              <h2 className="section-title">Revenue Trends</h2>
              
              {/* Timeframe Selector */}
              <div className="timeframe-selector">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((timeframe) => (
                  <label
                    key={timeframe}
                    className={`timeframe-label ${selectedTimeframe === timeframe ? 'selected' : ''}`}
                  >
                    <span>{timeframe}</span>
                    <input
                      className="timeframe-input"
                      name="revenue-trends"
                      type="radio"
                      value={timeframe}
                      checked={selectedTimeframe === timeframe}
                      onChange={() => handleTimeframeChange(timeframe)}
                    />
                  </label>
                ))}
              </div>

              {/* Revenue Chart */}
              <div className="chart-container">
                <div className="chart-header">
                  <div>
                    <p className="chart-subtitle">Weekly Revenue</p>
                    <p className="chart-main-value">$12,345</p>
                  </div>
                  <div className="chart-change">
                    <p>+12%</p>
                  </div>
                </div>
                
                <div className="chart-wrapper">
                  <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="chart-gradient" x1="0" x2="0" y1="0" y2="150">
                        <stop stopColor="#117dd4" stopOpacity="0.3"></stop>
                        <stop offset="1" stopColor="#117dd4" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z" fill="url(#chart-gradient)"></path>
                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#117dd4" strokeLinecap="round" strokeWidth="2"></path>
                  </svg>
                </div>
                
                <div className="chart-labels">
                  <p>Week 1</p>
                  <p>Week 2</p>
                  <p>Week 3</p>
                  <p>Week 4</p>
                </div>
              </div>
            </section>

            {/* Top Selling Items Section */}
            <section>
              <h2 className="section-title">Top Selling Items</h2>
              <div className="top-items-container">
                <div className="items-list">
                  {/* Club Sandwich */}
                  <div>
                    <div className="item-row">
                      <p className="item-name">Club Sandwich</p>
                      <p className="item-value">$1,850</p>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  {/* Caesar Salad */}
                  <div>
                    <div className="item-row">
                      <p className="item-name">Caesar Salad</p>
                      <p className="item-value">$1,520</p>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  {/* Cheeseburger */}
                  <div>
                    <div className="item-row">
                      <p className="item-name">Cheeseburger</p>
                      <p className="item-value">$1,230</p>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* Footer Navigation */}
        <footer className="dashboard-footer">
          <div className="footer-nav">
            {/* Dashboard Link */}
            <button className="nav-button active">
              <svg className="nav-icon" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
              </svg>
              <p className="nav-label">Dashboard</p>
            </button>

            {/* Reports Link */}
            <button className="nav-button">
              <svg className="nav-icon" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176ZM104,120v24a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32-16v40a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm32-16v56a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z"></path>
              </svg>
              <p className="nav-label">Reports</p>
            </button>

            {/* Settings Link */}
            <button className="nav-button">
              <svg className="nav-icon" fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
              <p className="nav-label">Settings</p>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HotelSalesDashboard;