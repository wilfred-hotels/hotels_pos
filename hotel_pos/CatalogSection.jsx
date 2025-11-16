// import React, { useEffect, useState } from 'react';
// import { motion } from "framer-motion";
// import toast from 'react-hot-toast';
// import { getCatalogProducts, getCategories, addProduct, updateProduct, deleteProduct } from '../../actions/catalog';

// export default function CatalogSection({ userId }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('name');
//   const [sortOrder, setSortOrder] = useState('asc');

//   // Fetch products and categories
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('access_token');
//         if (!token) throw new Error('No authentication token found');

//         const [productsData, categoriesData] = await Promise.all([
//           getCatalogProducts(token, userId, {
//             categoryId: selectedCategory || undefined,
//             search: searchTerm || undefined,
//             sortBy,
//             order: sortOrder
//           }),
//           getCategories(token, userId)
//         ]);

//         setProducts(productsData);
//         setCategories(categoriesData);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching catalog data:', err);
//         setError(err.message);
//         toast.error('Failed to load catalog data');
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (userId) fetchData();
//   }, [userId, selectedCategory, searchTerm, sortBy, sortOrder]);

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Product Catalog</h1>
//         <button
//           onClick={() => toast.success('Add product functionality coming soon!')}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Add Product
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="grid gap-4 md:flex md:items-center mb-6">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-64 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
//         />
        
//         <select
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//           className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
//         >
//           <option value="">All Categories</option>
//           {categories.map((category) => (
//             <option key={category.id} value={category.id}>
//               {category.name}
//             </option>
//           ))}
//         </select>

//         <div className="flex items-center gap-2">
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
//           >
//             <option value="name">Name</option>
//             <option value="price">Price</option>
//             <option value="createdAt">Date Added</option>
//           </select>
          
//           <button
//             onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//             className="px-3 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
//           >
//             {sortOrder === 'asc' ? '↑' : '↓'}
//           </button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//       ) : error ? (
//         <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
//           {error}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {products.map((product) => {
//             // Calculate metrics
//             const profitMargin = ((product.price - product.cost) / product.price) * 100;
//             const stockStatus = product.stock < 10 ? 'low' : product.stock > 50 ? 'high' : 'normal';

//             return (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
//               >
//                 {product.imageUrl && (
//                   <div className="relative">
//                     <img
//                       src={product.imageUrl}
//                       alt={product.name}
//                       className="w-full h-48 object-cover"
//                     />
//                     <div className="absolute top-2 right-2">
//                       <span className={`
//                         px-2 py-1 rounded text-xs font-medium
//                         ${stockStatus === 'low' ? 'bg-red-100 text-red-800' :
//                           stockStatus === 'high' ? 'bg-green-100 text-green-800' :
//                           'bg-yellow-100 text-yellow-800'}
//                       `}>
//                         {product.stock} in stock
//                       </span>
//                     </div>
//                   </div>
//                 )}
//                 <div className="p-4">
//                   <div className="flex justify-between items-start mb-2">
//                     <h3 className="font-semibold text-lg">{product.name}</h3>
//                     <span className="text-sm text-gray-500 dark:text-gray-400">{product.hotelName}</span>
//                   </div>
                  
//                   <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{product.description}</p>
                  
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div className="text-sm">
//                       <span className="block text-gray-500 dark:text-gray-400">Price</span>
//                       <span className="font-semibold">${product.price.toFixed(2)}</span>
//                     </div>
//                     <div className="text-sm">
//                       <span className="block text-gray-500 dark:text-gray-400">Profit Margin</span>
//                       <span className="font-semibold">{profitMargin.toFixed(1)}%</span>
//                     </div>
//                     <div className="text-sm">
//                       <span className="block text-gray-500 dark:text-gray-400">Revenue</span>
//                       <span className="font-semibold">${product.salesData.revenue.toFixed(2)}</span>
//                     </div>
//                     <div className="text-sm">
//                       <span className="block text-gray-500 dark:text-gray-400">Sales</span>
//                       <span className="font-semibold">{product.salesData.totalSales}</span>
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => toast.success('Edit feature coming soon!')}
//                       className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => toast.success('Delete feature coming soon!')}
//                       className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {!loading && !error && products.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-gray-500 dark:text-gray-400">
//             No products found. {searchTerm || selectedCategory ? 'Try adjusting your filters.' : ''}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
