import React from 'react';

interface CategoryData {
  id: string;
  name: string;
}

interface Props {
  categories: CategoryData[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  sortBy: 'name' | 'price' | 'createdAt';
  setSortBy: (v: 'name' | 'price' | 'createdAt') => void;
  order: 'asc' | 'desc';
  setOrder: (v: 'asc' | 'desc') => void;
}

const CatalogFilters: React.FC<Props> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  order,
  setOrder,
}) => {
  return (
    <div className="grid gap-4 md:flex md:flex-wrap md:items-center md:gap-6 bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg border border-violet-100 dark:border-violet-700/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-300/30 via-fuchsia-300/25 to-pink-300/30 dark:from-violet-600/10 dark:via-fuchsia-600/10 dark:to-pink-600/10 opacity-80"></div>
      <div className="flex-1 min-w-[300px] relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-violet-200 dark:border-violet-700/50 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300 placeholder-violet-400 dark:placeholder-violet-500 backdrop-blur-sm"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
      </div>

      <div className="flex flex-wrap gap-4 relative">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border border-violet-200 dark:border-violet-700/50 bg-white/90 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-300 min-w-[150px] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22rgb(139,92,246)%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22/></svg>')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-12"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'createdAt')}
          className="px-4 py-3 rounded-xl border border-violet-200 dark:border-violet-700/50 bg-white/90 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all duration-300 min-w-[150px] appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22rgb(139,92,246)%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22/></svg>')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat pr-12"
        >
          <option value="createdAt">Date Added</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>

        <button
          onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {order === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
};

export default CatalogFilters;
