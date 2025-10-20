import React, { useCallback, useEffect, useState } from 'react';
import type { PerformanceMetrics } from './performanceUtils';
import { measureInteraction, measureRenderTime, performanceMonitor } from './performanceUtils';
import * as styles from './styles.css';

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
        title: `Vanilla Extract Item ${i + 1}`,
        description: `This is a Vanilla Extract test item with ID ${i + 1} for performance testing`,
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
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Performance Stress Test (Vanilla Extract)</h2>
          <div className={styles.controls}>
            <button 
              className={`${styles.button} ${styles.buttonVariants.primary}`}
              onClick={renderStressTest}
              disabled={isRendering}
            >
              {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
            </button>
            <button 
              className={`${styles.button} ${styles.buttonVariants.secondary}`}
              onClick={handleBulkToggle}
              disabled={items.length === 0}
            >
              Toggle All Items
            </button>
          </div>
        </div>
      </div>

      <div className={styles.itemsGrid}>
        {items.map(item => (
          <div 
            key={item.id}
            className={`${styles.itemCard} ${styles.itemCardVariants[item.isActive ? 'active' : 'inactive']}`}
            onClick={() => handleItemClick(item.id)}
          >
            <div className={styles.itemHeader}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <span className={`${styles.itemValue} ${styles.itemValueVariants[item.isActive ? 'active' : 'inactive']}`}>
                {item.value}
              </span>
            </div>
            <p className={styles.itemDescription}>{item.description}</p>
            <div className={styles.itemActions}>
              <button className={styles.itemButton}>
                Action {item.id + 1}
              </button>
            </div>
          </div>
        ))}
      </div>

      {metrics.length > 0 && (
        <div className={styles.metricsContainer}>
          <h3 className={styles.metricsTitle}>Performance Metrics</h3>
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Render Time:</span>
              <span className={styles.metricValue}>
                {metrics[metrics.length - 1]?.renderTime.toFixed(2)}ms
              </span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Last Interaction:</span>
              <span className={styles.metricValue}>
                {metrics[metrics.length - 1]?.interactionTime.toFixed(2)}ms
              </span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Memory Usage:</span>
              <span className={styles.metricValue}>
                {metrics[metrics.length - 1]?.memoryUsage.toFixed(2)}MB
              </span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Component Count:</span>
              <span className={styles.metricValue}>
                {metrics[metrics.length - 1]?.componentCount}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressTest;
