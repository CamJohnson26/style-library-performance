# Styling Library Performance Dashboard

A comprehensive dashboard comparing the performance of 14 different CSS-in-JS and styling frameworks.

## 🚀 Live Demo

The dashboard is deployed to GitHub Pages and available at:
**https://camjohnson26.github.io/style-library-performance/**

## 📊 What's Included

This dashboard compares:

- **Bundle Sizes** - Real bundle size calculations from built projects
- **Performance Metrics** - Render times, interaction performance, memory usage
- **Library Information** - Release years, origins, styling strategies
- **Interactive Testing** - Click on any library to run its performance test

## 🎨 Libraries Tested

1. **Vanilla CSS** (1996) - Pure CSS with custom properties
2. **Material-UI** (2014) - Google's Material Design components
3. **Tailwind CSS** (2017) - Utility-first CSS framework
4. **shadcn/ui** (2022) - Radix UI + Tailwind components
5. **Radix UI** (2020) - Unstyled, accessible primitives
6. **Chakra UI** (2019) - Modular component library
7. **Reshaped** (2023) - Modern React component library
8. **Panda CSS** (2023) - Build-time CSS-in-JS
9. **Base UI** (2022) - Unstyled MUI components
10. **Styled Components** (2016) - Runtime CSS-in-JS
11. **Bootstrap** (2011) - Popular CSS framework
12. **Class Variance Authority** (2021) - Type-safe utilities
13. **Stitches** (2020) - Zero-runtime CSS-in-JS
14. **Vanilla Extract** (2020) - Zero-runtime CSS-in-TypeScript

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/camjohnson26/style-library-performance.git
cd style-library-performance

# Install dependencies for the dashboard
cd all-tests
npm install

# Build all projects and start the dashboard
npm start
```

The dashboard will be available at `http://localhost:8080`

### Individual Project Testing

Each styling library has its own test project that you can run individually:

```bash
# Example: Run Material-UI test
cd test-mui
npm install
npm run dev
```

## 📈 Performance Metrics

Each test measures:

- **Render Time** - Time to render components
- **Interaction Time** - Response time for user interactions
- **Memory Usage** - JavaScript heap consumption
- **Bundle Size** - Actual built file sizes

## 🔧 Technical Details

- **Build System** - Automated build process for all 14 projects
- **Asset Optimization** - Proper base path configuration for subdirectory serving
- **Real Bundle Sizes** - Calculated from actual built files
- **Responsive Design** - Works on desktop and mobile
- **GitHub Pages** - Automated deployment via GitHub Actions

## 📝 Contributing

To add a new styling library:

1. Create a new test project directory (`test-{library-name}`)
2. Add it to the `TEST_PROJECTS` array in `all-tests/build-all.js`
3. Add library information to the `libraryData` array in `all-tests/src/script.js`
4. Run `npm run build` in the all-tests directory
5. Submit a pull request

## 🚀 Deployment

The dashboard is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. Builds all 14 test projects
2. Copies assets with correct base paths
3. Generates bundle size data
4. Deploys to GitHub Pages

## 📄 License

This project is for educational and testing purposes. Use responsibly and consider the specific requirements of your application when choosing a styling approach.
