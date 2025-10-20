import React, { useCallback, useEffect, useState } from 'react';
import type { PerformanceMetrics } from './performanceUtils';
import { measureInteraction, measureRenderTime, performanceMonitor } from './performanceUtils';
import { styled } from './stitches.config';

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

const Container = styled('div', {
  maxWidth: '1536px',
  margin: '0 auto',
  padding: '$5',
});

const Header = styled('div', {
  background: 'linear-gradient(135deg, $primary 0%, $secondary 100%)',
  borderRadius: '$xl',
  padding: '$5',
  marginBottom: '$8',
  color: '$white',
  boxShadow: '$lg',
});

const HeaderContent = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$4',
});

const Title = styled('h2', {
  fontSize: '$2xl',
  fontWeight: '$semibold',
  margin: 0,
});

const Controls = styled('div', {
  display: 'flex',
  gap: '$3',
});

const Button = styled('button', {
  padding: '$2 $6',
  borderRadius: '$lg',
  fontWeight: '$medium',
  transition: 'all 200ms',
  border: 'none',
  cursor: 'pointer',
  fontSize: '$base',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
        '&:hover': {
          backgroundColor: '$primaryHover',
        },
        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
        },
      },
      secondary: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '$white',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
        '&:disabled': {
          opacity: 0.6,
          cursor: 'not-allowed',
        },
      },
    },
  },
});

const ItemsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '$5',
  marginBottom: '$8',
  
  '@sm': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  },
  '@lg': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  },
  '@xl': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  },
});

const ItemCard = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$xl',
  padding: '$5',
  cursor: 'pointer',
  transition: 'all 300ms',
  border: '2px solid',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  
  '&:hover': {
    boxShadow: '$lg',
    transform: 'translateY(-4px)',
  },
  
  variants: {
    active: {
      true: {
        borderColor: '$success',
        backgroundColor: '$gray50',
      },
      false: {
        borderColor: '$gray200',
        '&:hover': {
          borderColor: '$primary',
        },
      },
    },
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, $primary, $secondary)',
    transform: 'scaleX(0)',
    transition: 'transform 300ms',
  },
  
  '&:hover::before': {
    transform: 'scaleX(1)',
  },
});

const ItemHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '$3',
});

const ItemTitle = styled('h3', {
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '$gray800',
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const ItemValue = styled('span', {
  padding: '$1 $3',
  borderRadius: '$full',
  fontSize: '$sm',
  fontWeight: '$semibold',
  
  variants: {
    active: {
      true: {
        backgroundColor: '$success',
        color: '$white',
      },
      false: {
        backgroundColor: '$primary',
        color: '$white',
      },
    },
  },
});

const ItemDescription = styled('p', {
  color: '$gray600',
  fontSize: '$sm',
  marginBottom: '$4',
  margin: 0,
});

const ItemActions = styled('div', {
  paddingTop: '$4',
  borderTop: '1px solid $gray100',
});

const ItemButton = styled('button', {
  width: '100%',
  padding: '$2 $4',
  backgroundColor: '$gray100',
  color: '$gray700',
  borderRadius: '$lg',
  fontWeight: '$medium',
  transition: 'all 200ms',
  border: 'none',
  cursor: 'pointer',
  
  '&:hover': {
    backgroundColor: '$gray200',
  },
});

const MetricsContainer = styled('div', {
  backgroundColor: '$gray50',
  borderRadius: '$xl',
  padding: '$6',
  border: '1px solid $gray200',
});

const MetricsTitle = styled('h3', {
  fontSize: '$xl',
  fontWeight: '$semibold',
  color: '$gray800',
  marginBottom: '$4',
  margin: 0,
});

const MetricsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '$4',
});

const MetricItem = styled('div', {
  backgroundColor: '$white',
  borderRadius: '$lg',
  padding: '$4',
  border: '1px solid $gray200',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const MetricLabel = styled('span', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$gray600',
});

const MetricValue = styled('span', {
  fontSize: '$lg',
  fontWeight: '$semibold',
  color: '$gray800',
  fontFamily: 'monospace',
});

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
        title: `Stitches Item ${i + 1}`,
        description: `This is a Stitches test item with ID ${i + 1} for performance testing`,
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
    <Container>
      <Header>
        <HeaderContent>
          <Title>Performance Stress Test (Stitches)</Title>
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
            active={item.isActive}
            onClick={() => handleItemClick(item.id)}
          >
            <ItemHeader>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemValue active={item.isActive}>{item.value}</ItemValue>
            </ItemHeader>
            <ItemDescription>{item.description}</ItemDescription>
            <ItemActions>
              <ItemButton>
                Action {item.id + 1}
              </ItemButton>
            </ItemActions>
          </ItemCard>
        ))}
      </ItemsGrid>

      {metrics.length > 0 && (
        <MetricsContainer>
          <MetricsTitle>Performance Metrics</MetricsTitle>
          <MetricsGrid>
            <MetricItem>
              <MetricLabel>Render Time:</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.renderTime.toFixed(2)}ms
              </MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Last Interaction:</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.interactionTime.toFixed(2)}ms
              </MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Memory Usage:</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.memoryUsage.toFixed(2)}MB
              </MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Component Count:</MetricLabel>
              <MetricValue>
                {metrics[metrics.length - 1]?.componentCount}
              </MetricValue>
            </MetricItem>
          </MetricsGrid>
        </MetricsContainer>
      )}
    </Container>
  );
};

export default StressTest;
