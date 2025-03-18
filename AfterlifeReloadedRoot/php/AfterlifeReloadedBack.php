<?php
session_start();

header('Content-Type: application/json');

$apiKey = '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'; // Ensure you use the correct API key
$inputText = $_POST['inputText'] ?? '';
$variables = $_POST['variables'] ?? '';
$aiResponse = getChatGPTResponse($variables, $inputText, $apiKey);

if (empty($inputText)) {
    echo json_encode(['error' => 'Input text is empty']);
    exit;
}

if (!isset($_SESSION['isLoggedIn']) || $_SESSION['isLoggedIn'] !== true) {
    echo json_encode(['isLoggedIn' => "You can't do that if your not logged In..."]);
    exit;
}

$_SESSION['source'] = 'AfterlifeReloaded'; // or 'ChatGPT'

function getAfterlifeReloadedResponse($inputText) {
    $MinResponseCount = 10;
    $csvFile = 'AfterlifeReloadedResponses.csv';

    if (!file_exists($csvFile) || !is_readable($csvFile)) {
        error_log("Error: CSV file not found or unreadable.");
        return null;
    }

    $handle = fopen($csvFile, "r");
    if (!$handle) {
        error_log("Error: Failed to open CSV file.");
        return null;
    }

    // Normalize input text
    $conversation = normalizeString($inputText);
    error_log("Looking for conversation match: " . $conversation);

    while (($line = fgets($handle)) !== FALSE) {
        $parts = explode('####', trim($line), 3);
        
        if (count($parts) < 3) continue;

        $storedText = normalizeString($parts[0]);
        error_log("Checking stored input: " . $storedText);

        if ($storedText === $conversation) {
            $aiResponseRaw = trim($parts[1]);

            if ($aiResponseRaw === '') {
                error_log("Cache miss! Empty response.");
                fclose($handle);
                return null;
            }

            // Split responses and trim whitespace
            $responseParts = array_map('trim', explode('&&&', $aiResponseRaw));

            // Debug response count
            error_log("Found " . count($responseParts) . " cached responses.");

            // Check response count against MinResponseCount
            if (count($responseParts) < (int) $MinResponseCount) {
                error_log("Cache miss! Only " . count($responseParts) . " responses found (minimum required: $MinResponseCount).");
                fclose($handle);
                return null; // If less than min, return null to trigger ChatGPT
            }

            // Select a random response
            $selectedResponse = $responseParts[array_rand($responseParts)];
			error_log("CSV Line: " . json_encode($line));
			error_log("Split Parts: " . json_encode($parts));

            fclose($handle);
            error_log("Cache hit! Returning cached response: " . $selectedResponse);
            return $selectedResponse;
        }
    }

    fclose($handle);
    error_log("Cache miss! No cached response found.");
    return null;
}

// Helper function to normalize strings
function normalizeString($string) {
    return strtolower(trim(preg_replace('/\s+/', ' ', $string)));
}

