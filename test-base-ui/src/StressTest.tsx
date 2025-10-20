import React, { useCallback, useEffect, useState } from 'react';
import type { PerformanceMetrics } from './performanceUtils';
import { measureInteraction, measureRenderTime, performanceMonitor } from './performanceUtils';
import './StressTest.css';

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
  category: string;
}

const categories = ['Technology', 'Design', 'Business', 'Science', 'Art', 'Sports'];

const StressTest: React.FC<StressTestProps> = ({ componentCount, onMetricsUpdate }) => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [showMetrics, setShowMetrics] = useState(false);

  // Generate test items
  const generateItems = useCallback(() => {
    const newItems: TestItem[] = [];
    for (let i = 0; i < componentCount; i++) {
      newItems.push({
        id: i,
        title: `Base UI Item ${i + 1}`,
        description: `This is a Base UI test item with ID ${i + 1} for comprehensive performance testing and evaluation`,
        isActive: Math.random() > 0.5,
        value: Math.floor(Math.random() * 100),
        category: categories[Math.floor(Math.random() * categories.length)]
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

  const averageRenderTime = metrics.length > 0 
    ? metrics.reduce((acc, m) => acc + m.renderTime, 0) / metrics.length 
    : 0;

  const averageInteractionTime = metrics.length > 0 
    ? metrics.reduce((acc, m) => acc + m.interactionTime, 0) / metrics.length 
    : 0;

  const peakMemoryUsage = metrics.length > 0 
    ? Math.max(...metrics.map(m => m.memoryUsage)) 
    : 0;

  return (
    <div className="stress-test-container">
      <div className="stress-test-header">
        <div className="stress-test-header-content">
          <div>
            <h2>Base UI Performance Stress Test</h2>
            <p>Testing Base UI component rendering and interaction performance</p>
          </div>
          <div className="stress-test-controls">
            <button
              className="stress-test-button primary"
              onClick={renderStressTest}
              disabled={isRendering}
            >
              {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
            </button>
            <button
              className="stress-test-button secondary"
              onClick={handleBulkToggle}
              disabled={items.length === 0}
            >
              Toggle All Items
            </button>
            <button
              className="stress-test-button secondary"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              {showMetrics ? 'Hide' : 'Show'} Metrics
            </button>
          </div>
        </div>

        {isRendering && (
          <div className="stress-test-progress">
            <p>Rendering {componentCount} Base UI components...</p>
            <div className="progress-bar">
              <div className="progress-fill" />
            </div>
          </div>
        )}
      </div>

      <div className="stress-test-content">
        <div className="stress-test-items">
          {items.map((item) => (
            <div
              key={item.id}
              className={`stress-test-item ${item.isActive ? 'active' : 'inactive'}`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="stress-test-item-header">
                <h3 className="stress-test-item-title">{item.title}</h3>
                <span className={`stress-test-item-value ${item.isActive ? 'active' : ''}`}>
                  {item.value}
                </span>
              </div>
              
              <span className="stress-test-item-category">
                {item.category}
              </span>
              
              <p className="stress-test-item-description">{item.description}</p>
              
              <div className="stress-test-item-actions">
                <button className="stress-test-item-button">
                  Action {item.id + 1}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showMetrics && metrics.length > 0 && (
        <div className="stress-test-metrics">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-item">
              <span className="metric-label">Avg Render Time:</span>
              <span className="metric-value">
                {averageRenderTime.toFixed(2)}ms
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Interaction:</span>
              <span className="metric-value">
                {averageInteractionTime.toFixed(2)}ms
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Peak Memory:</span>
              <span className="metric-value">
                {peakMemoryUsage.toFixed(2)}MB
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Total Tests:</span>
              <span className="metric-value">
                {metrics.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressTest;