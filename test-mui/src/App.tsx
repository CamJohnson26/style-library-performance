import {
    Assessment,
    Download,
    Memory,
    PlayArrow,
    Speed,
    Timer
} from '@mui/icons-material'
import {
    Alert,
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    createTheme,
    CssBaseline,
    Divider,
    Paper,
    Snackbar,
    Stack,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography
} from '@mui/material'
import { useState } from 'react'
import StressTest from './StressTest'
import type { PerformanceMetrics } from './performanceUtils'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [componentCount, setComponentCount] = useState(100)
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleMetricsUpdate = (newMetrics: PerformanceMetrics[]) => {
    setMetrics(newMetrics)
  }

  const exportMetrics = () => {
    const dataStr = JSON.stringify(metrics, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'performance-metrics-mui.json'
    link.click()
    URL.revokeObjectURL(url)
    setSnackbarOpen(true)
  }

  const averageRenderTime = metrics.length > 0 
    ? metrics.reduce((acc, m) => acc + m.renderTime, 0) / metrics.length 
    : 0

  const averageInteractionTime = metrics.length > 0 
    ? metrics.reduce((acc, m) => acc + m.interactionTime, 0) / metrics.length 
    : 0

  const peakMemoryUsage = metrics.length > 0 
    ? Math.max(...metrics.map(m => m.memoryUsage)) 
    : 0

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Styling Library Performance Test
            </Typography>
            <Chip 
              label="Material-UI" 
              color="secondary" 
              variant="filled"
              sx={{ color: 'white', fontWeight: 600 }}
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              Material-UI Performance Testing
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Comprehensive performance testing of Material-UI components with real-time metrics
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <TextField
                label="Component Count"
                type="number"
                value={componentCount}
                onChange={(e) => setComponentCount(Number(e.target.value))}
                inputProps={{ min: 10, max: 10000, step: 10 }}
                size="small"
                sx={{ minWidth: 150 }}
              />
              <Button
                variant="outlined"
                onClick={() => setShowComparison(!showComparison)}
                startIcon={<Assessment />}
              >
                {showComparison ? 'Hide' : 'Show'} Comparison
              </Button>
              <Button
                variant="contained"
                onClick={exportMetrics}
                disabled={metrics.length === 0}
                startIcon={<Download />}
              >
                Export Metrics
              </Button>
            </Stack>
          </Paper>

          <StressTest 
            componentCount={componentCount}
            onMetricsUpdate={handleMetricsUpdate}
          />

          {showComparison && metrics.length > 0 && (
            <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment />
                Performance Comparison
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                  <Card elevation={1}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Timer color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Average Render Time
                        </Typography>
                      </Stack>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {averageRenderTime.toFixed(2)}ms
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                  <Card elevation={1}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Speed color="secondary" />
                        <Typography variant="body2" color="text.secondary">
                          Average Interaction
                        </Typography>
                      </Stack>
                      <Typography variant="h4" fontWeight="bold" color="secondary">
                        {averageInteractionTime.toFixed(2)}ms
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                  <Card elevation={1}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Memory color="warning" />
                        <Typography variant="body2" color="text.secondary">
                          Peak Memory Usage
                        </Typography>
                      </Stack>
                      <Typography variant="h4" fontWeight="bold" color="warning.main">
                        {peakMemoryUsage.toFixed(2)}MB
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                  <Card elevation={1}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <PlayArrow color="info" />
                        <Typography variant="body2" color="text.secondary">
                          Total Tests
                        </Typography>
                      </Stack>
                      <Typography variant="h4" fontWeight="bold" color="info.main">
                        {metrics.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Paper>
          )}
        </Container>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Metrics exported successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}

export default App
