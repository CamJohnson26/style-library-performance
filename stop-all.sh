#!/bin/bash

# Stop all styling library performance test applications
# Now includes: DOM, MUI, Tailwind, shadcn/ui, Radix UI, Chakra UI, Reshaped, Panda CSS, Base UI, Stitches, Vanilla Extract, CVA, Styled Components, Bootstrap

echo "🛑 Stopping all Styling Library Performance Tests..."

# Kill processes by PID files
if [ -d "logs" ]; then
    for pid_file in logs/*.pid; do
        if [ -f "$pid_file" ]; then
            pid=$(cat "$pid_file")
            if kill -0 "$pid" 2>/dev/null; then
                echo "   Stopping process $pid..."
                kill "$pid" 2>/dev/null || true
            fi
            rm "$pid_file"
        fi
    done
fi

# Kill all vite processes more aggressively
echo "   Stopping Vite development servers..."
pkill -f "vite" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 1

# Force kill any remaining vite processes
echo "   Force stopping any remaining processes..."
pkill -9 -f "vite" 2>/dev/null || true

# Kill any node processes running in our project directories
echo "   Cleaning up project-specific processes..."
pkill -f "styling-library-performance.*vite" 2>/dev/null || true

# Verify no vite processes are running
remaining=$(pgrep -f "vite" | wc -l)
if [ "$remaining" -eq 0 ]; then
    echo "✅ All applications stopped successfully!"
else
    echo "⚠️  Some processes may still be running. Remaining vite processes: $remaining"
    echo "   You may need to manually kill them with: pkill -9 -f vite"
fi

echo "📋 Logs are preserved in the logs/ directory"
