import {
    Assessment,
    Memory,
    Pause,
    PlayArrow,
    Refresh,
    Speed,
    Timer,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Divider,
    IconButton,
    LinearProgress,
    Paper,
    Snackbar,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
  category: string;
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  ...(active && {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #f0fdf4 100%)',
    border: '2px solid #4caf50',
  }),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: active 
      ? 'linear-gradient(90deg, #4caf50, #2e7d32)' 
      : 'linear-gradient(90deg, #2196f3, #1976d2)',
    transform: active ? 'scaleX(1)' : 'scaleX(0)',
    transition: 'transform 0.3s ease',
  },
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
}));

const categories = ['Technology', 'Design', 'Business', 'Science', 'Art', 'Sports'];

const StressTest: React.FC<StressTestProps> = ({ componentCount, onMetricsUpdate }) => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Generate test items
  const generateItems = useCallback(() => {
    const newItems: TestItem[] = [];
    for (let i = 0; i < componentCount; i++) {
      newItems.push({
        id: i,
        title: `Material Item ${i + 1}`,
        description: `This is a Material-UI test item with ID ${i + 1} for comprehensive performance testing and evaluation`,
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
    setSnackbarMessage(`Successfully rendered ${componentCount} Material-UI components`);
    setSnackbarOpen(true);
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
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom>
                Material-UI Performance Stress Test
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Testing Material-UI component rendering and interaction performance
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={isRendering ? <Pause /> : <PlayArrow />}
                onClick={renderStressTest}
                disabled={isRendering}
                size="large"
                sx={{ minWidth: 200 }}
              >
                {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleBulkToggle}
                disabled={items.length === 0}
                size="large"
              >
                Toggle All Items
              </Button>
              <Tooltip title="Toggle Metrics Display">
                <IconButton
                  onClick={() => setShowMetrics(!showMetrics)}
                  color={showMetrics ? 'primary' : 'default'}
                >
                  {showMetrics ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {isRendering && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Rendering {componentCount} Material-UI components...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </Paper>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {items.map((item) => (
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }} key={item.id}>
              <StyledCard 
                active={item.isActive}
                onClick={() => handleItemClick(item.id)}
                elevation={2}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    <Typography variant="h6" component="h3" noWrap>
                      {item.title}
                    </Typography>
                    <Chip 
                      label={item.value} 
                      color={item.isActive ? 'success' : 'default'}
                      size="small"
                      variant={item.isActive ? 'filled' : 'outlined'}
                    />
                  </Stack>
                  
                  <Chip 
                    label={item.category} 
                    size="small" 
                    variant="outlined" 
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    variant="outlined"
                    fullWidth
                    startIcon={<Speed />}
                  >
                    Action {item.id + 1}
                  </Button>
                </CardActions>
              </StyledCard>
            </Box>
          ))}
        </Box>

        {showMetrics && metrics.length > 0 && (
          <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assessment />
              Performance Metrics
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <MetricCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timer color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Avg Render Time
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {averageRenderTime.toFixed(2)}ms
                  </Typography>
                </MetricCard>
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <MetricCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Speed color="secondary" />
                    <Typography variant="body2" color="text.secondary">
                      Avg Interaction
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {averageInteractionTime.toFixed(2)}ms
                  </Typography>
                </MetricCard>
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <MetricCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Memory color="warning" />
                    <Typography variant="body2" color="text.secondary">
                      Peak Memory
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {peakMemoryUsage.toFixed(2)}MB
                  </Typography>
                </MetricCard>
              </Box>
              
              <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                <MetricCard>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment color="info" />
                    <Typography variant="body2" color="text.secondary">
                      Total Tests
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {metrics.length}
                  </Typography>
                </MetricCard>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StressTest;
