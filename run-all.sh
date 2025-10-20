#!/bin/bash

# Styling Library Performance Test Runner
# This script starts all three test applications simultaneously

echo "🚀 Starting Styling Library Performance Tests..."
echo ""

# Function to start a project
start_project() {
    local project_name=$1
    local project_dir=$2
    local port=$3
    
    echo "📦 Starting $project_name on port $port..."
    cd "$project_dir" || exit 1
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "   Installing dependencies for $project_name..."
        npm install
    fi
    
    # Start the project in background
    npm run dev -- --port $port > "../logs/${project_name}.log" 2>&1 &
    local pid=$!
    echo "   $project_name started with PID: $pid"
    echo "$pid" > "../logs/${project_name}.pid"
    
    cd ..
}

# Create logs directory
mkdir -p logs

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "vite" 2>/dev/null || true
sleep 1

# Start all projects
start_project "test-dom" "test-dom" "5173"
start_project "test-mui" "test-mui" "5174"
start_project "test-tailwind" "test-tailwind" "5175"
start_project "test-shadcn" "test-shadcn" "5176"
start_project "test-radix" "test-radix" "5177"
start_project "test-chakra" "test-chakra" "5178"

echo ""
echo "⏳ Waiting for servers to start..."
sleep 3

# Verify servers are running
echo "🔍 Verifying servers..."
for port in 5173 5174 5175 5176 5177 5178; do
    if curl -s "http://localhost:$port" > /dev/null 2>&1; then
        echo "   ✅ Port $port: Server running"
    else
        echo "   ❌ Port $port: Server not responding"
    fi
done

echo ""
echo "✅ All projects started successfully!"
echo ""
echo "🌐 Applications are available at:"
echo "   • Vanilla CSS:    http://localhost:5173"
echo "   • Material-UI:    http://localhost:5174"
echo "   • Tailwind CSS:   http://localhost:5175"
echo "   • shadcn/ui:      http://localhost:5176"
echo "   • Radix UI:       http://localhost:5177"
echo "   • Chakra UI:      http://localhost:5178"
echo ""
echo "📊 Performance Testing Instructions:"
echo "   1. Open each application in separate browser tabs"
echo "   2. Set component count (start with 100, then try 500, 1000, 2000)"
echo "   3. Click 'Render X Items' to start the stress test"
echo "   4. Interact with components to test interaction performance"
echo "   5. Use 'Toggle All Items' for bulk operation testing"
echo "   6. Export metrics for detailed analysis"
echo ""
echo "🛑 To stop all applications, run: ./stop-all.sh"
echo "📋 To view logs, check the logs/ directory"
