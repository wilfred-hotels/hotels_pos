import React from 'react';

interface Props {
  onAdd: () => void;
}

const CatalogHeader: React.FC<Props> = ({ onAdd }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-gradient-to-br from-violet-100/30 via-fuchsia-100/20 to-pink-100/30 p-6 rounded-2xl shadow-sm border border-violet-100/40">
      <div className="relative space-y-1">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-pink-600 bg-clip-text text-transparent">Product Overview</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Review your products, manage stock and pricing across hotels.</p>
      </div>

      <div className="relative flex-shrink-0">
        <button onClick={onAdd} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-lg shadow-md hover:scale-105 transition-transform">
          + Add New Product
        </button>
      </div>
    </div>
  );
};

export default CatalogHeader;
