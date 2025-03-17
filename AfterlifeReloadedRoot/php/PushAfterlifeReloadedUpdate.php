<?php
session_start();

if (!isset($_SESSION['isLoggedIn']) || $_SESSION['isLoggedIn'] !== true) {
    echo json_encode(['isLoggedIn' => "You can't do that if you're not logged in..."]);
    exit;
}

$token = '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';
$owner = 'Afterlife-Reloaded';
$repo = 'AfterlifeReloaded';
$branch = 'main';

// Files to check and update
$filesToCheck = [
	/* Html */
    'AfterlifeAI.html',
	'AfterlifeAbout.html',
	'AfterlifeReloaded.html',
	/* Images */
	//it's not really needed for this
	/* Css */
	'AfterlifeReloadedRoot/css/AfterlifeAI.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloaded403Design.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedAbout.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedEmail.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedFiglet.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedGeneral.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedGeneral00.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedGeneral01.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedGoogleCustom.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedLogin.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedLoginRGB.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedOtherDesign.css',
	'AfterlifeReloadedRoot/css/AfterlifeReloadedSettingMenu.css',	
	/* Custom Html Embed's */
	'AfterlifeReloadedRoot/html/Afterlife403Error.html',
	'AfterlifeReloadedRoot/html/AfterlifeJS_Obfuscator.html',
	'AfterlifeReloadedRoot/html/conversations.csv',
	'AfterlifeReloadedRoot/html/error_log',
	'AfterlifeReloadedRoot/html/figlet.html',
	'AfterlifeReloadedRoot/html/googleytsearch.html',
	'AfterlifeReloadedRoot/html/save_conversation.php',
	'AfterlifeReloadedRoot/html/sendemailform.html',
	'AfterlifeReloadedRoot/html/testest.html',
	/* Js */
	'AfterlifeReloadedRoot/js/afterlife_reloaded_chat_tracker.js',
	'AfterlifeReloadedRoot/js/AfterlifeAILogic.js',
	'AfterlifeReloadedRoot/js/AfterlifeFooterScript.js',
	'AfterlifeReloadedRoot/js/AfterlifeJavaResponseVC.js',
	'AfterlifeReloadedRoot/js/AfterlifeListeners.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedAdminEmail.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedAIMessageBubble.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedAsciiScripts.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedCTD.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedEmail.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedFigletCustom.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedGeneralGS.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedGoogleYTVideo.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedHudBGColor.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedRandomBG.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedRD.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedRGBSelector.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedScrollDownButton.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedSendMessage.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedSettingsMenuConfig.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedTMFTD.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedUserMessageBubble.js',
	'AfterlifeReloadedRoot/js/AfterlifeReloadedWelcomeAI.js',
	'AfterlifeReloadedRoot/js/AfterlifeStopDebugging.js',
	'AfterlifeReloadedRoot/js/AfterlifeTitleTyping.js',
	'AfterlifeReloadedRoot/js/ApplyPersonalAIDesign.js',
	/* json scripts */
	'AfterlifeReloadedRoot/json/commands.json',
	'AfterlifeReloadedRoot/json/messages.json',	
	/* php scripts */
	'AfterlifeReloadedRoot/php/AfterlifeReloadedBack.php',
	'AfterlifeReloadedRoot/php/AfterlifeReloadedEmail.php',
	'AfterlifeReloadedRoot/php/AfterlifeReloadedResponses.csv',
	'AfterlifeReloadedRoot/php/AfterlifeSignInRefresh.php',
	'AfterlifeReloadedRoot/php/AfterlifeUpdateUL.php',
	'AfterlifeReloadedRoot/php/AfterlifeUpdateVC.php',
	'AfterlifeReloadedRoot/php/IsVerified.php',
	'AfterlifeReloadedRoot/php/error_log',
	'AfterlifeReloadedRoot/php/list-fonts.php',
	'AfterlifeReloadedRoot/php/search.php',
	'AfterlifeReloadedRoot/php/sendmail.php',
	'AfterlifeReloadedRoot/php/update_csv.php',
	'AfterlifeReloadedRoot/php/verifyOTP.php',
	'AfterlifeReloadedRoot/php/view_chatgpt_responses.php',	
	/* txt related things */
	'AfterlifeReloadedRoot/txt/AfterlifeCounter.txt',
	'AfterlifeReloadedRoot/txt/footer.txt'
];

// GitHub API Request Function
function githubApiRequest($url, $token, $method = "GET", $data = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: token $token",
        "User-Agent: PHP-Script",
        "Accept: application/vnd.github.v3+json"
    ]);
    if ($method !== "GET") {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// Fetch File Content from GitHub
function fetchGitHubFileContent($owner, $repo, $filePath, $token) {
    $url = "https://api.github.com/repos/$owner/$repo/contents/$filePath";
    $data = githubApiRequest($url, $token);
    
    return isset($data['content']) ? base64_decode($data['content']) : false;
}

// Append Update Log to the Bottom of README.md
function appendToReadme($owner, $repo, $token, $updateMessage) {
    $readmePath = "README.md";
    $url = "https://api.github.com/repos/$owner/$repo/contents/$readmePath";

    // Fetch current README content
    $readmeData = githubApiRequest($url, $token);
    
    if (!isset($readmeData['content']) || !isset($readmeData['sha'])) {
        echo "Error fetching README.md\n";
        return false;
    }

    $currentReadmeContent = base64_decode($readmeData['content']);
    $newContent = $currentReadmeContent . "\n" . "● **" . date("Y-m-d") . ":** " . $updateMessage;

    // Push the updated README back to GitHub
    $updateData = [
        "message" => "Appending update log to README.md",
        "content" => base64_encode($newContent),
        "sha" => $readmeData['sha']
    ];

    return githubApiRequest($url, $token, "PUT", $updateData);
}

// Process file updates
$updateOccurred = false;
$serverDirectory = '/home/jaycoder/public_html/';

foreach ($filesToCheck as $path) {
    echo "Checking file: $path\n";

    $content = fetchGitHubFileContent($owner, $repo, $path, $token);
    
    if ($content === false) {
        echo "Error: Failed to download $path from GitHub.\n";
        continue;
    }

    $localFilePath = $serverDirectory . $path;
    $updatedLines = [];

    if (file_exists($localFilePath)) {
        $existingContent = file_get_contents($localFilePath);
        if ($existingContent === $content) {
            echo "No changes detected in $path.\n";
            continue;
        }

        $existingLines = explode("\n", $existingContent);
        $newLines = explode("\n", $content);

        foreach ($newLines as $index => $newLine) {
            $lineNumber = $index + 1;
            $escapedLine = htmlspecialchars($newLine);
            
            if (!isset($existingLines[$index]) || trim($existingLines[$index]) !== trim($newLine)) {
                $updateSummary = strlen($escapedLine) > 50 ? substr($escapedLine, 0, 47) . "..." : $escapedLine;
                $updatedLines[] = "Updated `$path` (Line $lineNumber): $updateSummary";
            }
        }
    } else {
        echo "Local file missing, treating as a new file.\n";
        $updatedLines[] = "New file added: `$path`";
    }

    file_put_contents($localFilePath, $content);
    echo "File updated successfully: $localFilePath\n";

    if (!empty($updatedLines)) {
        $updateOccurred = true;
        appendToReadme($owner, $repo, $token, implode("\n", $updatedLines));
    }
}

if ($updateOccurred) {
    echo "README.md updated with the new change log.\n";
} else {
    echo "No updates detected, README.md not modified.\n";
}

exit();
?>
