import { useState } from 'react';
import StressTest from './StressTest';
import type { PerformanceMetrics } from './performanceUtils';

function App() {
  const [componentCount, setComponentCount] = useState(100);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  const handleMetricsUpdate = (newMetrics: PerformanceMetrics[]) => {
    setMetrics(newMetrics);
  };

  const exportMetrics = () => {
    if (metrics.length === 0) {
      alert('No metrics to export. Run a test first.');
      return;
    }

    const dataStr = JSON.stringify(metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vanilla-extract-performance-metrics-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '2rem', 
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>
          Vanilla Extract Performance Test
        </h1>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
          Testing Vanilla Extract CSS-in-JS performance with stress testing
        </p>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
            Test Configuration
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>Component Count:</span>
              <input
                type="number"
                value={componentCount}
                onChange={(e) => setComponentCount(Number(e.target.value))}
                min="1"
                max="50000"
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  fontSize: '1rem',
                  width: '120px'
                }}
              />
            </label>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Current: {metrics.length > 0 ? metrics[metrics.length - 1]?.componentCount : 0} components
            </div>
            <button
              onClick={exportMetrics}
              disabled={metrics.length === 0}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: metrics.length === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: metrics.length === 0 ? 'not-allowed' : 'pointer',
                opacity: metrics.length === 0 ? 0.6 : 1
              }}
            >
              Export Metrics
            </button>
          </div>
        </div>
      </div>

      <StressTest 
        componentCount={componentCount} 
        onMetricsUpdate={handleMetricsUpdate} 
      />
    </div>
  );
}

export default App;
