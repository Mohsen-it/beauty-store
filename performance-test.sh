#!/bin/bash

# Bash script to run performance tests
# Requires: npm install -g lighthouse

echo "Starting performance tests..."

# Create output directory if it doesn't exist
outputDir="performance-reports"
mkdir -p $outputDir

# Define pages to test
pages=(
    "/"
    "/products"
    "/categories/skincare"
    "/categories/makeup"
    "/login"
    "/register"
)

# Base URL for testing
baseUrl="http://localhost:8000"

# Run Lighthouse tests for each page
for page in "${pages[@]}"; do
    url="$baseUrl$page"
    
    # Convert page path to a filename
    if [ "$page" == "/" ]; then
        pageName="home"
    else
        pageName=$(echo $page | sed 's/^\///' | sed 's/\//-/g')
    fi
    
    outputPath="$outputDir/$pageName"
    
    echo "Testing page: $url"
    
    # Run Lighthouse with specific categories and output formats
    lighthouse $url --output html,json --output-path $outputPath --only-categories performance,accessibility,best-practices,seo --chrome-flags="--headless"
    
    echo "Report saved to $outputPath.report.html and $outputPath.report.json"
done

echo "Performance tests completed!"
echo "Reports are available in the $outputDir directory"
