import { Box, Container, Heading, HStack, Input, InputGroup, Text, VStack } from '@chakra-ui/react'
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
            </HStack>
          </Box>

          <StressTest 
            componentCount={componentCount}
            onMetricsUpdate={handleMetricsUpdate}
          />
        </VStack>
      </Container>
    </Box>
  )
}

export default App
