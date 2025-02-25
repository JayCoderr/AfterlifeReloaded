<?php
$fontsDirectory = '/home/jaycoder/public_html/AfterlifeReloadedRoot/libs/figlet.js-1.8.0/fonts';
$fonts = [];

if ($handle = opendir($fontsDirectory)) {
    while (false !== ($entry = readdir($handle))) {
        // Exclude . and .. directories
        if ($entry != "." && $entry != "..") {
            // Add only files with .flf extension
            if (pathinfo($entry, PATHINFO_EXTENSION) === 'flf') {
                $fonts[] = $entry;
            }
        }
    }
    closedir($handle);
}

// Return the list as JSON
echo json_encode($fonts);
?>
