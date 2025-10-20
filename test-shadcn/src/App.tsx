import { useState } from 'react'
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
    link.download = 'performance-metrics-shadcn.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">shadcn/ui Performance Test</h1>
          <p className="text-blue-100 mb-4">
            Test the performance of shadcn/ui components with different component counts
          </p>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="componentCount" className="text-sm font-medium">
              Component Count:
            </label>
            <input
              id="componentCount"
              type="number"
              value={componentCount}
              onChange={(e) => setComponentCount(Number(e.target.value))}
              className="px-3 py-2 border border-blue-300 rounded-md bg-white text-gray-900 w-32"
              min="1"
              max="5000"
            />
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
            >
              {showComparison ? 'Hide' : 'Show'} Comparison
            </button>
            <button
              onClick={exportMetrics}
              disabled={metrics.length === 0}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-sm font-medium transition-colors"
            >
              Export Metrics
            </button>
          </div>
        </div>

        <StressTest 
          componentCount={componentCount}
          onMetricsUpdate={handleMetricsUpdate}
        />

        {showComparison && metrics.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Comparison</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(metrics.reduce((acc, m) => acc + m.renderTime, 0) / metrics.length).toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">Average Render Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(metrics.reduce((acc, m) => acc + m.interactionTime, 0) / metrics.length).toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-600">Average Interaction Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(...metrics.map(m => m.memoryUsage)).toFixed(2)}MB
                </div>
                <div className="text-sm text-gray-600">Peak Memory Usage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.length}
                </div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
