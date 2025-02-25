<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = $_POST['code'] ?? '';

    if (!isset($_SESSION['verification_code']) || !isset($_SESSION['verified_user'])) {
        echo json_encode(['status' => 'error', 'message' => 'Session expired or invalid request.']);
        exit;
    }

    if ($code == $_SESSION['verification_code']) {
        $_SESSION['isLoggedIn'] = true;
        $username = $_SESSION['verified_user'];

        echo json_encode([
            'status' => 'success',
            'message' => 'Login verified.',
            'username' => $username
        ]);
        
        unset($_SESSION['verification_code']);
        unset($_SESSION['verified_user']);
        exit;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid verification code.']);
        exit;
    }
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
exit;
?>
