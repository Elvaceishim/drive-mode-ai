import React from 'react';
import { Mail, Calendar, User } from 'lucide-react';

const ActionPreview: React.FC<{ action: any }> = ({ action }) => {
  const getIcon = () => {
    switch (action.action) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'calendar': return <Calendar className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const getActionText = () => {
    if (action.action === 'email') {
      const { to, subject, send } = action.email;
      return send ? `Send email to ${to}: "${subject}"` : `Draft email to ${to}: "${subject}"`;
    } else if (action.action === 'calendar') {
      const { title, datetime } = action.calendar;
      return `Create calendar event: "${title}"${datetime ? ` on ${new Date(datetime).toLocaleDateString()}` : ''}`;
    }
    return 'Unknown action';
  };

  const confidenceColor = action.confidence > 0.8 ? 'text-green-400' : 
                          action.confidence > 0.6 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0 p-2 bg-blue-600 rounded-lg">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Action Preview</h3>
          <p className={`text-sm ${confidenceColor}`}>
            Confidence: {Math.round(action.confidence * 100)}%
          </p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4">{getActionText()}</p>
      
      {action.action === 'email' && (
        <div className="bg-gray-900 rounded p-3 text-sm">
          <p><span className="text-gray-400">To:</span> {action.email.to}</p>
          <p><span className="text-gray-400">Subject:</span> {action.email.subject}</p>
          <p className="mt-2 text-gray-400">Preview:</p>
          <p className="text-gray-300 whitespace-pre-wrap">
            {action.email.body?.substring(0, 100)}...
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionPreview;
