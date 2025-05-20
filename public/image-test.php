<?php
// Test file to check image URLs

// Get the current URL
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'];
$baseUrl = $protocol . $host;

// Test image paths
$imagePaths = [
    'products/2025/05/20/BLxjR8mjVzrKk42hY1Cmhqwyhb0rcJYTiTWX60BS.jpg',
    'products/2025/05/20/eMs7DQ8Sf42MmVACvQEIDChaZbbGKWSbHx8pUEjz.jpg'
];

echo "<h1>Image URL Test</h1>";

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

// Test different URL formats
echo "<h2>Testing different URL formats:</h2>";
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>URL Format</th><th>Image</th><th>Status</th></tr>";

foreach ($imagePaths as $imagePath) {
    // Test format 1: /storage/path
    $url1 = "/storage/{$imagePath}";
    $fullPath1 = __DIR__ . $url1;
    $exists1 = file_exists($fullPath1) ? "Exists" : "Not Found";
    $color1 = $exists1 === "Exists" ? "green" : "red";
    
    // Test format 2: storage/path
    $url2 = "storage/{$imagePath}";
    $fullPath2 = __DIR__ . '/' . $url2;
    $exists2 = file_exists($fullPath2) ? "Exists" : "Not Found";
    $color2 = $exists2 === "Exists" ? "green" : "red";
    
    // Test format 3: /path
    $url3 = "/{$imagePath}";
    $fullPath3 = __DIR__ . $url3;
    $exists3 = file_exists($fullPath3) ? "Exists" : "Not Found";
    $color3 = $exists3 === "Exists" ? "green" : "red";
    
    echo "<tr>";
    echo "<td>/storage/{$imagePath}</td>";
    echo "<td><img src='{$baseUrl}{$url1}' style='max-width: 100px; max-height: 100px;'></td>";
    echo "<td style='color: {$color1};'>{$exists1}<br>Path: {$fullPath1}</td>";
    echo "</tr>";
    
    echo "<tr>";
    echo "<td>storage/{$imagePath}</td>";
    echo "<td><img src='{$baseUrl}/{$url2}' style='max-width: 100px; max-height: 100px;'></td>";
    echo "<td style='color: {$color2};'>{$exists2}<br>Path: {$fullPath2}</td>";
    echo "</tr>";
    
    echo "<tr>";
    echo "<td>/{$imagePath}</td>";
    echo "<td><img src='{$baseUrl}{$url3}' style='max-width: 100px; max-height: 100px;'></td>";
    echo "<td style='color: {$color3};'>{$exists3}<br>Path: {$fullPath3}</td>";
    echo "</tr>";
}

echo "</table>";

// List all files in the storage directory
echo "<h2>Files in storage directory:</h2>";
$storageProductsDir = __DIR__ . '/storage/products/2025/05/20';
if (is_dir($storageProductsDir)) {
    $files = scandir($storageProductsDir);
    echo "<ul>";
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo "<li>{$file}</li>";
        }
    }
    echo "</ul>";
} else {
    echo "<p>Directory does not exist: {$storageProductsDir}</p>";
    
    // Try to find where the files might be
    $possiblePaths = [
        __DIR__ . '/storage',
        __DIR__ . '/../storage/app/public',
        __DIR__ . '/../storage/app/public/products',
    ];
    
    echo "<h3>Checking possible storage locations:</h3>";
    echo "<ul>";
    foreach ($possiblePaths as $path) {
        if (is_dir($path)) {
            echo "<li style='color: green;'>{$path} exists</li>";
            
            // If it's a directory, list its contents
            $subFiles = scandir($path);
            echo "<ul>";
            foreach ($subFiles as $subFile) {
                if ($subFile != '.' && $subFile != '..') {
                    echo "<li>{$subFile}</li>";
                }
            }
            echo "</ul>";
        } else {
            echo "<li style='color: red;'>{$path} does not exist</li>";
        }
    }
    echo "</ul>";
}
