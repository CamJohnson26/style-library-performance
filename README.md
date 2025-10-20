# Styling Library Performance Test

This project contains three separate React applications, each using a different styling approach to test and compare their performance characteristics.

## Projects Overview

### 1. test-dom (Vanilla CSS)

- **Styling**: Pure CSS with custom classes
- **Approach**: Traditional CSS with custom properties and utility classes
- **Bundle Size**: Minimal (no external styling dependencies)

### 2. test-mui (Material-UI)

- **Styling**: Material-UI components with Emotion
- **Approach**: Component-based styling with theme system
- **Bundle Size**: Larger (includes MUI components and Emotion)

### 3. test-tailwind (Tailwind CSS)

- **Styling**: Tailwind CSS utility classes
- **Approach**: Utility-first CSS framework
- **Bundle Size**: Medium (includes Tailwind CSS)

## Performance Metrics

Each application measures the following performance indicators:

- **Render Time**: Time taken to render a specified number of components
- **Interaction Time**: Time taken to respond to user interactions (clicks, toggles)
- **Memory Usage**: JavaScript heap memory consumption
- **Component Count**: Number of components rendered

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

### Installation

1. Navigate to each project directory:

   ```bash
   cd test-dom
   npm install

   cd ../test-mui
   npm install

   cd ../test-tailwind
   npm install
   ```

### Running the Tests

Start each application in development mode:

```bash
# Terminal 1 - Vanilla CSS
cd test-dom
npm run dev

# Terminal 2 - Material-UI
cd test-mui
npm run dev

# Terminal 3 - Tailwind CSS
cd test-tailwind
npm run dev
```

Each application will be available at:

- test-dom: http://localhost:5173
- test-mui: http://localhost:5173
- test-tailwind: http://localhost:5173

## How to Use

1. **Set Component Count**: Use the input field to specify how many components to render (10-10,000)
2. **Run Stress Test**: Click "Render X Items" to generate and render the specified number of components
3. **Interact with Components**: Click on individual items to test interaction performance
4. **Bulk Operations**: Use "Toggle All Items" to test bulk state updates
5. **View Metrics**: Toggle the comparison panel to see performance statistics
6. **Export Data**: Export metrics as JSON for further analysis

## Testing Scenarios

### Basic Rendering Test

- Render 100, 500, 1000, 2000, 5000 components
- Measure initial render time
- Compare memory usage

### Interaction Performance Test

- Click individual components
- Toggle all components at once
- Measure response times

### Memory Stress Test

- Gradually increase component count
- Monitor memory usage patterns
- Test garbage collection behavior

## Expected Results

Based on typical performance characteristics:

### Vanilla CSS (test-dom)

- **Fastest render times** (minimal overhead)
- **Lowest memory usage** (no framework overhead)
- **Fastest interactions** (direct DOM manipulation)

### Material-UI (test-mui)

- **Slower initial render** (component overhead)
- **Higher memory usage** (component instances + Emotion)
- **Consistent interaction times** (optimized components)

### Tailwind CSS (test-tailwind)

- **Medium render times** (utility class processing)
- **Medium memory usage** (CSS-in-JS overhead)
- **Fast interactions** (utility classes are efficient)

## Performance Analysis

### Key Metrics to Compare

1. **Render Time per Component**

   - Calculate: `total_render_time / component_count`
   - Lower is better

2. **Memory per Component**

   - Calculate: `peak_memory / component_count`
   - Lower is better

3. **Interaction Response Time**

   - Average time for single component interactions
   - Lower is better

4. **Bundle Size Impact**
   - Check browser dev tools for bundle sizes
   - Consider trade-offs between features and size

### Benchmarking Recommendations

1. **Test on Different Devices**

   - Desktop (high-end)
   - Mobile (mid-range)
   - Low-end devices

2. **Test Different Scenarios**

   - Small datasets (100-500 components)
   - Medium datasets (1000-2000 components)
   - Large datasets (5000+ components)

3. **Run Multiple Tests**
   - Perform 5-10 tests per scenario
   - Calculate averages and standard deviations
   - Look for performance degradation patterns

## Data Export

Each application can export performance metrics as JSON files:

- `performance-metrics-dom.json`
- `performance-metrics-mui.json`
- `performance-metrics-tailwind.json`

Use these files for:

- Detailed analysis
- Creating performance reports
- Comparing results across different runs
- Building performance dashboards

## Troubleshooting

### Common Issues

1. **Memory Issues with Large Component Counts**

   - Reduce component count
   - Check browser memory limits
   - Monitor for memory leaks

2. **Slow Rendering**

   - Check browser performance tab
   - Look for blocking operations
   - Consider component optimization

3. **Inconsistent Results**
   - Close other browser tabs
   - Disable browser extensions
   - Run tests in incognito mode

## Contributing

To add new styling libraries or improve the testing framework:

1. Create a new project directory
2. Copy the performance utilities
3. Implement the stress test component
4. Follow the same interface patterns
5. Update this README

## License

This project is for educational and testing purposes. Use responsibly and consider the specific requirements of your application when choosing a styling approach.
