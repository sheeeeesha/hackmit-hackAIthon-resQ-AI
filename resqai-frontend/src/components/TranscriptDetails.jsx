import React from 'react';

export default function TranscriptDetail({ emergency, transcript }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      // If timestamp is a Firestore timestamp
      if (timestamp.toDate) {
        const date = timestamp.toDate();
        return date.toLocaleTimeString();
      }
      
      // If timestamp is already a Date object
      if (timestamp instanceof Date) {
        return timestamp.toLocaleTimeString();
      }
      
      // If timestamp is a string or number
      return new Date(timestamp).toLocaleTimeString();
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-50 p-4 border-b">
        <h2 className="text-lg text-black font-semibold mb-1">Emergency Details</h2>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Type:</span>
            <span className="font-medium text-black">{emergency?.type_of_emergency || 'Unknown'}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-gray-500">Criticality:</span>
            <span className="font-medium  text-black">{emergency?.criticality || 'Unknown'}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-gray-500">Location:</span>
            <span className="font-medium  text-black">{emergency?.location || 'Unknown'}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-gray-500">Casualties:</span>
            <span className="font-medium  text-black">{emergency?.approximate_casualties || 'Unknown'}</span>
          </div>
          
          {emergency?.emotion_analysis && (
            <>
              <div className="flex flex-col">
                <span className="text-gray-500">Caller Emotion:</span>
                <span className="font-medium  text-black">{emergency.emotion_analysis.caller_emotion}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-medium  text-black">
                  {Math.round(emergency.emotion_analysis.confidence_score * 100)}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-medium  text-black mb-3">Call Transcript</h3>
        
        {transcript.length === 0 ? (
          <p className="text-black italic">No transcript available</p>
        ) : (
          <div className="space-y-3">
            {transcript.map((entry, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  entry.speaker === 'caller' 
                    ? 'bg-blue-50 border-blue-100 border' 
                    : 'bg-gray-50 border-gray-100 border'
                }`}
              >
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-medium">
                    {entry.speaker === 'caller' ? 'Caller' : 'AI Operator'}
                  </span>
                  <span>{formatTimestamp(entry.timestamp)}</span>
                </div>
                <p className="text-sm  text-black">{entry.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}