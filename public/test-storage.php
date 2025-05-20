<?php
// Test file to check if storage is accessible

$imagePath = 'storage/products/2025/05/20/BLxjR8mjVzrKk42hY1Cmhqwyhb0rcJYTiTWX60BS.jpg';
$fullPath = __DIR__ . '/' . $imagePath;

echo "<h1>Storage Test</h1>";
echo "<p>Checking if file exists at: {$fullPath}</p>";

if (file_exists($fullPath)) {
    echo "<p style='color: green;'>File exists!</p>";
    echo "<img src='/{$imagePath}' alt='Test Image' style='max-width: 300px;'>";
} else {
    echo "<p style='color: red;'>File does not exist!</p>";
    
    // Check if the storage directory exists
    $storageDir = __DIR__ . '/storage';
    if (is_dir($storageDir)) {
        echo "<p>Storage directory exists.</p>";
    } else {
        echo "<p>Storage directory does not exist!</p>";
    }
    
    // Check if the symlink is correctly set up
    if (is_link($storageDir)) {
        echo "<p>Storage is a symlink pointing to: " . readlink($storageDir) . "</p>";
    } else {
        echo "<p>Storage is not a symlink!</p>";
    }
}

// List all files in the directory
$dir = dirname($fullPath);
echo "<h2>Files in directory:</h2>";
if (is_dir($dir)) {
    $files = scandir($dir);
    echo "<ul>";
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo "<li>{$file}</li>";
        }
    }
    echo "</ul>";
} else {
    echo "<p>Directory does not exist: {$dir}</p>";
}
