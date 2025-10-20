import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap';
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
  const [showAlert, setShowAlert] = useState(false);

  // Generate test items
  const generateItems = useCallback(() => {
    const newItems: TestItem[] = [];
    for (let i = 0; i < componentCount; i++) {
      newItems.push({
        id: i,
        title: `Bootstrap Item ${i + 1}`,
        description: `This is a Bootstrap test item with ID ${i + 1} for comprehensive performance testing and evaluation`,
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
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
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
    <Container fluid className="py-4">
      {/* Header Section */}
      <div className="bg-gradient-primary text-white rounded-3 p-4 mb-4 shadow">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h2 mb-2 fw-semibold">Bootstrap Performance Stress Test</h2>
            <p className="mb-0 opacity-75">Testing Bootstrap component rendering and interaction performance</p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              size="lg"
              onClick={renderStressTest}
              disabled={isRendering}
              className="px-4"
            >
              {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              onClick={handleBulkToggle}
              disabled={items.length === 0}
              className="px-4"
            >
              Toggle All Items
            </Button>
          </div>
        </div>

        {isRendering && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="opacity-75">Rendering {componentCount} Bootstrap components...</small>
              <small className="opacity-75">{Math.round((items.length / componentCount) * 100)}%</small>
            </div>
            <ProgressBar 
              now={(items.length / componentCount) * 100} 
              variant="light" 
              className="opacity-75"
            />
          </div>
        )}
      </div>

      {/* Success Alert */}
      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)} className="mb-4">
          <Alert.Heading>Success!</Alert.Heading>
          Successfully rendered {componentCount} Bootstrap components with performance metrics.
        </Alert>
      )}

      {/* Items Grid */}
      <Row className="g-4 mb-4">
        {items.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card 
              className={`h-100 shadow-sm border-0 ${item.isActive ? 'border-success border-2' : ''}`}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: item.isActive ? 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)' : 'white'
              }}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Header 
                className={`border-0 pb-0 ${item.isActive ? 'bg-success bg-opacity-10' : 'bg-primary bg-opacity-10'}`}
                style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title className="h6 mb-0 text-truncate me-2">{item.title}</Card.Title>
                  <Badge 
                    bg={item.isActive ? 'success' : 'primary'} 
                    className="px-2 py-1"
                  >
                    {item.value}
                  </Badge>
                </div>
              </Card.Header>
              
              <Card.Body className="pt-2">
                <Badge 
                  bg="secondary" 
                  className="mb-3 px-2 py-1"
                  style={{ fontSize: '0.7rem' }}
                >
                  {item.category}
                </Badge>
                
                <Card.Text className="text-muted small mb-3">
                  {item.description}
                </Card.Text>
              </Card.Body>
              
              <Card.Footer className="border-0 pt-0">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(item.id);
                  }}
                >
                  Action {item.id + 1}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Performance Metrics */}
      {metrics.length > 0 && (
        <Card className="shadow-sm">
          <Card.Header className="bg-light">
            <h5 className="mb-0 fw-bold">Performance Metrics</h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 bg-light rounded">
                  <div className="text-muted small mb-1">AVERAGE RENDER TIME</div>
                  <div className="h4 mb-0 fw-bold text-primary">
                    {averageRenderTime.toFixed(2)}ms
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 bg-light rounded">
                  <div className="text-muted small mb-1">AVERAGE INTERACTION</div>
                  <div className="h4 mb-0 fw-bold text-success">
                    {averageInteractionTime.toFixed(2)}ms
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 bg-light rounded">
                  <div className="text-muted small mb-1">PEAK MEMORY USAGE</div>
                  <div className="h4 mb-0 fw-bold text-warning">
                    {peakMemoryUsage.toFixed(2)}MB
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 bg-light rounded">
                  <div className="text-muted small mb-1">TOTAL TESTS</div>
                  <div className="h4 mb-0 fw-bold text-info">
                    {metrics.length}
                  </div>
                </div>
              </Col>
            </Row>
            
            {/* Latest Metrics */}
            <hr className="my-4" />
            <Row className="g-3">
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 border rounded">
                  <div className="text-muted small mb-1">LATEST RENDER</div>
                  <div className="h5 mb-0 fw-bold">
                    {metrics[metrics.length - 1]?.renderTime.toFixed(2)}ms
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 border rounded">
                  <div className="text-muted small mb-1">LATEST INTERACTION</div>
                  <div className="h5 mb-0 fw-bold">
                    {metrics[metrics.length - 1]?.interactionTime.toFixed(2)}ms
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 border rounded">
                  <div className="text-muted small mb-1">CURRENT MEMORY</div>
                  <div className="h5 mb-0 fw-bold">
                    {metrics[metrics.length - 1]?.memoryUsage.toFixed(2)}MB
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <div className="text-center p-3 border rounded">
                  <div className="text-muted small mb-1">COMPONENT COUNT</div>
                  <div className="h5 mb-0 fw-bold">
                    {metrics[metrics.length - 1]?.componentCount}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default StressTest;
