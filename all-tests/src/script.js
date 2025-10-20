// Library data with comprehensive information
const libraryData = [
    {
        id: 'dom',
        name: 'Vanilla CSS',
        year: '1996',
        type: 'vanilla',
        description: 'Pure CSS with custom classes and CSS custom properties. The foundation of web styling with minimal overhead.',
        origins: 'W3C CSS Working Group',
        strategy: 'Traditional CSS with utility classes and custom properties',
        website: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #64748b, #94a3b8)'
    },
    {
        id: 'mui',
        name: 'Material-UI',
        year: '2014',
        type: 'component',
        description: 'React components implementing Google\'s Material Design with Emotion CSS-in-JS engine.',
        origins: 'Google Material Design, maintained by MUI team',
        strategy: 'Component-based styling with theme system and CSS-in-JS',
        website: 'https://mui.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #1976d2, #42a5f5)'
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        year: '2017',
        type: 'utility',
        description: 'Utility-first CSS framework that provides low-level utility classes to build custom designs.',
        origins: 'Adam Wathan, Tailwind Labs',
        strategy: 'Utility-first approach with purging and JIT compilation',
        website: 'https://tailwindcss.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
    },
    {
        id: 'shadcn',
        name: 'shadcn/ui',
        year: '2022',
        type: 'component',
        description: 'Beautifully designed components built with Radix UI and Tailwind CSS. Copy-paste, not npm.',
        origins: 'Vercel, inspired by Radix UI and Tailwind',
        strategy: 'Headless components with utility-first styling',
        website: 'https://ui.shadcn.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #000000, #404040)'
    },
    {
        id: 'radix',
        name: 'Radix UI',
        year: '2020',
        type: 'component',
        description: 'Low-level UI primitives for building accessible design systems and web applications.',
        origins: 'Modulz (now WorkOS)',
        strategy: 'Unstyled, accessible components with composition patterns',
        website: 'https://www.radix-ui.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #161618, #2d2d30)'
    },
    {
        id: 'chakra',
        name: 'Chakra UI',
        year: '2019',
        type: 'component',
        description: 'Simple, modular and accessible component library that gives you the building blocks you need.',
        origins: 'Segun Adebayo, Chakra UI team',
        strategy: 'Component-based styling with Emotion and theme system',
        website: 'https://chakra-ui.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #319795, #4fd1c7)'
    },
    {
        id: 'reshaped',
        name: 'Reshaped',
        year: '2023',
        type: 'component',
        description: 'Modern React component library with a comprehensive design system and excellent TypeScript support.',
        origins: 'Reshaped team',
        strategy: 'Modern component library with design tokens and theming',
        website: 'https://reshaped.so',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    },
    {
        id: 'panda-css',
        name: 'Panda CSS',
        year: '2023',
        type: 'css-in-js',
        description: 'Build-time CSS-in-JS with excellent TypeScript support and zero runtime overhead.',
        origins: 'Chakra UI team (Segun Adebayo)',
        strategy: 'Build-time CSS generation with type-safe styling',
        website: 'https://panda-css.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
    },
    {
        id: 'base-ui',
        name: 'Base UI',
        year: '2022',
        type: 'component',
        description: 'Unstyled, accessible React components and hooks with your own design system.',
        origins: 'MUI team (Material-UI)',
        strategy: 'Unstyled, accessible components with composition',
        website: 'https://base-ui.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #1976d2, #42a5f5)'
    },
    {
        id: 'styled-components',
        name: 'Styled Components',
        year: '2016',
        type: 'css-in-js',
        description: 'Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps.',
        origins: 'Glen Maddern, Max Stoiber',
        strategy: 'Runtime CSS-in-JS with template literals and styled components',
        website: 'https://styled-components.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #db2777, #ec4899)'
    },
    {
        id: 'bootstrap',
        name: 'Bootstrap',
        year: '2011',
        type: 'utility',
        description: 'The world\'s most popular front-end open source toolkit, featuring Sass variables and mixins.',
        origins: 'Twitter (now Bootstrap team)',
        strategy: 'Utility-first CSS framework with component library',
        website: 'https://getbootstrap.com',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #7952b3, #6f42c1)'
    },
    {
        id: 'cva',
        name: 'Class Variance Authority',
        year: '2021',
        type: 'utility',
        description: 'A tiny utility for constructing className strings with variant support and TypeScript.',
        origins: 'Joe Bell, inspired by Stitches',
        strategy: 'Type-safe utility for conditional class names and variants',
        website: 'https://cva.style',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    {
        id: 'stitches',
        name: 'Stitches',
        year: '2020',
        type: 'css-in-js',
        description: 'CSS-in-JS with near-zero runtime, SSR, multi-variant support, and a best-in-class developer experience.',
        origins: 'Modulz (now WorkOS)',
        strategy: 'Zero-runtime CSS-in-JS with variant support and SSR',
        website: 'https://stitches.dev',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #7c3aed, #8b5cf6)'
    },
    {
        id: 'vanilla-extract',
        name: 'Vanilla Extract',
        year: '2020',
        type: 'css-in-js',
        description: 'Zero-runtime Stylesheets-in-TypeScript. Use TypeScript as your preprocessor.',
        origins: 'SEEK team (Mark Dalgleish)',
        strategy: 'Zero-runtime CSS-in-TypeScript with type safety',
        website: 'https://vanilla-extract.style',
        bundleSize: 0,
        gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)'
    }
];

