# PowerShell script to run performance tests
# Requires: npm install -g lighthouse

Write-Host "Starting performance tests..." -ForegroundColor Green

# Create output directory if it doesn't exist
$outputDir = "performance-reports"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "Created directory: $outputDir" -ForegroundColor Yellow
}

# Define pages to test
$pages = @(
    "/",
    "/products",
    "/categories/skincare",
    "/categories/makeup",
    "/login",
    "/register"
)

# Base URL for testing
$baseUrl = "http://localhost:8000"

# Run Lighthouse tests for each page
foreach ($page in $pages) {
    $url = "$baseUrl$page"
    $pageName = if ($page -eq "/") { "home" } else { $page.TrimStart("/").Replace("/", "-") }
    $outputPath = "$outputDir/$pageName"
    
    Write-Host "Testing page: $url" -ForegroundColor Yellow
    
    # Run Lighthouse with specific categories and output formats
    lighthouse $url --output html,json --output-path $outputPath --only-categories performance,accessibility,best-practices,seo --chrome-flags="--headless"
    
    Write-Host "Report saved to $outputPath.report.html and $outputPath.report.json" -ForegroundColor Green
}

Write-Host "Performance tests completed!" -ForegroundColor Green
Write-Host "Reports are available in the $outputDir directory" -ForegroundColor Green
