import { useState } from 'react'
import StressTest from './StressTest'
import type { PerformanceMetrics } from './performanceUtils'

function App() {
  const [componentCount, setComponentCount] = useState(100)
  const [, setMetrics] = useState<PerformanceMetrics[]>([])

  const handleMetricsUpdate = (newMetrics: PerformanceMetrics[]) => {
    setMetrics(newMetrics)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Radix UI Performance Test</h1>
          <p className="text-blue-100 mb-4">
            Test the performance of Radix UI components with different component counts
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
          </div>
        </div>

        <StressTest 
          componentCount={componentCount}
          onMetricsUpdate={handleMetricsUpdate}
        />
      </div>
    </div>
  )
}

export default App
