<?php
// Test file to check if storage is accessible

echo "<h1>Storage Link Test</h1>";

// Check if the storage directory exists
$storageDir = __DIR__ . '/storage';
if (is_dir($storageDir)) {
    echo "<p style='color: green;'>Storage directory exists at: {$storageDir}</p>";
} else {
    echo "<p style='color: red;'>Storage directory does not exist at: {$storageDir}</p>";
    
    // Check if the symlink is correctly set up
    if (is_link($storageDir)) {
        echo "<p>Storage is a symlink pointing to: " . readlink($storageDir) . "</p>";
    } else {
        echo "<p>Storage is not a symlink!</p>";
    }
}

// List all files in the storage directory
echo "<h2>Checking for product images:</h2>";

// Try to find where the files might be
$possiblePaths = [
    __DIR__ . '/storage/products',
    __DIR__ . '/../storage/app/public/products',
];

foreach ($possiblePaths as $path) {
    echo "<h3>Checking path: {$path}</h3>";
    if (is_dir($path)) {
        echo "<p style='color: green;'>Directory exists!</p>";
        
        // Try to list files recursively
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        $fileCount = 0;
        echo "<ul>";
        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $fileCount++;
                if ($fileCount <= 10) { // Limit to 10 files to avoid overwhelming output
                    $relativePath = str_replace(__DIR__, '', $file->getPathname());
                    echo "<li>{$relativePath}</li>";
                }
            }
        }
        
        if ($fileCount > 10) {
            echo "<li>... and " . ($fileCount - 10) . " more files</li>";
        } elseif ($fileCount === 0) {
            echo "<li>No files found in this directory</li>";
        }
        
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>Directory does not exist!</p>";
    }
}

// Test image display
echo "<h2>Testing image display:</h2>";

// Try to find a sample image to test
$sampleImagePath = null;
foreach ($possiblePaths as $basePath) {
    if (is_dir($basePath)) {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($basePath, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $file) {
            if ($file->isFile() && in_array(strtolower(pathinfo($file->getPathname(), PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif'])) {
                $sampleImagePath = $file->getPathname();
                break 2; // Break out of both loops
            }
        }
    }
}

if ($sampleImagePath) {
    $relativePath = str_replace(__DIR__, '', $sampleImagePath);
    $webPath = str_replace(__DIR__, '', $sampleImagePath);
    $storageWebPath = '/storage' . str_replace('/storage', '', $webPath);
    
    echo "<p>Found sample image: {$relativePath}</p>";
    echo "<p>Testing different URL formats:</p>";
    
    echo "<div style='display: flex; flex-wrap: wrap; gap: 20px;'>";
    
    // Test direct path
    echo "<div style='border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;'>";
    echo "<p>Direct path: {$webPath}</p>";
    echo "<img src='{$webPath}' style='max-width: 200px; max-height: 200px;' onerror=\"this.onerror=null; this.src=''; this.alt='Image failed to load'; this.style.border='1px solid red';\">";
    echo "</div>";
    
    // Test storage path
    echo "<div style='border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;'>";
    echo "<p>Storage path: {$storageWebPath}</p>";
    echo "<img src='{$storageWebPath}' style='max-width: 200px; max-height: 200px;' onerror=\"this.onerror=null; this.src=''; this.alt='Image failed to load'; this.style.border='1px solid red';\">";
    echo "</div>";
    
    echo "</div>";
} else {
    echo "<p style='color: red;'>No sample images found to test!</p>";
}
