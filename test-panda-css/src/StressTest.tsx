import React, { useCallback, useEffect, useState } from 'react';
import { css } from '../styled-system/css';
import { stack } from '../styled-system/patterns';
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
        title: `Panda Item ${i + 1}`,
        description: `This is a Panda CSS test item with ID ${i + 1} for comprehensive performance testing and evaluation`,
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
    <div className={css({ maxWidth: '1200px', margin: '0 auto', padding: '20px' })}>
      <div className={css({
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      })}>
        <div className={stack({ direction: 'row', justify: 'space-between', align: 'center', gap: '16px' })} style={{ flexWrap: 'wrap' }}>
          <div>
            <h2 className={css({ fontSize: '2xl', fontWeight: 'bold', margin: '0 0 8px 0' })}>
              Panda CSS Performance Stress Test
            </h2>
            <p className={css({ fontSize: 'lg', opacity: 0.9, margin: '0' })}>
              Testing Panda CSS component rendering and interaction performance
            </p>
          </div>
          <div className={stack({ direction: 'row', gap: '12px' })} style={{ flexWrap: 'wrap' }}>
            <button
              className={css({
                bg: isRendering ? 'gray.500' : 'blue.600',
                color: 'white',
                px: '24px',
                py: '12px',
                borderRadius: '8px',
                fontSize: 'sm',
                fontWeight: 'medium',
                cursor: isRendering ? 'not-allowed' : 'pointer',
                opacity: isRendering ? 0.6 : 1,
                transition: 'all 0.2s ease',
                border: 'none',
                '&:hover': {
                  bg: isRendering ? 'gray.500' : 'blue.700',
                  transform: isRendering ? 'none' : 'translateY(-1px)'
                }
              })}
              onClick={renderStressTest}
              disabled={isRendering}
            >
              {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
            </button>
            <button
              className={css({
                bg: 'transparent',
                color: 'white',
                px: '24px',
                py: '12px',
                borderRadius: '8px',
                fontSize: 'sm',
                fontWeight: 'medium',
                cursor: items.length === 0 ? 'not-allowed' : 'pointer',
                opacity: items.length === 0 ? 0.6 : 1,
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bg: 'rgba(255, 255, 255, 0.1)',
                  transform: items.length === 0 ? 'none' : 'translateY(-1px)'
                }
              })}
              onClick={handleBulkToggle}
              disabled={items.length === 0}
            >
              Toggle All Items
            </button>
            <button
              className={css({
                bg: 'transparent',
                color: 'white',
                px: '24px',
                py: '12px',
                borderRadius: '8px',
                fontSize: 'sm',
                fontWeight: 'medium',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bg: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-1px)'
                }
              })}
              onClick={() => setShowMetrics(!showMetrics)}
            >
              {showMetrics ? 'Hide' : 'Show'} Metrics
            </button>
          </div>
        </div>

        {isRendering && (
          <div className={css({ marginTop: '16px' })}>
            <p className={css({ fontSize: 'sm', opacity: 0.8, margin: '0 0 8px 0' })}>
              Rendering {componentCount} Panda CSS components...
            </p>
            <div className={css({
              width: '100%',
              height: '4px',
              bg: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            })}>
              <div className={css({
                width: '100%',
                height: '100%',
                bg: 'white',
                animation: 'pulse 1.5s ease-in-out infinite'
              })} />
            </div>
          </div>
        )}
      </div>

      <div className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      })}>
        {items.map((item) => (
          <div
            key={item.id}
            className={css({
              bg: item.isActive ? 'green.50' : 'white',
              border: `2px solid ${item.isActive ? 'green.400' : 'gray.200'}`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                borderColor: item.isActive ? 'green.500' : 'blue.400'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: item.isActive 
                  ? 'linear-gradient(90deg, #10b981, #059669)' 
                  : 'linear-gradient(90deg, #667eea, #764ba2)',
                transform: item.isActive ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 0.3s ease'
              }
            })}
            onClick={() => handleItemClick(item.id)}
          >
            <div className={stack({ direction: 'row', justify: 'space-between', align: 'center', marginBottom: '12px' })}>
              <h3 className={css({
                fontSize: 'lg',
                fontWeight: 'semibold',
                color: 'gray.800',
                margin: '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              })}>
                {item.title}
              </h3>
              <span className={css({
                bg: item.isActive ? 'green.100' : 'blue.100',
                color: item.isActive ? 'green.800' : 'blue.800',
                px: '12px',
                py: '4px',
                borderRadius: 'full',
                fontSize: 'sm',
                fontWeight: 'semibold',
                minWidth: '40px',
                textAlign: 'center'
              })}>
                {item.value}
              </span>
            </div>
            
            <div className={css({ marginBottom: '12px' })}>
              <span className={css({
                bg: 'gray.100',
                color: 'gray.700',
                px: '8px',
                py: '2px',
                borderRadius: 'md',
                fontSize: 'xs',
                fontWeight: 'medium'
              })}>
                {item.category}
              </span>
            </div>
            
            <p className={css({
              color: 'gray.600',
              fontSize: 'sm',
              lineHeight: '1.5',
              margin: '0 0 16px 0'
            })}>
              {item.description}
            </p>
            
            <button className={css({
              width: '100%',
              bg: 'gray.100',
              color: 'gray.700',
              px: '16px',
              py: '8px',
              borderRadius: 'lg',
              fontSize: 'sm',
              fontWeight: 'medium',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid gray.300',
              '&:hover': {
                bg: 'gray.200',
                transform: 'translateY(-1px)'
              }
            })}>
              Action {item.id + 1}
            </button>
          </div>
        ))}
      </div>

      {showMetrics && metrics.length > 0 && (
        <div className={css({
          bg: 'gray.50',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid gray.200'
        })}>
          <h3 className={css({
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'gray.800',
            margin: '0 0 20px 0'
          })}>
            Performance Metrics
          </h3>
          
          <div className={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          })}>
            <div className={css({
              bg: 'white',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid gray.200'
            })}>
              <div className={stack({ direction: 'row', justify: 'space-between', align: 'center' })}>
                <span className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'gray.600' })}>
                  Avg Render Time
                </span>
                <span className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'gray.800', fontFamily: 'mono' })}>
                  {averageRenderTime.toFixed(2)}ms
                </span>
              </div>
            </div>
            
            <div className={css({
              bg: 'white',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid gray.200'
            })}>
              <div className={stack({ direction: 'row', justify: 'space-between', align: 'center' })}>
                <span className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'gray.600' })}>
                  Avg Interaction
                </span>
                <span className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'gray.800', fontFamily: 'mono' })}>
                  {averageInteractionTime.toFixed(2)}ms
                </span>
              </div>
            </div>
            
            <div className={css({
              bg: 'white',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid gray.200'
            })}>
              <div className={stack({ direction: 'row', justify: 'space-between', align: 'center' })}>
                <span className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'gray.600' })}>
                  Peak Memory
                </span>
                <span className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'gray.800', fontFamily: 'mono' })}>
                  {peakMemoryUsage.toFixed(2)}MB
                </span>
              </div>
            </div>
            
            <div className={css({
              bg: 'white',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid gray.200'
            })}>
              <div className={stack({ direction: 'row', justify: 'space-between', align: 'center' })}>
                <span className={css({ fontSize: 'sm', fontWeight: 'medium', color: 'gray.600' })}>
                  Total Tests
                </span>
                <span className={css({ fontSize: 'lg', fontWeight: 'bold', color: 'gray.800', fontFamily: 'mono' })}>
                  {metrics.length}
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
