import React, { useState, useEffect } from 'react';
import { sessionManager } from '../../lib/SessionManager';
import { RefreshCw, Trash2, Download, Info } from 'lucide-react';

interface CacheManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CacheManager: React.FC<CacheManagerProps> = ({ isOpen, onClose }) => {
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      updateStats();
    }
  }, [isOpen]);

  const updateStats = () => {
    const stats = sessionManager.getSessionStats();
    setSessionStats(stats);
  };

  const handleForceRefresh = async () => {
    setRefreshing(true);
    try {
      sessionManager.forceRefresh();
    } catch (error) {
      console.error('Error refreshing cache:', error);
      setRefreshing(false);
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all cached data? This will reload the page.')) {
      sessionManager.clearSession();
      window.location.reload();
    }
  };

  const handleExportSession = () => {
    const sessionData = sessionManager.exportSession();
    const blob = new Blob([sessionData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `big-boss-pizza-session-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Cache Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {sessionStats && (
            <div className="space-y-6">
              {/* Session Overview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{sessionStats.age}</div>
                    <div className="text-sm text-gray-600">Session Age</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{sessionStats.size}</div>
                    <div className="text-sm text-gray-600">Cache Size</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${sessionStats.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {sessionStats.valid ? 'Valid' : 'Expired'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </div>

              {/* Cache Components */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cache Components</h3>
                <div className="space-y-3">
                  {Object.entries(sessionStats.components).map(([component, stats]: [string, any]) => (
                    <div key={component} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {component.replace(/([A-Z])/g, ' $1')}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stats.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {stats.valid ? 'Valid' : 'Expired'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Size: {Math.round(stats.size / 1024)} KB</div>
                        <div>Age: {stats.age}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cache Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={updateStats}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh Stats</span>
                  </button>

                  <button
                    onClick={handleForceRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Refreshing...' : 'Force Refresh'}</span>
                  </button>

                  <button
                    onClick={handleClearCache}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Cache</span>
                  </button>

                  <button
                    onClick={handleExportSession}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Session</span>
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 Cache Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Menu data is cached for 1 hour</li>
                  <li>• Cart data persists for 7 days</li>
                  <li>• Navigation state expires after 30 minutes</li>
                  <li>• Active orders are stored until delivery</li>
                  <li>• Force refresh will reload fresh data from server</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CacheManager;
