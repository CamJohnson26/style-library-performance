import { useState } from 'react'
import StressTest from './StressTest'
import type { PerformanceMetrics } from './performanceUtils'

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
    link.download = 'performance-metrics-tailwind.json'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Styling Library Performance Test</h1>
              <p className="text-blue-100">Testing Tailwind CSS Performance</p>
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-sm font-semibold">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tailwind CSS Performance Testing
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Comprehensive performance testing of Tailwind CSS utility classes with real-time metrics
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-3">
              <label htmlFor="componentCount" className="text-sm font-medium text-gray-700">
                Component Count:
              </label>
              <input
                id="componentCount"
                type="number"
                value={componentCount}
                onChange={(e) => setComponentCount(Number(e.target.value))}
                min="10"
                max="10000"
                step="10"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                  showComparison 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {showComparison ? 'Hide' : 'Show'} Comparison
              </button>
              
              <button
                onClick={exportMetrics}
                disabled={metrics.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Metrics
              </button>
            </div>
          </div>
        </div>

        {/* Stress Test Component */}
        <StressTest 
          componentCount={componentCount}
          onMetricsUpdate={handleMetricsUpdate}
        />

        {/* Comparison Panel */}
        {showComparison && metrics.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Performance Comparison
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">Average Render Time</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {averageRenderTime.toFixed(2)}ms
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-purple-700">Average Interaction</span>
                </div>
                <p className="text-3xl font-bold text-purple-900">
                  {averageInteractionTime.toFixed(2)}ms
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-orange-700">Peak Memory Usage</span>
                </div>
                <p className="text-3xl font-bold text-orange-900">
                  {peakMemoryUsage.toFixed(2)}MB
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-green-700">Total Tests</span>
                </div>
                <p className="text-3xl font-bold text-green-900">
                  {metrics.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Snackbar */}
      {snackbarOpen && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Metrics exported successfully!
          <button
            onClick={() => setSnackbarOpen(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default App
