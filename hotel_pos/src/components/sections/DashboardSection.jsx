// import React, { useState, useEffect, useRef } from 'react';
// import anime from 'animejs/dist/bundles/anime.esm.js';  

// const AnimatedKPI = ({ title, value, subtitle, gradient, delay = 0 }) => {
//   const cardRef = useRef(null);
//   const valueRef = useRef(null);

//   useEffect(() => {
//     if (cardRef.current && valueRef.current) {
//       // Card entrance animation
//       anime({
//         targets: cardRef.current,
//         translateY: [50, 0],
//         opacity: [0, 1],
//         easing: 'easeOutExpo',
//         duration: 800,
//         delay: delay
//       });

//       // Counter animation
//       if (typeof value === 'number') {
//         anime({
//           targets: valueRef.current,
//           innerHTML: [0, value],
//           round: 1,
//           easing: 'easeOutExpo',
//           duration: 1500,
//           delay: delay + 300
//         });
//       }
//     }
//   }, [value, delay]);

//   return (
//     <div
//       ref={cardRef}
//       style={{
//         opacity: 0,
//         padding: '1.5rem',
//         borderRadius: '1rem',
//         boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
//         color: 'white',
//         background: gradient,
//         transform: 'translateY(50px)'
//       }}
//     >
//       <div style={{fontSize: '0.875rem', fontWeight: '500', opacity: 0.9}}>{title}</div>
//       <div 
//         ref={valueRef}
//         style={{fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem', minHeight: '2.5rem'}}
//       >
//         {typeof value === 'number' ? '0' : value}
//       </div>
//       {subtitle && <div style={{fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem'}}>{subtitle}</div>}
//     </div>
//   );
// };

// const AnimatedChart = ({ data, title, delay = 0 }) => {
//   const chartRef = useRef(null);
//   const barsRef = useRef([]);

//   useEffect(() => {
//     if (chartRef.current) {
//       // Chart container animation
//       anime({
//         targets: chartRef.current,
//         translateY: [30, 0],
//         opacity: [0, 1],
//         easing: 'easeOutExpo',
//         duration: 1000,
//         delay: delay
//       });

//       // Bar animation
//       anime({
//         targets: barsRef.current,
//         scaleY: [0, 1],
//         transformOrigin: 'bottom',
//         easing: 'easeOutElastic(1, .8)',
//         duration: 1200,
//         delay: anime.stagger(100, {start: delay + 300})
//       });
//     }
//   }, [data, delay]);

//   return (
//     <div
//       ref={chartRef}
//       style={{
//         opacity: 0,
//         padding: '1.5rem',
//         backgroundColor: 'rgba(30, 41, 59, 0.8)',
//         backdropFilter: 'blur(8px)',
//         borderRadius: '1rem',
//         boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//         border: '1px solid rgba(71, 85, 105, 0.5)',
//         transform: 'translateY(30px)'
//       }}
//     >
//       <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>{title}</h3>
//       <div style={{display: 'flex', alignItems: 'end', justifyContent: 'space-between', height: '12rem', gap: '0.5rem'}}>
//         {data.map((item, index) => (
//           <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1}}>
//             <div
//               ref={el => barsRef.current[index] = el}
//               style={{
//                 width: '100%',
//                 height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
//                 background: 'linear-gradient(to top, #8b5cf6, #06b6d4)',
//                 borderRadius: '0.25rem',
//                 transform: 'scaleY(0)'
//               }}
//             />
//             <div style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem'}}>
//               {item.label}
//             </div>
//             <div style={{fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0', marginTop: '0.25rem'}}>
//               {item.value}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ActivityFeed = ({ activities, delay = 0 }) => {
//   const feedRef = useRef(null);
//   const itemRefs = useRef([]);

//   useEffect(() => {
//     if (feedRef.current) {
//       // Feed container animation
//       anime({
//         targets: feedRef.current,
//         translateX: [-30, 0],
//         opacity: [0, 1],
//         easing: 'easeOutExpo',
//         duration: 800,
//         delay: delay
//       });

//       // Staggered item animation
//       anime({
//         targets: itemRefs.current,
//         translateX: [-20, 0],
//         opacity: [0, 1],
//         easing: 'easeOutExpo',
//         duration: 600,
//         delay: anime.stagger(100, {start: delay + 300})
//       });
//     }
//   }, [activities, delay]);

