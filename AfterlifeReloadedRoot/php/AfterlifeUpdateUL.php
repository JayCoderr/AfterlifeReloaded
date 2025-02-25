<?php
session_start(); // Start the session

function generateSecretKey() {
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';  // Base32 characters
    $secret = '';
    for ($i = 0; $i < 16; $i++) {
        $secret .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $secret;
}

function updateGitHubFile($filePath, $fileContent, $token, $owner, $repo, $sha) {
    $url = "https://api.github.com/repos/$owner/$repo/contents/$filePath";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'AfterlifeAI');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: token ' . $token]);

    $data = [
        'message' => 'Updating user secret key',
        'content' => base64_encode($fileContent),
        'sha' => $sha // Provide the sha of the file for updates
    ];

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");

    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize user input
    $username = filter_var($_POST['username']);
    $password = filter_var($_POST['password']);

    // GitHub API token from environment variable
    $token = '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';
    $owner = 'JayCoderr';
    $repo = 'Afterlife_AI_GPT';
    $path = 'AfterlifeReloadedUL.json';
    $url = "https://api.github.com/repos/$owner/$repo/contents/$path";

    // Initialize curl to fetch data from GitHub
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'AfterlifeAI');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: token ' . $token]);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    if ($response === false) {
        echo json_encode(['error' => 'Failed to fetch user data from GitHub.']);
        exit;
    }

    $data = json_decode($response, true);

    if (!isset($data['content'])) {
        echo json_encode(['error' => 'User data not found in the GitHub response.']);
        exit;
    }

    $decodedContent = base64_decode($data['content']);
    $userData = json_decode($decodedContent, true);

    if ($userData === null) {
        echo json_encode(['error' => 'Invalid user data format.']);
        exit;
    }

	// Validate credentials
	foreach ($userData['users'] as $index => $user) {
		if ($user['username'] === $username) {
			// Check password securely (use hashing in real-world usage)
			if ($user['password'] === $password) {
				$_SESSION['isLoggedIn'] = true;
				$_SESSION['username'] = $username; // Store username in session
				$_SESSION['role'] = $user['role'] ?? 'normal'; // Store role in session (with default to 'normal')
	
				// If the user doesn't have a secret key, generate one
				if (empty($user['secretKey'])) {
					$user['secretKey'] = generateSecretKey();
				}
	
				// Update only the secret key if the user already has one
				$userData['users'][$index] = $user;
	
				// Update the GitHub repository with the modified user data
				$sha = $data['sha']; // Get the sha of the file from GitHub response
				$response = updateGitHubFile($path, json_encode($userData), $token, $owner, $repo, $sha);
	
				if ($response === false) {
					echo json_encode(['error' => 'Failed to update GitHub file.']);
					exit;
				}
	
				// Send the response back to the frontend WITHOUT role
				echo json_encode([
					'status' => 'success',
					'message' => 'Login successful.',
					'clantag' => $user['clantag'] ?? '[@yo]',
					'email' => $user['email'] ?? 'user@example.com',
					'aiusername' => $user['aiusername'] ?? 'AI Assistant',
					'userProfileImage' => $user['userProfileImage'] ?? 'https://example.com/user.png',
					'aiProfileImage' => $user['aiProfileImage'] ?? 'https://example.com/ai.png',
					'userBackgroundImage' => $user['userBackgroundImage'] ?? 'https://example.com/bg.png',
					'baseRgba' => $user['baseRgba'] ?? 'rgb(255,0,0,0.9)',
					'secretKey' => $user['secretKey'] ?? '00000000',
					'role' => "Your role is currently {$user['role']}", // Use double quotes to parse the variable correctly
				]);

				exit;
			} else {
				echo json_encode(['status' => 'error', 'message' => 'Invalid password.']);
				exit;
			}
		}
	}

    echo json_encode(['status' => 'error', 'message' => 'Invalid username.']);
    exit;
}

echo json_encode(['error' => 'Invalid request method.']);
exit;

ob_end_flush();

?>
