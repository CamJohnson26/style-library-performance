import { Box, Container, Heading, HStack, Input, InputGroup, Text, VStack } from '@chakra-ui/react'
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
    link.download = 'performance-metrics-chakra.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="7xl" py={8}>
        <VStack gap={8} align="stretch">
          <Box
            p={6}
            bgGradient="linear(to-r, blue.600, purple.600)"
            borderRadius="xl"
            color="white"
            shadow="lg"
          >
            <Heading size="2xl" mb={2} color="white">Chakra UI Performance Test</Heading>
            <Text color="blue.100" mb={4} fontSize="lg">
              Test the performance of Chakra UI components with different component counts
            </Text>
            
            <HStack gap={4}>
              <Text fontSize="sm" fontWeight="medium">Component Count:</Text>
              <InputGroup maxW="200px">
                <Input
                  type="number"
                  placeholder="Count"
                  value={componentCount}
                  onChange={(e) => setComponentCount(Number(e.target.value))}
                  min={1}
                  max={5000}
                  bg="white"
                  color="gray.900"
                />
              </InputGroup>
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
            </HStack>
          </Box>

          <StressTest 
            componentCount={componentCount}
            onMetricsUpdate={handleMetricsUpdate}
          />

          {showComparison && metrics.length > 0 && (
            <Box mt={8} p={6} bg="white" borderRadius="xl" borderWidth={1} borderColor="gray.200" shadow="lg">
              <Heading size="md" mb={4} color="gray.800">Performance Comparison</Heading>
              <Box display="grid" gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {(metrics.reduce((acc, m) => acc + m.renderTime, 0) / metrics.length).toFixed(2)}ms
                  </Text>
                  <Text fontSize="sm" color="gray.600">Average Render Time</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {(metrics.reduce((acc, m) => acc + m.interactionTime, 0) / metrics.length).toFixed(2)}ms
                  </Text>
                  <Text fontSize="sm" color="gray.600">Average Interaction Time</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {Math.max(...metrics.map(m => m.memoryUsage)).toFixed(2)}MB
                  </Text>
                  <Text fontSize="sm" color="gray.600">Peak Memory Usage</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {metrics.length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">Total Tests</Text>
                </Box>
              </Box>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default App