//   return (
//     <div
//       ref={feedRef}
//       style={{
//         opacity: 0,
//         padding: '1.5rem',
//         backgroundColor: 'rgba(30, 41, 59, 0.8)',
//         backdropFilter: 'blur(8px)',
//         borderRadius: '1rem',
//         boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//         border: '1px solid rgba(71, 85, 105, 0.5)',
//         transform: 'translateX(-30px)'
//       }}
//     >
//       <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>Recent Activity</h3>
//       <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
//         {activities.map((activity, index) => (
//           <div
//             key={index}
//             ref={el => itemRefs.current[index] = el}
//             style={{
//               opacity: 0,
//               transform: 'translateX(-20px)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '0.75rem',
//               backgroundColor: 'rgba(51, 65, 85, 0.5)',
//               borderRadius: '0.5rem',
//               border: '1px solid rgba(71, 85, 105, 0.3)'
//             }}
//           >
//             <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
//               <div style={{
//                 width: '2rem',
//                 height: '2rem',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: '0.875rem',
//                 ...(activity.type === 'reservation' ? {backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac'} :
//                   activity.type === 'payment' ? {backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd'} :
//                   activity.type === 'checkin' ? {backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde047'} :
//                   {backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd'})
//               }}>
//                 {activity.icon}
//               </div>
//               <div>
//                 <div style={{fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0'}}>
//                   {activity.message}
//                 </div>
//                 <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>
//                   {activity.details}
//                 </div>
//               </div>
//             </div>
//             <div style={{fontSize: '0.75rem', color: '#64748b'}}>
//               {activity.time}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const LoadingSkeleton = () => {
//   const skeletonRef = useRef(null);

//   useEffect(() => {
//     if (skeletonRef.current) {
//       // Shimmer animation
//       anime({
//         targets: '.skeleton-shimmer',
//         translateX: ['-100%', '100%'],
//         easing: 'easeInOutSine',
//         duration: 1500,
//         loop: true
//       });
//     }
//   }, []);

//   return (
//     <div ref={skeletonRef} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', color: '#e2e8f0'}}>
//       {/* KPI Skeletons */}
//       <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
//         {[...Array(4)].map((_, i) => (
//           <div key={i} style={{position: 'relative', overflow: 'hidden', padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '1rem', border: '1px solid rgba(71, 85, 105, 0.5)'}}>
//             <div style={{height: '1rem', backgroundColor: '#334155', borderRadius: '0.25rem', marginBottom: '1rem', width: '60%'}}></div>
//             <div style={{height: '2rem', backgroundColor: '#334155', borderRadius: '0.25rem', width: '40%'}}></div>
//             <div style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
//               transform: 'translateX(-100%)'
//             }} className="skeleton-shimmer"></div>
//           </div>
//         ))}
//       </div>

//       {/* Chart Skeletons */}
//       <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
//         <div style={{position: 'relative', overflow: 'hidden', padding: '1.5rem', backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '1rem', border: '1px solid rgba(71, 85, 105, 0.5)', height: '20rem'}}>
//           <div style={{height: '1.5rem', backgroundColor: '#334155', borderRadius: '0.25rem', width: '40%', marginBottom: '2rem'}}></div>
//           <div style={{display: 'flex', alignItems: 'end', gap: '1rem', height: '12rem'}}>
//             {[...Array(7)].map((_, i) => (
//               <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
//                 <div style={{width: '100%', height: `${Math.random() * 80 + 20}%`, backgroundColor: '#334155', borderRadius: '0.25rem'}}></div>
//                 <div style={{height: '0.875rem', backgroundColor: '#334155', borderRadius: '0.25rem', width: '60%', marginTop: '0.5rem'}}></div>
//               </div>
//             ))}
//           </div>
//           <div style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
//             transform: 'translateX(-100%)'
//           }} className="skeleton-shimmer"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function DashboardSection() {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const dashboardRef = useRef(null);

//   // Mock data generator
//   const generateMockData = () => {
//     const weeklyRevenue = Array.from({ length: 7 }, (_, i) => ({
//       label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
//       value: Math.floor(Math.random() * 5000) + 2000
//     }));

