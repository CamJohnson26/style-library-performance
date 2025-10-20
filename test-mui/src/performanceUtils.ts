export interface PerformanceMetrics {
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  componentCount: number;
  timestamp: number;
}

export interface StressTestConfig {
  componentCount: number;
  interactionDelay: number;
  testDuration: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private renderStartTime: number = 0;
  private interactionStartTime: number = 0;

  startRenderTimer(): void {
    this.renderStartTime = performance.now();
  }

  endRenderTimer(componentCount: number): void {
    const renderTime = performance.now() - this.renderStartTime;
    const memoryUsage = this.getMemoryUsage();
    
    this.metrics.push({
      renderTime,
      interactionTime: 0,
      memoryUsage,
      componentCount,
      timestamp: Date.now()
    });
  }

  startInteractionTimer(): void {
    this.interactionStartTime = performance.now();
  }

  endInteractionTimer(): number {
    const interactionTime = performance.now() - this.interactionStartTime;
    
    // Update the latest metric with interaction time
    if (this.metrics.length > 0) {
      this.metrics[this.metrics.length - 1].interactionTime = interactionTime;
    }
    
    return interactionTime;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) {
      return {};
    }

    const total = this.metrics.reduce((acc, metric) => ({
      renderTime: acc.renderTime + metric.renderTime,
      interactionTime: acc.interactionTime + metric.interactionTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      componentCount: acc.componentCount + metric.componentCount
    }), { renderTime: 0, interactionTime: 0, memoryUsage: 0, componentCount: 0 });

    return {
      renderTime: total.renderTime / this.metrics.length,
      interactionTime: total.interactionTime / this.metrics.length,
      memoryUsage: total.memoryUsage / this.metrics.length,
      componentCount: total.componentCount / this.metrics.length
    };
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Utility function to measure component render time
export const measureRenderTime = async <T>(
  renderFunction: () => T,
  componentCount: number
): Promise<T> => {
  performanceMonitor.startRenderTimer();
  const result = renderFunction();
  
  // Use requestAnimationFrame to ensure DOM updates are complete
  await new Promise(resolve => requestAnimationFrame(resolve));
  performanceMonitor.endRenderTimer(componentCount);
  
  return result;
};

// Utility function to measure interaction time
export const measureInteraction = async <T>(
  interactionFunction: () => T | Promise<T>
): Promise<T> => {
  performanceMonitor.startInteractionTimer();
  const result = await interactionFunction();
  performanceMonitor.endInteractionTimer();
  return result;
};
