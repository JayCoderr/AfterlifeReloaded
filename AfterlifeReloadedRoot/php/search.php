<?php
session_start();
// Replace with your actual API key
$apiKey = 'AIzaSyDAQ0rngYznkzcejW7tpL09ZulOeKjoyLA';

// Ensure the user is logged in
if (!isset($_SESSION['isLoggedIn']) || !isset($_SESSION['username'])) {
    echo json_encode(['Unauthorized' => "Your etheir here illegally, or your username is invalid... you really shouldn't be trying to do this..."]);
    exit;
}

if (isset($_GET['search'])) {
    $query = urlencode($_GET['search']);
    $maxResults = 10; // so it loads faster, at 20 it is kind of slow but not really.
    $apiUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=$maxResults&q=$query&key=$apiKey";

    // Fetch data from YouTube API
    $response = file_get_contents($apiUrl);

    // Return JSON response
    if ($response) {
        echo $response;
    } else {
        echo json_encode(['error' => 'Unable to fetch data from YouTube.']);
    }
}
exit;
?>