function getChatGPTResponse($variables, $inputText, $apiKey) {
    $_SESSION['isLoggedIn'] = true;
    error_log("Checking cache first...");
    
    // Checking cache for a matching response
    $cachedResponse = getAfterlifeReloadedResponse($inputText);
    
    if ($cachedResponse !== null) {
        error_log("Cache hit! Returning cached response.");
        error_log("Source: AfterlifeReloaded");
        return $cachedResponse; // Immediately return if found in cache
    }
    
    // Cache miss, proceed to ChatGPT API request
    error_log("Cache miss! Sending request to OpenAI.");

    $url = 'https://api.openai.com/v1/chat/completions';

    $variablesString = is_string($variables) ? trim($variables) : json_encode($variables);
    $conversation = $variablesString . "\n\n" . trim($inputText);

    $data = [
        'model' => 'gpt-4.5-preview-2025-02-27',
        'messages' => [
            ['role' => 'user', 'content' => $conversation]
        ],
        'temperature' => 0.2,
        'top_p' => 0.95,
        'max_tokens' => 4000
    ];

    error_log("Sending to OpenAI API: " . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    error_log("Source: OpenAI API");

    $options = [
        'http' => [
            'header'  => [
                "Content-Type: application/json",
                "Authorization: Bearer $apiKey"
            ],
            'method'  => 'POST',
            'content' => json_encode($data),
            'ignore_errors' => true
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        error_log("Error fetching response from OpenAI");
        return 'Error fetching response';
    }

    $response = json_decode($result, true);

    // Debugging API response
    error_log("OpenAI API Response: " . json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    if (isset($response['choices'][0]['message']['content'])) {
        $aiResponse = $response['choices'][0]['message']['content'];
        logToCSV($inputText, $aiResponse); // Now this actually executes
        return $aiResponse;
    } else {
        error_log("OpenAI API did not return a valid response. Full response: " . json_encode($response));
        return 'Error fetching response';
    }
}

function replaceCustomPlaceholders($text, $placeholders) {
    return str_replace(array_keys($placeholders), array_values($placeholders), $text);
}

function logToCSV($inputText, $aiResponse = null, $errorMessage = null) {
    $logFile = 'AfterlifeReloadedResponses.csv';
    $dateTime = date('Y-m-d h:ia'); // 12-hour format with am/pm

    // Define custom placeholders and their replacements
    $placeholders = [
        "\n" => "{newline}", // Handles actual newlines
        "\r" => "{newline}", // Handles carriage returns (if any)
        "\r\n" => "{newline}", // Handles Windows-style newlines
        "\t" => "{tab}",
        "<br>" => "{newline}", // Convert HTML line breaks
        "username" => "{username}"
    ];

    // Replace time formats with {time}
    $timePattern = '/\b(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)\b/i';
    $inputText = preg_replace($timePattern, '{time}', $inputText);
    if ($aiResponse) {
        $aiResponse = preg_replace($timePattern, '{time}', $aiResponse);
    }

    // Apply custom placeholders to input text and AI response
    $formattedInputText = replaceCustomPlaceholders($inputText, $placeholders);
    $formattedAiResponse = $aiResponse ? replaceCustomPlaceholders($aiResponse, $placeholders) : '';

    error_log("Formatted Input: " . $formattedInputText);
    error_log("Formatted Response: " . $formattedAiResponse);

    // Read current entries to avoid duplicates
    $existingEntries = [];
    $found = false;

    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            $columns = explode('####', $line);

            // Normalize existing responses to compare against formatted response
            $existingResponseArray = explode(' &&& ', $columns[1]);
            $existingResponseArray = array_map('trim', $existingResponseArray);

            // Check if the input text matches
            if ($columns[0] === $formattedInputText) {
                if ($errorMessage) {
                    $columns[1] = 'ERROR: ' . $errorMessage;
                } else {
                    // Only add the new response if it doesn't already exist
                    if ($aiResponse && !in_array($formattedAiResponse, $existingResponseArray)) {
                        $existingResponseArray[] = $formattedAiResponse;
                    }
                    $columns[1] = implode(' &&& ', array_unique($existingResponseArray));
                }
                $found = true;
            }
            $existingEntries[] = $columns;
        }
    }

    // If inputText not found, add a new entry
    if (!$found && $aiResponse) {
        $logEntry = [$formattedInputText, $formattedAiResponse, $dateTime];
        $existingEntries[] = $logEntry;
    }

    // Write back all entries, including updates, to the CSV file
    $file = fopen($logFile, 'w');
    foreach ($existingEntries as $entry) {
        fwrite($file, implode('####', $entry) . PHP_EOL);
    }
    fclose($file);
}

// Usage example
$aiResponse = getChatGPTResponse($variables, $inputText, $apiKey);
logToCSV($inputText, $aiResponse);

// Return the response from ChatGPT
echo json_encode(['choices' => [['message' => ['content' => $aiResponse]]]]);
exit;
?>
