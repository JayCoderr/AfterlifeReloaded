<?php
session_start();
 
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

// Ensure the user is logged in
if (!isset($_SESSION['isLoggedIn']) || !isset($_SESSION['username'])) {
    echo json_encode(['Unauthorized' => "Your etheir here illegally, or your username is invalid... you really shouldn't be trying to do this..."]);
    exit;
}
 // Check if the user has 'dev' role
if ($_SESSION['role'] !== 'dev') {
	echo "
	<script>
	document.addEventListener('DOMContentLoaded', function() {
		// Get the user role from sessionStorage
		const userRole = sessionStorage.getItem('role');
	
		// Create the response message element
		const responseMessage = document.createElement('div');
	
		// If the user is not a developer, hide overflow first, then apply blur and clear content
		if (userRole !== 'dev') { 
			// Set the response message text and style
			responseMessage.textContent = 'You are not a developer.';
			responseMessage.style.color = '#ffffff';
			responseMessage.style.display = 'ruby-text';
			responseMessage.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 1)';
			responseMessage.style.backgroundColor = 'rgb(50, 50, 50, 0.8)';
			responseMessage.style.borderRadius = '25px';
			responseMessage.style.padding = '5px';
	
			// Completely hide scrollbars and prevent scrolling
			document.documentElement.style.overflow = 'hidden'; 
			document.body.style.overflow = 'hidden'; 
	
			setTimeout(() => {
				// Apply blur effect to the entire page
				document.documentElement.style.filter = 'blur(5px)'; 
			}, 10); // Small delay to ensure overflow is hidden before blur
	
			setTimeout(() => {
				// Clear content in head and body, except for responseMessage
				document.head.innerHTML = ''; // Clear content in the head
				document.body.innerHTML = ''; // Clear content in the body
	
				// Ensure that responseMessage remains visible and retains its CSS
				document.body.appendChild(responseMessage); // Append responseMessage to body
	
			}, 500); // Delay clearing content by 500ms to allow the blur effect to be seen
	
			// Wait for a short delay after clearing content and applying blur, then execute logic for responseMessage
			setTimeout(() => {
				if (responseMessage) {
					responseMessage.style.display = 'ruby-text'; // Ensure it's visible
				}
			}, 1000); // Wait for 1 second after the blur effect is applied before showing the message
	
			// After showing the response message, turn off the blur effect after a delay
			setTimeout(() => {
				if (responseMessage && responseMessage.textContent === 'You are not a developer.') {
					document.documentElement.style.filter = ''; // Remove blur effect
				}
			}, 2000); // Delay for 2 seconds after the message appears before removing the blur
		}
	});
	</script>
	";
    exit; // Deny access if not a developer
}

$csvFile = 'chatgpt_responses.csv';

if (!file_exists($csvFile)) {
    echo "CSV file not found.";
    exit;
}

if (isset($_POST['rowIndex']) && isset($_POST['newResponse'])) {
    $rowIndex = intval($_POST['rowIndex']);
    $newResponse = $_POST['newResponse'];

    // Load CSV rows into an array
    $rows = file($csvFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $rows = array_map(function($line) {
        return explode('####', $line);
    }, $rows);

    if ($rowIndex < 0 || $rowIndex >= count($rows)) {
        echo "Row index out of range: $rowIndex";
        exit;
    }

    // Clean up the new response
    $newResponse = trim($newResponse);
    if ($newResponse === "") {
        echo "New response is empty.";
        exit;
    }

    // Existing responses split into an array
    $existingResponses = explode(' &&& ', $rows[$rowIndex][1]);
    $responseToReplaceIndex = intval($_POST['responseToReplaceIndex']);

    // Ensure we replace the correct response
    if ($responseToReplaceIndex >= 0 && $responseToReplaceIndex < count($existingResponses)) {
        $existingResponses[$responseToReplaceIndex] = $newResponse;
    }

    // Update responses and timestamp
    $rows[$rowIndex][1] = implode(' &&& ', $existingResponses);
    $rows[$rowIndex][2] = date('Y-m-d H:i:s');

    // Write back to the CSV file
    $fileHandle = fopen($csvFile, 'w');
    foreach ($rows as $row) {
        fwrite($fileHandle, implode('####', $row) . PHP_EOL);
    }
    fclose($fileHandle);

    echo "Response updated successfully.";
} else {
    echo "Invalid data.";
}
exit;
?>
