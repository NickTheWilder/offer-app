#!/bin/bash

# This script runs the client application in a standalone environment
echo "Starting Offer Frontend"
echo "========================================"
echo "Mock data is initialized at startup"
echo "Use the following demo accounts:"
echo "Admin: email=admin@example.com, password=admin123"
echo "Bidder: email=bidder@example.com, password=bidder123"
echo "========================================"

# Run the client application
npm run dev
