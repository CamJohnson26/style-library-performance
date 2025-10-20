import { useState } from 'react'
import './App.css'
import StressTest from './StressTest'
import type { PerformanceMetrics } from './performanceUtils'

function App() {
  const [componentCount, setComponentCount] = useState(100)
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const handleMetricsUpdate = (newMetrics: PerformanceMetrics[]) => {
    setMetrics(newMetrics)
  }

  const exportMetrics = () => {
    const dataStr = JSON.stringify(metrics, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'performance-metrics-base-ui.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Styling Library Performance Test</h1>
        <p>Testing Base UI Performance</p>
      </header>

      <div className="app-controls">
        <div className="control-group">
          <label htmlFor="componentCount">Component Count:</label>
          <input
            id="componentCount"
            type="number"
            value={componentCount}
            onChange={(e) => setComponentCount(Number(e.target.value))}
            min="10"
            max="10000"
            step="10"
          />
        </div>
        <div className="control-group">
          <button onClick={() => setShowComparison(!showComparison)}>
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>
          <button onClick={exportMetrics} disabled={metrics.length === 0}>
            Export Metrics
          </button>
        </div>
      </div>

      <StressTest 
        componentCount={componentCount}
        onMetricsUpdate={handleMetricsUpdate}
      />

      {showComparison && metrics.length > 0 && (
        <div className="comparison-panel">
          <h3>Performance Comparison</h3>
          <div className="comparison-stats">
            <div className="stat">
              <span className="stat-label">Average Render Time:</span>
              <span className="stat-value">
                {(metrics.reduce((acc, m) => acc + m.renderTime, 0) / metrics.length).toFixed(2)}ms
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Average Interaction Time:</span>
              <span className="stat-value">
                {(metrics.reduce((acc, m) => acc + m.interactionTime, 0) / metrics.length).toFixed(2)}ms
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Peak Memory Usage:</span>
              <span className="stat-value">
                {Math.max(...metrics.map(m => m.memoryUsage)).toFixed(2)}MB
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Total Tests:</span>
              <span className="stat-value">{metrics.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App