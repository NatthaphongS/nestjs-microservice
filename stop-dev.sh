#!/bin/bash

# Stop all running microservices

echo "Stopping all microservices..."

# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:3002 | xargs kill -9 2>/dev/null
lsof -ti:3003 | xargs kill -9 2>/dev/null

echo "✓ All services stopped"
