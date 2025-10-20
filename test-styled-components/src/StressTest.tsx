import React, { useCallback, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
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

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => props.variant === 'primary' && css`
    background: #4f46e5;
    color: white;
    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
    
    &:hover:not(:disabled) {
      background: #4338ca;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(79, 70, 229, 0.4);
    }
  `}

  ${props => props.variant === 'secondary' && css`
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const ItemCard = styled.div<{ isActive: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  ${props => props.isActive && css`
    border-color: #10b981;
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.isActive 
      ? 'linear-gradient(90deg, #10b981, #059669)' 
      : 'linear-gradient(90deg, #667eea, #764ba2)'
    };
    transform: ${props => props.isActive ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
`;

const ValueBadge = styled.span<{ isActive: boolean }>`
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;

  ${props => props.isActive && css`
    background: #10b981;
  `}
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ItemDescription = styled.p`
  margin: 0 0 16px 0;
  color: #6b7280;
  line-height: 1.5;
  font-size: 0.9rem;
`;

const ItemActions = styled.div`
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }
`;

const MetricsContainer = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
`;

const MetricsTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const MetricCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const MetricLabel = styled.span`
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
`;

const MetricValue = styled.span`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  font-family: 'Monaco', 'Menlo', monospace;
`;

const categories = ['Technology', 'Design', 'Business', 'Science', 'Art', 'Sports'];

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
        title: `Styled Item ${i + 1}`,
        description: `This is a styled-components test item with ID ${i + 1} for comprehensive performance testing and evaluation`,
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

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Performance Stress Test (Styled Components)</Title>
          <Controls>
            <Button 
              variant="primary"
              onClick={renderStressTest}
              disabled={isRendering}
            >
              {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
            </Button>
            <Button 
              variant="secondary"
              onClick={handleBulkToggle}
              disabled={items.length === 0}
            >
              Toggle All Items
            </Button>
          </Controls>
        </HeaderContent>
      </Header>

      <ItemsGrid>
        {items.map(item => (
          <ItemCard 
            key={item.id}
            isActive={item.isActive}
            onClick={() => handleItemClick(item.id)}
          >
            <ItemHeader>
              <ItemTitle>{item.title}</ItemTitle>
              <ValueBadge isActive={item.isActive}>
                {item.value}
              </ValueBadge>
            </ItemHeader>
            
            <CategoryBadge>{item.category}</CategoryBadge>
            
            <ItemDescription>{item.description}</ItemDescription>
            
            <ItemActions>
              <ActionButton>
                Action {item.id + 1}
              </ActionButton>
            </ItemActions>
          </ItemCard>
        ))}
      </ItemsGrid>

      {metrics.length > 0 && (
        <MetricsContainer>
          <MetricsTitle>Performance Metrics</MetricsTitle>
          <MetricsGrid>
            <MetricCard>
              <MetricLabel>Render Time</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.renderTime.toFixed(2)}ms
              </MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Last Interaction</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.interactionTime.toFixed(2)}ms
              </MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Memory Usage</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.memoryUsage.toFixed(2)}MB
              </MetricValue>
            </MetricCard>
            <MetricCard>
              <MetricLabel>Component Count</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.componentCount}
              </MetricValue>
            </MetricCard>
          </MetricsGrid>
        </MetricsContainer>
      )}
    </Container>
  );
};

export default StressTest;
