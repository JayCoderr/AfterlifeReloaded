<?php
session_start(); // Start the session to access session variables

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

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
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recipient = filter_var($_POST["recipient"], FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($_POST["message"]);
    $username = htmlspecialchars($_POST["username"]); // Get username from request
	$userai = htmlspecialchars($_POST["userai"]);

    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email address.";
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = "mail.privateemail.com";
        $mail->SMTPAuth = true;
        $mail->Username = "jaycoder@afterlifereloaded.com"; 
        $mail->Password = "JayIsAMFGodx3!"; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom("jaycoder@afterlifereloaded.com", $userai); // Use username from JavaScript
        $mail->addAddress($recipient);
        $mail->Subject = "Message from " . $userai . " on Afterlife AI 7.0";  // Correct string concatenation
        $mail->Body = $message;

        if ($mail->send()) {
            echo "Email sent successfully!";
        } else {
            echo "Mailer Error: " . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        echo "Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid request method.";
}
?>
