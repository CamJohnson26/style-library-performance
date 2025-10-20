import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react';
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
}

const StressTest: React.FC<StressTestProps> = ({ componentCount, onMetricsUpdate }) => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  // Generate test items
  const generateItems = useCallback(() => {
    const newItems: TestItem[] = [];
    for (let i = 0; i < componentCount; i++) {
      newItems.push({
        id: i,
        title: `Item ${i + 1}`,
        description: `This is a test item with ID ${i + 1} for performance testing`,
        isActive: Math.random() > 0.5,
        value: Math.floor(Math.random() * 100)
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

  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading size="lg" mb={4} color="gray.800">Performance Stress Test (Chakra UI)</Heading>
        <HStack gap={4}>
          <Button 
            colorScheme="blue"
            onClick={renderStressTest}
            isLoading={isRendering}
            size="lg"
            bg="blue.600"
            _hover={{ bg: "blue.700" }}
          >
            {isRendering ? 'Rendering...' : `Render ${componentCount} Items`}
          </Button>
          <Button 
            variant="outline"
            onClick={handleBulkToggle}
            disabled={items.length === 0}
            size="lg"
            borderColor="blue.600"
            color="blue.600"
            _hover={{ bg: "blue.50" }}
          >
            Toggle All Items
          </Button>
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={4}>
        {items.map(item => (
          <Box 
            key={item.id}
            bg="white"
            borderColor={item.isActive ? "blue.500" : "gray.200"}
            borderWidth={item.isActive ? 2 : 1}
            borderStyle="solid"
            borderRadius="md"
            p={4}
            cursor="pointer"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            onClick={() => handleItemClick(item.id)}
          >
            <Flex justify="space-between" align="start" mb={2}>
              <Heading size="md" color="gray.800">{item.title}</Heading>
              <Badge colorScheme="blue" fontSize="lg" p={2} bg="blue.600" color="white">
                {item.value}
              </Badge>
            </Flex>
            <Text color="gray.600" mb={4} fontSize="sm">
              {item.description}
            </Text>
            <Button 
              variant="outline" 
              size="sm" 
              width="full"
              borderColor="blue.600"
              color="blue.600"
              _hover={{ bg: "blue.50" }}
            >
              Action {item.id + 1}
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      {metrics.length > 0 && (
        <Box mt={8} bg="white" p={6} borderRadius="md" borderWidth={1} borderColor="gray.200">
          <Heading size="md" mb={4} color="gray.800">Performance Metrics</Heading>
          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {metrics[metrics.length - 1]?.renderTime.toFixed(2)}ms
              </Text>
              <Text fontSize="sm" color="gray.600">Render Time</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {metrics[metrics.length - 1]?.interactionTime.toFixed(2)}ms
              </Text>
              <Text fontSize="sm" color="gray.600">Last Interaction</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {metrics[metrics.length - 1]?.memoryUsage.toFixed(2)}MB
              </Text>
              <Text fontSize="sm" color="gray.600">Memory Usage</Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {metrics[metrics.length - 1]?.componentCount}
              </Text>
              <Text fontSize="sm" color="gray.600">Component Count</Text>
            </Box>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

export default StressTest;
