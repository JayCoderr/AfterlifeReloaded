<?php
// Get the JSON input from the POST request
$inputData = json_decode(file_get_contents('php://input'), true);

// Check if conversation data exists in the request
if (isset($inputData['conversation'])) {
    $conversation = $inputData['conversation'];

    // Remove quotes (") from the conversation text
    $cleanedConversation = str_replace('"', '', $conversation);

    // Path to the CSV file
    $csvFilePath = $_SERVER['DOCUMENT_ROOT'] . '/AfterlifeReloadedRoot/html/conversations.csv';

    // Open the CSV file in append mode
    if ($file = fopen($csvFilePath, 'a')) {
        // Write the cleaned conversation directly to the file as raw text
        fwrite($file, $cleanedConversation . PHP_EOL);  // Use PHP_EOL for line breaks

        // Close the file after writing
        fclose($file);

        // Respond back to the client
        echo json_encode(['status' => 'success']);
    } else {
        // If unable to open the file
        echo json_encode(['status' => 'error', 'message' => 'Unable to open the file.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'No conversation data received.']);
}
?>
