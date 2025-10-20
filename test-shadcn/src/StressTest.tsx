import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
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
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Performance Stress Test (shadcn/ui)</h2>
        <div className="flex space-x-4">
          <Button 
            onClick={renderStressTest}
            disabled={isRendering}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
          </Button>
          <Button 
            variant="outline"
            onClick={handleBulkToggle}
            disabled={items.length === 0}
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Toggle All Items
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(item => (
          <Card 
            key={item.id}
            className={`cursor-pointer transition-all hover:shadow-lg bg-white border-2 ${
              item.isActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-gray-800">{item.title}</CardTitle>
                <span className="text-2xl font-bold text-blue-600">{item.value}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="mb-4 text-gray-600">
                {item.description}
              </CardDescription>
              <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                Action {item.id + 1}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {metrics.length > 0 && (
        <Card className="mt-8 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics[metrics.length - 1]?.renderTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">Render Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics[metrics.length - 1]?.interactionTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">Last Interaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics[metrics.length - 1]?.memoryUsage.toFixed(2)}MB
                </div>
                <div className="text-sm text-gray-600">Memory Usage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics[metrics.length - 1]?.componentCount}
                </div>
                <div className="text-sm text-gray-600">Component Count</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StressTest;