// DOM elements
const librariesGrid = document.getElementById('libraries-grid');
const totalLibrariesEl = document.getElementById('total-libraries');
const totalBundleSizeEl = document.getElementById('total-bundle-size');
const avgBundleSizeEl = document.getElementById('avg-bundle-size');
const sortBySelect = document.getElementById('sort-by');
const filterTypeSelect = document.getElementById('filter-type');

// State
let currentLibraries = [...libraryData];
let bundleSizes = {};

// Initialize the application
async function init() {
    showLoading();
    await loadBundleSizes();
    updateStats();
    renderLibraries();
    setupEventListeners();
}

// Show loading state
function showLoading() {
    librariesGrid.innerHTML = '<div class="loading">Loading libraries...</div>';
}

// Load bundle sizes from built projects
async function loadBundleSizes() {
    try {
        const response = await fetch('/api/bundle-sizes.json');
        if (response.ok) {
            bundleSizes = await response.json();
            // Update library data with bundle sizes
            libraryData.forEach(lib => {
                lib.bundleSize = bundleSizes[lib.id] || 0;
            });
        }
    } catch (error) {
        console.warn('Could not load bundle sizes:', error);
        // Use estimated sizes as fallback
        const estimatedSizes = {
            'dom': 0,
            'mui': 450,
            'tailwind': 25,
            'shadcn': 180,
            'radix': 120,
            'chakra': 380,
            'reshaped': 200,
            'panda-css': 15,
            'base-ui': 80,
            'styled-components': 45,
            'bootstrap': 200,
            'cva': 8,
            'stitches': 12,
            'vanilla-extract': 5
        };
        
        libraryData.forEach(lib => {
            lib.bundleSize = estimatedSizes[lib.id] || 0;
        });
    }
}

// Update statistics
function updateStats() {
    const totalLibraries = currentLibraries.length;
    const totalBundleSize = currentLibraries.reduce((sum, lib) => sum + lib.bundleSize, 0);
    const avgBundleSize = totalLibraries > 0 ? Math.round(totalBundleSize / totalLibraries) : 0;

    totalLibrariesEl.textContent = totalLibraries;
    totalBundleSizeEl.textContent = formatBytes(totalBundleSize * 1024);
    avgBundleSizeEl.textContent = formatBytes(avgBundleSize * 1024);
}

// Format bytes to human readable format
function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Render libraries
function renderLibraries() {
    if (currentLibraries.length === 0) {
        librariesGrid.innerHTML = '<div class="loading">No libraries found matching your criteria.</div>';
        return;
    }

    librariesGrid.innerHTML = currentLibraries.map(lib => `
        <div class="library-card" data-library="${lib.id}">
            <div class="library-header">
                <div>
                    <div class="library-name">${lib.name}</div>
                </div>
                <div class="library-year">${lib.year}</div>
            </div>
            
            <div class="library-type ${lib.type}">${lib.type.replace('-', ' ')}</div>
            
            <div class="library-description">${lib.description}</div>
            
            <div class="library-metrics">
                <div class="metric">
                    <span class="metric-value">${formatBytes(lib.bundleSize * 1024)}</span>
                    <span class="metric-label">Bundle Size</span>
                </div>
                <div class="metric">
                    <span class="metric-value">${lib.year}</span>
                    <span class="metric-label">Released</span>
                </div>
            </div>
            
            <div class="library-actions">
                <a href="/test-${lib.id}/" class="btn btn-primary" target="_blank">
                    🚀 Test Performance
                </a>
                <a href="${lib.website}" class="btn btn-secondary btn-icon" target="_blank" title="Visit Website">
                    🌐
                </a>
            </div>
        </div>
    `).join('');

    // Add click handlers for library cards
    document.querySelectorAll('.library-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                const libraryId = card.dataset.library;
                window.open(`/test-${libraryId}/`, '_blank');
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    sortBySelect.addEventListener('change', handleSort);
    filterTypeSelect.addEventListener('change', handleFilter);
}

// Handle sorting
function handleSort() {
    const sortBy = sortBySelect.value;
    
    currentLibraries.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'bundle-size':
                return a.bundleSize - b.bundleSize;
            case 'year':
                return parseInt(b.year) - parseInt(a.year);
            case 'type':
                return a.type.localeCompare(b.type);
            default:
                return 0;
        }
    });
    
    renderLibraries();
}

// Handle filtering
function handleFilter() {
    const filterType = filterTypeSelect.value;
    
    if (filterType === 'all') {
        currentLibraries = [...libraryData];
    } else {
        currentLibraries = libraryData.filter(lib => lib.type === filterType);
    }
    
    updateStats();
    renderLibraries();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
