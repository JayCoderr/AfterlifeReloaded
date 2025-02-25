<?php
session_start();

header('Content-Type: application/json');
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$apiKey = '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'; // Ensure you use the correct API key
$inputText = $_POST['inputText'] ?? '';
$variables = $_POST['variables'] ?? '';

if (empty($inputText)) {
    echo json_encode(['error' => 'Input text is empty']);
    exit;
}

if (!isset($_SESSION['isLoggedIn']) || $_SESSION['isLoggedIn'] !== true) {
    echo json_encode(['isLoggedIn' => "You can't do that if your not logged In..."]);
    exit;
}

$_SESSION['source'] = 'AfterlifeReloaded'; // or 'ChatGPT'

function getCachedResponse($inputText) {
    $csvFile = 'chatgpt_responses.csv';

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

    while (($line = fgets($handle)) !== FALSE) {
        $parts = explode('####', $line, 3);
        
        if (count($parts) < 3) continue;

        // Normalize stored input text
        if (normalizeString($parts[0]) === $conversation) {
            fclose($handle);

            $aiResponseRaw = trim($parts[1]);
            if ($aiResponseRaw === '') return null;

            $responseParts = explode('&&&', $aiResponseRaw);
            $selectedResponse = trim($responseParts[array_rand($responseParts)]);

            error_log("Cache hit! Returning: " . $selectedResponse);
            return $selectedResponse;
        }
    }

    fclose($handle);
    error_log("Cache miss! No cached response found for: " . $conversation);
    return null;
}


// Helper function to normalize strings
function normalizeString($string) {
    return strtolower(trim(preg_replace('/\s+/', ' ', $string)));
}

function getChatGPTResponse($variables, $inputText, $apiKey) {
    error_log("Checking cache first...");
    
    // Checking cache for a matching response
    $cachedResponse = getCachedResponse($inputText);
    
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
        'model' => 'gpt-4',
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

    if (isset($response['choices'][0]['message']['content'])) {
        return $response['choices'][0]['message']['content'];
    } else {
        error_log("OpenAI API did not return a valid response.");
        return 'Error fetching response'; // Ensures "No response content" is not returned
    }
}

function replaceCustomPlaceholders($text, $placeholders) {
    foreach ($placeholders as $placeholder => $replacement) {
        $text = str_replace($placeholder, $replacement, $text);
    }
    return $text;
}

function logToCSV($inputText, $aiResponse = null, $errorMessage = null) {
    $logFile = 'chatgpt_responses.csv';
    $dateTime = date('Y-m-d h:ia'); // 12-hour format with am/pm

    // Define custom placeholders and their replacements
    $placeholders = [
        '{newline}' => "\n",
        '{tab}' => "\t",
        '{ainame}' => 'ChatGPT',    // Example AI name; customize as needed
        '{username}' => 'User',     // Example user name; customize as needed
    ];

    // Apply custom placeholders to input text and AI response
    $formattedInputText = replaceCustomPlaceholders(trim($inputText), array_flip($placeholders));
    $formattedAiResponse = $aiResponse ? replaceCustomPlaceholders(trim($aiResponse), array_flip($placeholders)) : '';

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
