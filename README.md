# Styling Library Performance Test

This project contains nine separate React applications, each using a different styling approach to test and compare their performance characteristics.

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

### 4. test-shadcn (shadcn/ui)

- **Styling**: Radix UI primitives with Tailwind CSS
- **Approach**: Headless components with utility-first styling
- **Bundle Size**: Medium (includes Radix UI and Tailwind)

### 5. test-radix (Radix UI)

- **Styling**: Radix UI primitives with custom CSS
- **Approach**: Unstyled, accessible components
- **Bundle Size**: Medium (includes Radix UI primitives)

### 6. test-chakra (Chakra UI)

- **Styling**: Chakra UI components with Emotion
- **Approach**: Component-based styling with theme system
- **Bundle Size**: Large (includes Chakra UI and Emotion)

### 7. test-reshaped (Reshaped)

- **Styling**: Reshaped design system components
- **Approach**: Modern React component library with theme system
- **Bundle Size**: Medium (includes Reshaped components)

### 8. test-panda-css (Panda CSS)

- **Styling**: Build-time CSS-in-JS with Panda CSS
- **Approach**: Type-safe styling with compile-time generation
- **Bundle Size**: Small (build-time CSS generation)

### 9. test-base-ui (Base UI)

- **Styling**: MUI Base components with custom CSS
- **Approach**: Unstyled, accessible components
- **Bundle Size**: Small (minimal unstyled components)

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

1. Navigate to each project directory and install dependencies:

   ```bash
   # Original projects
   cd test-dom && npm install && cd ..
   cd test-mui && npm install && cd ..
   cd test-tailwind && npm install && cd ..
   cd test-shadcn && npm install && cd ..
   cd test-radix && npm install && cd ..
   cd test-chakra && npm install && cd ..

   # New projects
   cd test-reshaped && npm install && cd ..
   cd test-panda-css && npm install && cd ..
   cd test-base-ui && npm install && cd ..
   ```

### Running the Tests

#### Option 1: Run All Projects Simultaneously (Recommended)

Use the provided script to start all projects at once:

```bash
./run-all.sh
```

This will start all 9 projects on different ports:

- Vanilla CSS: http://localhost:5173
- Material-UI: http://localhost:5174
- Tailwind CSS: http://localhost:5175
- shadcn/ui: http://localhost:5176
- Radix UI: http://localhost:5177
- Chakra UI: http://localhost:5178
- Reshaped: http://localhost:5179
- Panda CSS: http://localhost:5180
- Base UI: http://localhost:5181

To stop all projects:

```bash
./stop-all.sh
```

#### Option 2: Run Individual Projects

Start each application individually in separate terminals:

```bash
# Terminal 1 - Vanilla CSS
cd test-dom && npm run dev

# Terminal 2 - Material-UI
cd test-mui && npm run dev

# Terminal 3 - Tailwind CSS
cd test-tailwind && npm run dev

# Terminal 4 - shadcn/ui
cd test-shadcn && npm run dev

# Terminal 5 - Radix UI
cd test-radix && npm run dev

# Terminal 6 - Chakra UI
cd test-chakra && npm run dev

# Terminal 7 - Reshaped
cd test-reshaped && npm run dev

# Terminal 8 - Panda CSS
cd test-panda-css && npm run dev

# Terminal 9 - Base UI
cd test-base-ui && npm run dev
```

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
