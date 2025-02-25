<?php
session_start(); // Start the session

// Ensure that the session variable is set when the user logs in
if (isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn'] === true) {
    // Respond with login success as a boolean value
    echo json_encode(['isLoggedIn' => true]);
} else {
    // Respond with login failure as a boolean value
    echo json_encode(['isLoggedIn' => false]);
}

exit;
?>
