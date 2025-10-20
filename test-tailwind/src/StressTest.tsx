import React, { useCallback, useEffect, useState } from 'react';
import type { PerformanceMetrics } from './performanceUtils';
import { measureInteraction, measureRenderTime, performanceMonitor } from './performanceUtils';

interface StressTestProps {
  componentCount: number;
  onMetricsUpdate: (metrics: PerformanceMetrics[]) => void;
}

interface TestItem {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  value: number;
}

const StressTest: React.FC<StressTestProps> = ({ componentCount, onMetricsUpdate }) => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  // Generate test items
  const generateItems = useCallback(() => {
    const newItems: TestItem[] = [];
    for (let i = 0; i < componentCount; i++) {
      newItems.push({
        id: i,
        title: `Item ${i + 1}`,
        description: `This is a test item with ID ${i + 1} for performance testing`,
        isActive: Math.random() > 0.5,
        value: Math.floor(Math.random() * 100)
      });
    }
    return newItems;
  }, [componentCount]);

  // Render stress test
  const renderStressTest = useCallback(async () => {
    setIsRendering(true);
    
    const newItems = generateItems();
    
    await measureRenderTime(() => {
      setItems(newItems);
    }, componentCount);
    
    setIsRendering(false);
  }, [componentCount, generateItems]);

  // Handle item interaction
  const handleItemClick = useCallback(async (id: number) => {
    await measureInteraction(async () => {
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id 
            ? { ...item, isActive: !item.isActive, value: item.value + 1 }
            : item
        )
      );
    });
  }, []);

  // Handle bulk interaction
  const handleBulkToggle = useCallback(async () => {
    await measureInteraction(async () => {
      setItems(prevItems => 
        prevItems.map(item => ({ ...item, isActive: !item.isActive }))
      );
    });
  }, []);

  // Update metrics when items change
  useEffect(() => {
    const currentMetrics = performanceMonitor.getMetrics();
    setMetrics(currentMetrics);
    onMetricsUpdate(currentMetrics);
  }, [items, onMetricsUpdate]);

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 mb-8 text-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Performance Stress Test (Tailwind CSS)</h2>
          <div className="flex gap-3">
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={renderStressTest}
              disabled={isRendering}
            >
              {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
            </button>
            <button 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleBulkToggle}
              disabled={items.length === 0}
            >
              Toggle All Items
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
        {items.map(item => (
          <div 
            key={item.id}
            className={`bg-white rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 relative overflow-hidden ${
              item.isActive ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-indigo-300'
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transition-transform duration-300 hover:scale-x-100"></div>
            
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                item.isActive ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {item.value}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200">
                Action {item.id + 1}
              </button>
            </div>
          </div>
        ))}
      </div>

      {metrics.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Render Time:</span>
                <span className="text-lg font-semibold text-gray-800 font-mono">
                  {metrics[metrics.length - 1]?.renderTime.toFixed(2)}ms
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Last Interaction:</span>
                <span className="text-lg font-semibold text-gray-800 font-mono">
                  {metrics[metrics.length - 1]?.interactionTime.toFixed(2)}ms
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Memory Usage:</span>
                <span className="text-lg font-semibold text-gray-800 font-mono">
                  {metrics[metrics.length - 1]?.memoryUsage.toFixed(2)}MB
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Component Count:</span>
                <span className="text-lg font-semibold text-gray-800 font-mono">
                  {metrics[metrics.length - 1]?.componentCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressTest;
