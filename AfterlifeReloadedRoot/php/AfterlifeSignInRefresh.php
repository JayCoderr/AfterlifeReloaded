<?php
header('Content-Type: application/json');
session_start();
if (isset($_SESSION['isLoggedIn']) && $_SESSION['isLoggedIn'] === true) {
    $_SESSION['last_active'] = time(); // Update last active time
    echo json_encode(['status' => 'Session refreshed']);
} else {
    echo json_encode(['status' => 'Session expired']);
}
exit;
?>