<?php
// Start the session first
session_start();

// Check if the GoogleAuthenticator.php file exists before including
$gauthPath = '/home/jaycoder/public_html/AfterlifeReloadedRoot/php/GoogleAuthenticator/PHPGangsta/GoogleAuthenticator.php';
if (!file_exists($gauthPath)) {
    die(json_encode(['status' => 'error', 'message' => 'GoogleAuthenticator.php file not found.']));
}
require_once $gauthPath;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.afterlifereloaded.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

$gAuth = new PHPGangsta_GoogleAuthenticator();
$username = filter_var($_POST['username'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$otp = filter_var($_POST['otp'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Fetch the user data (e.g., from a session, database, or file)
$userData = getUserData($username); // Replace with actual logic to fetch user data

// If user data not found or no secret key exists, return an error
if (!$userData || !isset($userData['secretKey'])) {
    error_log("Secret Key not found for user: $username");
    echo json_encode(['status' => 'error', 'message' => 'Secret key not found.']);
    exit;
}

$secretKey = $userData['secretKey']; // Get the secret key for the user

// Log for debugging (remove in production)
error_log("Secret Key for $username: " . substr($secretKey, 0, 4) . '...'); // Masked for security
error_log("OTP Entered: " . $otp);

// Verify the OTP
if ($gAuth->verifyCode($secretKey, $otp)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid OTP.']);
}

/**
 * Function to retrieve user data from session or other sources
 * @param string $username
 * @return array|null
 */
function getUserData($username) {
    // Fetch the user data from a session, database, or a file (e.g., GitHub JSON as in your previous example)
    // For example, you might have the user data stored in a session:
    // return $_SESSION['users'][$username] ?? null;

    // If you're fetching from a database or file, you can do so here
    // Replace with actual logic to fetch the user data, such as calling a database or file fetch
    return getUserDataFromGitHub($username);
}

/**
 * Example function to get user data from GitHub (replace with actual logic)
 */
function getUserDataFromGitHub($username) {
    $token = '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'; // Provide your GitHub token
    $repoOwner = 'JayCoderr';
    $repoName = 'Afterlife_AI_GPT';
    $filePath = 'AfterlifeReloadedUL.json';

    $url = "https://api.github.com/repos/$repoOwner/$repoName/contents/$filePath";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'AfterlifeAI');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: token ' . $token]);

    $response = curl_exec($ch);
    curl_close($ch);

    if ($response === false) {
        return null; // Handle error or retry
    }

    $data = json_decode($response, true);

    // Fetch and return the user data based on username
    if (isset($data['content'])) {
        $decodedContent = base64_decode($data['content']);
        $userData = json_decode($decodedContent, true);
        foreach ($userData['users'] as $user) {
            if ($user['username'] === $username) {
                return $user; // Return the user's data
            }
        }
    }

    return null;
}
?>