//     const activities = [
//       { type: 'reservation', icon: '🏨', message: 'New Reservation', details: 'Room 205 - 2 nights', time: '2 min ago' },
//       { type: 'payment', icon: '💳', message: 'Payment Processed', details: 'KSh 18,400 - M-Pesa', time: '5 min ago' },
//       { type: 'checkin', icon: '🔑', message: 'Guest Checked In', details: 'Room 112 - John Doe', time: '12 min ago' },
//       { type: 'maintenance', icon: '🔧', message: 'Maintenance Completed', details: 'Room 308 - AC Repair', time: '25 min ago' },
//       { type: 'reservation', icon: '🏨', message: 'Booking Modified', details: 'Room 401 - Extended stay', time: '38 min ago' }
//     ];

//     return {
//       revenue: {
//         today: 18420,
//         yesterday: 17315,
//         trend: 'up',
//         weeklyData: weeklyRevenue
//       },
//       occupancy: {
//         activeRooms: 78,
//         totalRooms: 120,
//         checkInsToday: 12,
//         checkOutsToday: 8
//       },
//       bookings: {
//         today: 24,
//         pending: 5,
//         confirmed: 19,
//         cancellationRate: 0.12
//       },
//       inventory: {
//         lowStockItems: 7,
//         criticalAlerts: 2,
//         restockNeeded: ['Toiletries', 'Linens', 'Beverages']
//       },
//       activities: activities
//     };
//   };

//   // Simulate API calls
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       setLoading(true);
      
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const data = generateMockData();
//       setDashboardData(data);
//       setLastUpdate(new Date());
//       setLoading(false);

//       // Initialize dashboard animations
//       if (dashboardRef.current) {
//         anime({
//           targets: dashboardRef.current,
//           opacity: [0, 1],
//           duration: 1000,
//           easing: 'easeOutExpo'
//         });
//       }
//     };

//     fetchDashboardData();

//     // Set up real-time updates every 30 seconds
//     const interval = setInterval(() => {
//       setDashboardData(prev => {
//         if (!prev) return prev;
        
//         // Pulse animation for updates
//         anime({
//           targets: '.kpi-pulse',
//           scale: [1, 1.05, 1],
//           duration: 600,
//           easing: 'easeInOutQuad'
//         });

//         return {
//           ...prev,
//           revenue: {
//             ...prev.revenue,
//             today: prev.revenue.today + Math.floor(Math.random() * 100) - 50
//           }
//         };
//       });
//       setLastUpdate(new Date());
//     }, 30000);

//     return () => clearInterval(interval);
//   }, []);

//   if (loading) {
//     return <LoadingSkeleton />;
//   }

//   if (!dashboardData) {
//     return (
//       <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#e2e8f0'}}>
//         <div>Unable to load dashboard data</div>
//       </div>
//     );
//   }

//   return (
//     <div 
//       ref={dashboardRef}
//       style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', color: '#e2e8f0', opacity: 0}}
//     >
//       {/* Header with last update */}
//       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
//         <div>
//           <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', background: 'linear-gradient(to right, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
//             Hotel Dashboard
//           </h1>
//           <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem'}}>
//             Real-time overview of hotel operations and performance
//           </p>
//         </div>
//         {lastUpdate && (
//           <div style={{fontSize: '0.75rem', color: '#64748b'}}>
//             Last updated: {lastUpdate.toLocaleTimeString()}
//           </div>
//         )}
//       </div>

//       {/* KPI Grid */}
//       <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
//         <div className="kpi-pulse">
//           <AnimatedKPI
//             title="Revenue Today"
//             value={dashboardData.revenue.today}
//             subtitle={`KSh ${(dashboardData.revenue.today - dashboardData.revenue.yesterday).toLocaleString()} vs yesterday`}
//             gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
//             delay={0}
//           />
//         </div>
        
//         <div className="kpi-pulse">
//           <AnimatedKPI
//             title="Active Rooms"
//             value={dashboardData.occupancy.activeRooms}
//             subtitle={`${dashboardData.occupancy.checkInsToday} check-ins today`}
//             gradient="linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)"
//             delay={100}
//           />
//         </div>
        
//         <div className="kpi-pulse">
//           <AnimatedKPI
//             title="Today's Bookings"
//             value={dashboardData.bookings.today}
//             subtitle={`${dashboardData.bookings.pending} pending approval`}
//             gradient="linear-gradient(135deg, #a855f7 0%, #ec4899 100%)"
//             delay={200}
//           />
//         </div>
        
