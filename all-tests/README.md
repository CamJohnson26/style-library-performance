# All Tests - Styling Library Performance Dashboard

A comprehensive dashboard that builds and displays all styling library performance tests in one place.

## Features

- 🎨 **Visual Comparison**: Side-by-side comparison of all styling libraries
- 📊 **Bundle Size Analysis**: Real-time bundle size calculations
- 🔍 **Filtering & Sorting**: Filter by type, sort by size, year, or name
- 📱 **Responsive Design**: Works on desktop and mobile
- 🚀 **One-Click Testing**: Direct links to each library's performance test
- 📈 **Library Information**: Detailed info about each library's origins and strategy

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build all projects and start server:**

   ```bash
   npm start
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

## Available Scripts

- `npm run build` - Build all test projects and copy bundles
- `npm run serve` - Start the development server
- `npm run dev` - Alias for serve
- `npm start` - Build all projects and start server

## What It Does

The build process:

1. **Builds all test projects** - Runs `npm run build` in each test directory
2. **Copies bundles** - Copies built files to the dashboard's dist directory
3. **Calculates bundle sizes** - Analyzes JS and CSS file sizes
4. **Generates API** - Creates a bundle sizes API endpoint
5. **Serves everything** - Starts a local server to view the dashboard

## Project Structure

```
all-tests/
├── src/
│   ├── index.html      # Main dashboard page
│   ├── styles.css      # Dashboard styles
│   └── script.js       # Dashboard functionality
├── dist/               # Built files (generated)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── api/
│   │   └── bundle-sizes # Bundle size data
│   └── test-*/         # Individual test projects
├── build-all.js        # Build script
├── server.js           # Development server
└── package.json
```

## Libraries Included

The dashboard includes all 14 styling libraries:

- **Vanilla CSS** - Pure CSS with custom properties
- **Material-UI** - Google's Material Design components
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Radix UI + Tailwind components
- **Radix UI** - Unstyled, accessible primitives
- **Chakra UI** - Modular component library
- **Reshaped** - Modern React component library
- **Panda CSS** - Build-time CSS-in-JS
- **Base UI** - Unstyled MUI components
- **Styled Components** - Runtime CSS-in-JS
- **Bootstrap** - Popular CSS framework
- **Class Variance Authority** - Type-safe class utilities
- **Stitches** - Zero-runtime CSS-in-JS
- **Vanilla Extract** - Zero-runtime CSS-in-TypeScript

## Customization

### Adding New Libraries

1. Create a new test project in the parent directory
2. Add it to the `TEST_PROJECTS` array in `build-all.js`
3. Add library information to the `libraryData` array in `script.js`
4. Run `npm run build` to include it in the dashboard

### Modifying the Dashboard

- **Styles**: Edit `src/styles.css`
- **Functionality**: Edit `src/script.js`
- **Layout**: Edit `src/index.html`

## Troubleshooting

### Build Failures

If a project fails to build:

1. Check that the project directory exists
2. Ensure `package.json` is present
3. Try running `npm install` in the failing project directory
4. Check for TypeScript or build errors

### Missing Bundle Sizes

If bundle sizes show as 0:

1. Ensure projects built successfully
2. Check that `dist` directories were created
3. Verify the build script found JS/CSS files

### Server Issues

If the server won't start:

1. Check that port 8080 is available
2. Ensure the `dist` directory exists
3. Try running `npm run build` first

## Performance Notes

- The build process can take several minutes for all projects
- Bundle sizes are calculated from built files
- The dashboard loads library information from the JavaScript file
- All test projects run independently on their own ports

## Contributing

To improve the dashboard:

1. Fork the repository
2. Make your changes
3. Test with `npm start`
4. Submit a pull request

## License

This project is for educational and testing purposes.
