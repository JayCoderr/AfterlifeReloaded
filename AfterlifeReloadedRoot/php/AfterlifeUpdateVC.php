<?php
// Set headers for CORS
header("Access-Control-Allow-Origin: *"); // Replace with specific origin if needed
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Respond to preflight request
    http_response_code(204); // No Content
    exit();
}

// Path to the visitor count file in AfterlifeReloadedRoot/txt/
$file = $_SERVER['DOCUMENT_ROOT'] . '/AfterlifeReloadedRoot/txt/AfterlifeCounter.txt';

// Check if the file exists, if not, create it with an initial count of 0
if (!file_exists($file)) {
    file_put_contents($file, '0');
}

// Read the current count
$visitorCount = file_get_contents($file);

// Increment the count
$visitorCount++;

// Write the updated count back to the file
file_put_contents($file, $visitorCount);

// Return the updated count as a response
echo $visitorCount;
?>