//         <div className="kpi-pulse">
//           <AnimatedKPI
//             title="Low Stock Items"
//             value={dashboardData.inventory.lowStockItems}
//             subtitle={`${dashboardData.inventory.criticalAlerts} critical alerts`}
//             gradient="linear-gradient(135deg, #f97316 0%, #ef4444 100%)"
//             delay={300}
//           />
//         </div>
//       </div>

//       {/* Charts and Activity Feed */}
//       <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', gap: '1rem'}}>
//         <AnimatedChart
//           data={dashboardData.revenue.weeklyData}
//           title="Weekly Revenue Trend"
//           delay={400}
//         />
        
//         <ActivityFeed
//           activities={dashboardData.activities}
//           delay={500}
//         />
//       </div>

//       {/* Additional Metrics */}
//       <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem'}}>
//         <div style={{
//           padding: '1.5rem',
//           backgroundColor: 'rgba(30, 41, 59, 0.8)',
//           backdropFilter: 'blur(8px)',
//           borderRadius: '1rem',
//           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//           border: '1px solid rgba(71, 85, 105, 0.5)'
//         }}>
//           <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>Occupancy Rate</h3>
//           <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
//             <div style={{
//               width: '6rem',
//               height: '6rem',
//               borderRadius: '50%',
//               background: `conic-gradient(#8b5cf6 ${(dashboardData.occupancy.activeRooms / dashboardData.occupancy.totalRooms) * 100}%, #334155 0%)`,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               position: 'relative'
//             }}>
//               <div style={{
//                 width: '4rem',
//                 height: '4rem',
//                 backgroundColor: 'rgba(30, 41, 59, 0.9)',
//                 borderRadius: '50%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: '1.125rem',
//                 fontWeight: 'bold',
//                 color: '#e2e8f0'
//               }}>
//                 {Math.round((dashboardData.occupancy.activeRooms / dashboardData.occupancy.totalRooms) * 100)}%
//               </div>
//             </div>
//             <div style={{flex: 1}}>
//               <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>
//                 {dashboardData.occupancy.activeRooms} of {dashboardData.occupancy.totalRooms} rooms occupied
//               </div>
//               <div style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem'}}>
//                 {dashboardData.occupancy.checkInsToday} check-ins • {dashboardData.occupancy.checkOutsToday} check-outs
//               </div>
//             </div>
//           </div>
//         </div>

//         <div style={{
//           padding: '1.5rem',
//           backgroundColor: 'rgba(30, 41, 59, 0.8)',
//           backdropFilter: 'blur(8px)',
//           borderRadius: '1rem',
//           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//           border: '1px solid rgba(71, 85, 105, 0.5)'
//         }}>
//           <h3 style={{fontWeight: '600', color: '#f1f5f9', marginBottom: '1rem'}}>Restock Needed</h3>
//           <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
//             {dashboardData.inventory.restockNeeded.map((item, index) => (
//               <div key={index} style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 padding: '0.5rem',
//                 backgroundColor: index < dashboardData.inventory.criticalAlerts ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
//                 borderRadius: '0.375rem',
//                 border: `1px solid ${index < dashboardData.inventory.criticalAlerts ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
//               }}>
//                 <div style={{
//                   width: '0.5rem',
//                   height: '0.5rem',
//                   borderRadius: '50%',
//                   backgroundColor: index < dashboardData.inventory.criticalAlerts ? '#ef4444' : '#f59e0b'
//                 }}></div>
//                 <span style={{
//                   fontSize: '0.875rem',
//                   color: index < dashboardData.inventory.criticalAlerts ? '#fca5a5' : '#fde047'
//                 }}>
//                   {item}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';

