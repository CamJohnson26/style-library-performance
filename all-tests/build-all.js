#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// Configuration
const PROJECTS_DIR = path.join(__dirname, '..');
const ALL_TESTS_DIR = __dirname;
const DIST_DIR = path.join(ALL_TESTS_DIR, 'dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

// List of all test projects
const TEST_PROJECTS = [
    'test-dom',
    'test-mui', 
    'test-tailwind',
    'test-shadcn',
    'test-radix',
    'test-chakra',
    'test-reshaped',
    'test-panda-css',
    'test-base-ui',
    'test-styled-components',
    'test-bootstrap',
    'test-cva',
    'test-stitches',
    'test-vanilla-extract'
];

// Bundle size data
const bundleSizes = {};

console.log('🚀 Starting build process for all styling library tests...\n');

async function buildAllProjects() {
    // Create dist directory
    await fs.ensureDir(DIST_DIR);
    await fs.ensureDir(ASSETS_DIR);

    // Copy main HTML, CSS, and JS files
    await copyMainFiles();

    // Build each project
    for (const project of TEST_PROJECTS) {
        await buildProject(project);
    }

    // Generate bundle sizes API
    await generateBundleSizesAPI();

    console.log('\n✅ Build completed successfully!');
    console.log(`📁 Output directory: ${DIST_DIR}`);
    console.log(`🌐 Serve with: cd ${DIST_DIR} && python3 -m http.server 8080`);
}

async function copyMainFiles() {
    console.log('📋 Copying main files...');
    
    const filesToCopy = [
        { src: 'src/index.html', dest: 'index.html' },
        { src: 'src/styles.css', dest: 'styles.css' },
        { src: 'src/script.js', dest: 'script.js' }
    ];

    for (const file of filesToCopy) {
        const srcPath = path.join(ALL_TESTS_DIR, file.src);
        const destPath = path.join(DIST_DIR, file.dest);
        
        if (await fs.pathExists(srcPath)) {
            await fs.copy(srcPath, destPath);
            console.log(`  ✓ Copied ${file.src} → ${file.dest}`);
        } else {
            console.log(`  ⚠️  File not found: ${file.src}`);
        }
    }
}

async function buildProject(projectName) {
    const projectDir = path.join(PROJECTS_DIR, projectName);
    
    if (!await fs.pathExists(projectDir)) {
        console.log(`  ⚠️  Project directory not found: ${projectName}`);
        return;
    }

    console.log(`\n🔨 Building ${projectName}...`);

    try {
        // Check if package.json exists
        const packageJsonPath = path.join(projectDir, 'package.json');
        if (!await fs.pathExists(packageJsonPath)) {
            console.log(`  ⚠️  No package.json found in ${projectName}`);
            return;
        }

        // Install dependencies if node_modules doesn't exist
        const nodeModulesPath = path.join(projectDir, 'node_modules');
        if (!await fs.pathExists(nodeModulesPath)) {
            console.log(`  📦 Installing dependencies for ${projectName}...`);
            execSync('npm install', { 
                cwd: projectDir, 
                stdio: 'pipe',
                timeout: 120000 // 2 minutes timeout
            });
        }

        // Build the project with relative base path for GitHub Pages
        console.log(`  🏗️  Building ${projectName}...`);
        
        // Temporarily modify vite config to use relative base path
        const viteConfigPath = path.join(projectDir, 'vite.config.ts');
        const originalConfig = await fs.readFile(viteConfigPath, 'utf8');
        const modifiedConfig = originalConfig.replace(
            /export default defineConfig\({/,
            `export default defineConfig({
  base: './',`
        );
        await fs.writeFile(viteConfigPath, modifiedConfig);
        
        try {
            execSync(`npm run build`, { 
                cwd: projectDir, 
                stdio: 'pipe',
                timeout: 300000 // 5 minutes timeout
            });
        } finally {
            // Restore original config
            await fs.writeFile(viteConfigPath, originalConfig);
        }

        // Copy built files to dist
        await copyProjectFiles(projectName, projectDir);

        console.log(`  ✅ ${projectName} built successfully`);

    } catch (error) {
        console.log(`  ❌ Failed to build ${projectName}: ${error.message}`);
    }
}

async function copyProjectFiles(projectName, projectDir) {
    const projectDistDir = path.join(projectDir, 'dist');
    const targetDir = path.join(DIST_DIR, projectName);

    if (!await fs.pathExists(projectDistDir)) {
        console.log(`  ⚠️  No dist directory found for ${projectName}`);
        return;
    }

    // Copy the entire dist directory
    await fs.copy(projectDistDir, targetDir);
    console.log(`  📁 Copied ${projectName} files to /${projectName}/`);

    // Calculate bundle size
    await calculateBundleSize(projectName, targetDir);
}

async function calculateBundleSize(projectName, projectDir) {
    try {
        // Look for main JS and CSS files
        const jsFiles = glob.sync('**/*.js', { cwd: projectDir });
        const cssFiles = glob.sync('**/*.css', { cwd: projectDir });
        
        let totalSize = 0;
        
        // Calculate JS bundle size
        for (const jsFile of jsFiles) {
            const filePath = path.join(projectDir, jsFile);
            const stats = await fs.stat(filePath);
            totalSize += stats.size;
        }
        
        // Calculate CSS bundle size
        for (const cssFile of cssFiles) {
            const filePath = path.join(projectDir, cssFile);
            const stats = await fs.stat(filePath);
            totalSize += stats.size;
        }

        // Convert to KB
        const sizeKB = Math.round(totalSize / 1024);
        bundleSizes[projectName.replace('test-', '')] = sizeKB;
        
        console.log(`  📊 Bundle size: ${sizeKB} KB`);

    } catch (error) {
        console.log(`  ⚠️  Could not calculate bundle size for ${projectName}: ${error.message}`);
        bundleSizes[projectName.replace('test-', '')] = 0;
    }
}

async function generateBundleSizesAPI() {
    console.log('\n📊 Generating bundle sizes API...');
    
    const apiDir = path.join(DIST_DIR, 'api');
    await fs.ensureDir(apiDir);
    
    const bundleSizesJson = JSON.stringify(bundleSizes, null, 2);
    await fs.writeFile(path.join(apiDir, 'bundle-sizes'), bundleSizesJson);
    
    // Also create a JSON file for GitHub Pages
    await fs.writeFile(path.join(apiDir, 'bundle-sizes.json'), bundleSizesJson);
    
    console.log('  ✅ Bundle sizes API generated');
    console.log(`  📊 Total projects: ${Object.keys(bundleSizes).length}`);
    console.log(`  📦 Total bundle size: ${Object.values(bundleSizes).reduce((a, b) => a + b, 0)} KB`);
}

// Error handling
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});

// Run the build
buildAllProjects().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
});
