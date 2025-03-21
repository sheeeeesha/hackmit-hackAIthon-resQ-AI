import React from 'react';
import { CheckCircleIcon, FireIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'; // Updated import path

export default function EmergencyList({ emergencies, selectedId, onSelect, onResolve }) {
  const getEmergencyIcon = (type) => {
    const type_lower = type.toLowerCase();
    if (type_lower.includes('fire')) {
      return <FireIcon className="w-6 h-6 text-red-500" />;
    } else {
      return <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getCriticalityClass = (criticality) => {
    switch(criticality.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="px-4 py-2">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
        Emergencies ({emergencies.length})
      </h2>
      
      <div className="space-y-3">
        {emergencies.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No emergencies found
          </div>
        ) : (
          emergencies.map((emergency) => (
            <div 
              key={emergency.id}
              className={`border rounded-lg p-3 cursor-pointer transition ${
                selectedId === emergency.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              } ${emergency.resolved ? 'opacity-70' : ''}`}
              onClick={() => onSelect(emergency)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getEmergencyIcon(emergency.type_of_emergency)}
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">
                      {emergency.type_of_emergency || 'Unknown Emergency'}
                    </h3>
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {emergency.location || 'Unknown location'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getCriticalityClass(emergency.criticality)}`}>
                    {emergency.criticality || 'Unknown'}
                  </span>
                  
                  {emergency.emotion_analysis && (
                    <span className="text-xs text-gray-500 mt-1">
                      Caller: {emergency.emotion_analysis.caller_emotion}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-gray-500">
                  Casualties: {emergency.approximate_casualties || 'Unknown'}
                </div>
                
                {emergency.resolved ? (
                  <span className="inline-flex items-center text-xs text-green-600">
                    <CheckCircleIcon className="w-4 h-4 mr-1" /> Resolved
                  </span>
                ) : (
                  <button 
                    className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onResolve(emergency.id);
                    }}
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