const AnimatedKPI = ({ title, value, subtitle, gradient, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      
      if (typeof value === 'number') {
        let start = 0;
        const duration = 1500;
        const increment = value / (duration / 16);
        
        const counter = setInterval(() => {
          start += increment;
          if (start >= value) {
            setDisplayValue(value);
            clearInterval(counter);
          } else {
            setDisplayValue(Math.floor(start));
          }
        }, 16);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div 
      className={`
        p-6 rounded-xl shadow-lg text-white transform transition-all duration-700 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        ${gradient}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-sm font-medium opacity-90">{title}</div>
      <div className="text-2xl font-bold mt-2 min-h-[2.5rem]">
        {typeof value === 'number' ? displayValue.toLocaleString() : value}
      </div>
      {subtitle && <div className="text-xs opacity-80 mt-1">{subtitle}</div>}
    </div>
  );
};

const AnimatedChart = ({ data, title, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`
        p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50
        transform transition-all duration-700 ease-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="font-semibold text-slate-100 mb-4">{title}</h3>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`
                w-full bg-gradient-to-t from-purple-600 to-cyan-500 rounded transition-all duration-1000 ease-out
                ${isVisible ? 'scale-y-100' : 'scale-y-0'}
              `}
              style={{ 
                height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                transitionDelay: `${delay + (index * 100)}ms`,
                transformOrigin: 'bottom'
              }}
            />
            <div className="text-xs text-slate-400 mt-2">{item.label}</div>
            <div className="text-sm font-semibold text-slate-200 mt-1">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActivityFeed = ({ activities, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`
        p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50
        transform transition-all duration-700 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="font-semibold text-slate-100 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/30
              transform transition-all duration-500 ease-out
              ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
            `}
            style={{ transitionDelay: `${delay + (index * 100)}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300
                ${activity.type === 'reservation' ? 'bg-green-500/20 text-green-400' :
                  activity.type === 'payment' ? 'bg-blue-500/20 text-blue-400' :
                  activity.type === 'checkin' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-purple-500/20 text-purple-400'}
              `}>
                {activity.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-100">
                  {activity.message}
                </div>
                <div className="text-xs text-slate-400">
                  {activity.details}
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 p-4 text-slate-200">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative overflow-hidden p-6 bg-slate-800/80 rounded-xl border border-slate-700/50">
            <div className="h-4 bg-slate-700 rounded mb-4 w-3/5 animate-pulse"></div>
            <div className="h-8 bg-slate-700 rounded w-2/5 animate-pulse"></div>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-600/20 to-transparent animate-shimmer"></div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="p-6 bg-slate-800/80 rounded-xl border border-slate-700/50">
        <div className="h-6 bg-slate-700 rounded w-2/5 mb-6 animate-pulse"></div>
        <div className="flex items-end gap-3 h-48">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-slate-700 rounded animate-pulse"
                style={{ height: `${Math.random() * 80 + 20}%` }}
              ></div>
              <div className="h-3 bg-slate-700 rounded w-3/4 mt-2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add custom shimmer animation to global CSS
const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
      50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s infinite;
    }
  `}</style>
);

export default function DashboardSection() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Mock data generator
  const generateMockData = () => {
    const weeklyRevenue = Array.from({ length: 7 }, (_, i) => ({
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      value: Math.floor(Math.random() * 5000) + 2000
    }));

    const activities = [
      { type: 'reservation', icon: '🏨', message: 'New Reservation', details: 'Room 205 - 2 nights', time: '2 min ago' },
      { type: 'payment', icon: '💳', message: 'Payment Processed', details: 'KSh 18,400 - M-Pesa', time: '5 min ago' },
      { type: 'checkin', icon: '🔑', message: 'Guest Checked In', details: 'Room 112 - John Doe', time: '12 min ago' },
      { type: 'maintenance', icon: '🔧', message: 'Maintenance Completed', details: 'Room 308 - AC Repair', time: '25 min ago' },
      { type: 'reservation', icon: '🏨', message: 'Booking Modified', details: 'Room 401 - Extended stay', time: '38 min ago' }
    ];

    return {
      revenue: {
        today: 18420,
        yesterday: 17315,
        trend: 'up',
        weeklyData: weeklyRevenue
      },
      occupancy: {
        activeRooms: 78,
        totalRooms: 120,
        checkInsToday: 12,
        checkOutsToday: 8
      },
      bookings: {
        today: 24,
        pending: 5,
        confirmed: 19,
        cancellationRate: 0.12
      },
      inventory: {
        lowStockItems: 7,
        criticalAlerts: 2,
        restockNeeded: ['Toiletries', 'Linens', 'Beverages']
      },
      activities: activities
    };
  };

  // Simulate API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = generateMockData();
      setDashboardData(data);
      setLastUpdate(new Date());
      setLoading(false);
    };

    fetchDashboardData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      setDashboardData(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          revenue: {
            ...prev.revenue,
            today: prev.revenue.today + Math.floor(Math.random() * 100) - 50
          }
        };
      });
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        <GlobalStyles />
        <LoadingSkeleton />
      </>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-50vh text-slate-200">
        <div>Unable to load dashboard data</div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="space-y-6 p-4 text-slate-200">
        {/* Header with last update */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Hotel Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time overview of hotel operations and performance
            </p>
          </div>
          {lastUpdate && (
            <div className="text-xs text-slate-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="animate-pulse-glow">
            <AnimatedKPI
              title="Revenue Today"
              value={dashboardData.revenue.today}
              subtitle={`KSh ${(dashboardData.revenue.today - dashboardData.revenue.yesterday).toLocaleString()} vs yesterday`}
              gradient="bg-gradient-to-br from-indigo-600 to-purple-600"
              delay={0}
            />
          </div>
          
          <div className="animate-pulse-glow">
            <AnimatedKPI
              title="Active Rooms"
              value={dashboardData.occupancy.activeRooms}
              subtitle={`${dashboardData.occupancy.checkInsToday} check-ins today`}
              gradient="bg-gradient-to-br from-cyan-600 to-blue-600"
              delay={100}
            />
          </div>
          
          <div className="animate-pulse-glow">
            <AnimatedKPI
              title="Today's Bookings"
              value={dashboardData.bookings.today}
              subtitle={`${dashboardData.bookings.pending} pending approval`}
              gradient="bg-gradient-to-br from-purple-600 to-pink-500"
              delay={200}
            />
          </div>
          
          <div className="animate-pulse-glow">
            <AnimatedKPI
              title="Low Stock Items"
              value={dashboardData.inventory.lowStockItems}
              subtitle={`${dashboardData.inventory.criticalAlerts} critical alerts`}
              gradient="bg-gradient-to-br from-orange-500 to-red-500"
              delay={300}
            />
          </div>
        </div>

        {/* Charts and Activity Feed */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatedChart
            data={dashboardData.revenue.weeklyData}
            title="Weekly Revenue Trend"
            delay={400}
          />
          
          <ActivityFeed
            activities={dashboardData.activities}
            delay={500}
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {/* Occupancy Rate */}
          <div className="p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
            <h3 className="font-semibold text-slate-100 mb-4">Occupancy Rate</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center">
                  <div className="text-xl font-bold text-slate-100">
                    {Math.round((dashboardData.occupancy.activeRooms / dashboardData.occupancy.totalRooms) * 100)}%
                  </div>
                </div>
                <div 
                  className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-purple-500 border-r-cyan-500 transform -rotate-45 transition-all duration-1000 ease-out"
                  style={{
                    clipPath: `conic-gradient(transparent 0%, transparent ${100 - (dashboardData.occupancy.activeRooms / dashboardData.occupancy.totalRooms) * 100}%, currentColor ${100 - (dashboardData.occupancy.activeRooms / dashboardData.occupancy.totalRooms) * 100}%, currentColor 100%)`
                  }}
                ></div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-400">
                  {dashboardData.occupancy.activeRooms} of {dashboardData.occupancy.totalRooms} rooms occupied
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {dashboardData.occupancy.checkInsToday} check-ins • {dashboardData.occupancy.checkOutsToday} check-outs
                </div>
              </div>
            </div>
          </div>

          {/* Restock Needed */}
          <div className="p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
            <h3 className="font-semibold text-slate-100 mb-4">Restock Needed</h3>
            <div className="space-y-2">
              {dashboardData.inventory.restockNeeded.map((item, index) => (
                <div 
                  key={index}
                  className={`
                    flex items-center gap-3 p-2 rounded-lg border transition-all duration-300 hover:scale-105
                    ${index < dashboardData.inventory.criticalAlerts 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }
                  `}
                >
                  <div className={`
                    w-2 h-2 rounded-full animate-pulse
                    ${index < dashboardData.inventory.criticalAlerts ? 'bg-red-400' : 'bg-yellow-400'}
                  `}></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="text-2xl font-bold text-green-400">{dashboardData.bookings.confirmed}</div>
            <div className="text-xs text-slate-400 mt-1">Confirmed</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="text-2xl font-bold text-yellow-400">{dashboardData.bookings.pending}</div>
            <div className="text-xs text-slate-400 mt-1">Pending</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="text-2xl font-bold text-blue-400">{dashboardData.occupancy.checkInsToday}</div>
            <div className="text-xs text-slate-400 mt-1">Check-ins</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <div className="text-2xl font-bold text-cyan-400">{dashboardData.occupancy.checkOutsToday}</div>
            <div className="text-xs text-slate-400 mt-1">Check-outs</div>
          </div>
        </div>
      </div>
    </>
  );
}