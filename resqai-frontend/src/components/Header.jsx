import React from 'react';

export default function Header({ onFilterChange, currentFilter }) {
  return (
    <header className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-md py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Emergency Response Dashboard</h1>
        
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md transition ${currentFilter === 'all' ? 'bg-white text-red-700 font-medium' : 'bg-red-700 hover:bg-red-600'}`}
            onClick={() => onFilterChange('all')}
          >
            All Emergencies
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition ${currentFilter === 'active' ? 'bg-white text-red-700 font-medium' : 'bg-red-700 hover:bg-red-600'}`}
            onClick={() => onFilterChange('active')}
          >
            Active
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition ${currentFilter === 'resolved' ? 'bg-white text-red-700 font-medium' : 'bg-red-700 hover:bg-red-600'}`}
            onClick={() => onFilterChange('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>
    </header>
  );
}