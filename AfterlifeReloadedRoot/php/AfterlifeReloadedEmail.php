<?php
header('Content-Type: text/html; charset=utf-8');
session_start(); // Start the session to access session variables

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require __DIR__ . '/PHPMailer/src/Exception.php';

// Ensure the user is logged in
if (!isset($_SESSION['isLoggedIn']) || !isset($_SESSION['username'])) {
    echo json_encode(['Unauthorized' => "You're either here illegally, or your username is invalid... you really shouldn't be trying to do this..."]);
    exit;
}

if ($_SESSION['role'] !== 'dev') {
    echo "
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const userRole = sessionStorage.getItem('role') || 'normal';
        
        if (userRole !== 'dev') {
            const responseMessage = document.createElement('div');
            responseMessage.textContent = `You are not a developer. Your current role: \${userRole}`;
            responseMessage.style.color = '#fff';
            responseMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            responseMessage.style.borderRadius = '25px';
            responseMessage.style.padding = '10px';
            responseMessage.style.position = 'fixed';
            responseMessage.style.top = '50%';
            responseMessage.style.left = '50%';
            responseMessage.style.transform = 'translate(-50%, -50%)';
            responseMessage.style.zIndex = '1000';
            responseMessage.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 1)';

            document.documentElement.style.overflow = 'hidden'; // Disable scrolling

            setTimeout(() => {
                document.documentElement.style.filter = 'blur(5px)';
            }, 10);

            setTimeout(() => {
                document.body.replaceChildren(responseMessage);
            }, 500);

            setTimeout(() => {
                document.documentElement.style.filter = '';
            }, 2000);
        }
    });
    </script>";
	echo "
	<html>
	<head>
		<style>
		#message {
			color: white;
			background-color: rgb(0, 0, 0, 1);
			border-radius: 25px;
			box-shadow: 0px 4px 10px rgba(0, 0, 0, 1);
			padding: 5px;
			font-family: Arial, sans-serif;
			width: fit-content;
			margin: 120px auto;
		}
		</style>
	
		<script>
		document.addEventListener('DOMContentLoaded', function() {
			const messages = [
			'I\'m 100% sure you have tried to alter my code and forcefully change your user Role to access this part of the website.',
			'Pretty sure you changed your role...',
			'Don\'t think I didn\'t notice you trying to hack your way through...',
			'Access denied. Unauthorized action detected.',
			'Nice try, but I see what you did there!'
			];
	
			// Pick a random message from the array
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			const messageElement = document.getElementById('message');
			let charIndex = 0;
	
			function typeMessage() {
			if (charIndex < randomMessage.length) {
				messageElement.textContent += randomMessage.charAt(charIndex);
				charIndex++;
				setTimeout(typeMessage, 100); // Adjust speed of typing here
			}
			}
	
			typeMessage();
		});
		</script>
	</head>
	<body>
		<p id='message'></p>
	</body>
	</html>
	";
    exit;
}

// If the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recipient = filter_var($_POST["recipient"], FILTER_SANITIZE_EMAIL);
    $message = $_POST["message"];
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
        $mail->isHTML(true);
		
        if ($mail->send()) {
            echo "success"; // Return "success" for JavaScript to handle
        } else {
            echo "Mailer Error: " . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        echo "Mailer Error: {$mail->ErrorInfo}";
    }
    exit;
}

// Render the form directly (without iframe)
echo "
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Send Email</title>
    <style>
		body {
			border-radius: 5px;
			margin: 0;
			padding-left: 10px;
			overflow-y: scroll; /* Allow scrolling */
		}
		
		/* Hide scrollbar for webkit browsers */
		body::-webkit-scrollbar {
			width: 0;
			height: 0;
		}

        label, input, button {
            border-radius: 5px;
			color: white;
			width: max-content;
            font-size: 12px;			
			
        }
		
		h2{
            border-radius: 5px;
			color: white;
			width: max-content;
            font-size: 14px;
			padding: 10px;
			box-shadow: 0px 4px 10px rgba(0,0,0,1);
			background-color: rgba(0,0,0,0.8);
		}
		
		#responseMessage{
            border-radius: 5px;
			color: white;
			width: max-content;
            font-size: 12px;	
		}
		
		textarea {
			width: 300px;
			padding: 12px;
			margin-bottom: 15px;
			color: white;
			background-color: rgba(0, 0, 0, 0.8);
			border: none;
			box-shadow: 0px 4px 10px rgba(0,0,0,1);
			resize: none;
			outline: none;
			max-height: 200px;
			scrollbar-color: rgba(70, 70, 70, 0.8) rgba(0, 0, 0, 0);
			scrollbar-width: thin;
			white-space: nowrap;
			overflow-x: auto;
		}
		
		/* Styling the scrollbar */
		textarea::-webkit-scrollbar {
			width: 8px; /* Adjust the width of the scrollbar */
			height: 8px; /* For horizontal scrollbar */
			border-radius: 25px; /* Make the scrollbar have rounded corners */
		}
		
		/* Styling the thumb (the draggable part of the scrollbar) */
		textarea::-webkit-scrollbar-thumb {
			background-color: rgba(70, 70, 70, 0.8);
			border-radius: 25px; /* Rounded corners for the thumb */
		}
		
		/* Styling the track (the background of the scrollbar) */
		textarea::-webkit-scrollbar-track {
			background-color: rgba(0, 0, 0, 0.1);
			border-radius: 25px; /* Rounded corners for the track */
		}
		
		/* Styling the arrows (buttons at the top and bottom of the scrollbar) */
		textarea::-webkit-scrollbar-button {
			background-color: rgba(70, 70, 70, 0.4); /* Set arrow button background */
			border-radius: 25px; /* Match border-radius for arrows */
		}
		
		/* Optional: Change the color when hovering over the arrows */
		textarea::-webkit-scrollbar-button:hover {
			background-color: rgba(70, 70, 70, 0.7); /* Hover effect */
		}
		
        input {
            width: 300px;
            padding: 12px;
            font-size: 12px;			
            margin-bottom: 15px;
            color: white;
            background-color: rgba(0, 0, 0, 0.8);
            border: none;
            box-shadow: 0px 4px 10px rgba(0,0,0,1);
            resize: none;
            outline: none;		
        }
		
        button {
            width: 100px;
            padding: 5px;
            font-size: 12px;
            border-radius: 5px;
            color: white;
            background-color: rgba(0, 0, 0, 0.8);
            border: none;
            cursor: pointer;
            box-shadow: 0px 4px 10px rgb(0,0,0,1);		
        }
        #responseMessage {
            margin-top: 20px;
            font-size: 12px;
            color: rgba(130,130,130,1);
            padding: 3px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 1);
            background-color: rgba(0,0,0,0.8);
            padding: 5px;
			width: max-content;
        }
    </style>
</head>
<body>
    <h2>Send Email As An Admin</h2>
    <form id='emailForm' method='POST' onsubmit='event.preventDefault(); sendEmail();'>
        <input type='email' id='recipientEmail' name='recipient' placeholder='user@domain.com' required>
        <textarea id='emailMessage' name='message' placeholder='Your message' rows='5' required></textarea>
		<br>
        <button type='submit'>Send</button>
    </form>
    <div id='responseMessage'>Waiting to send message...</div>
	<br>
    <script>
        function sendEmail() {
            const form = document.getElementById('emailForm');
            const formData = new FormData(form);
            fetch('', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data === 'success') {
                    // Only run this if the PHP response is 'success'
                    const responseMessage = document.getElementById('responseMessage');
                    const successMessage = 'Email sent successfully!';
                    let index = 0;
                    responseMessage.textContent = ''; // Clear any previous messages
                    const interval = setInterval(function() {
						responseMessage.style.color = 'green';
                        responseMessage.textContent += successMessage[index];
                        index++;
                        if (index === successMessage.length) {
                            clearInterval(interval);
                        }
                    }, 100);
                } else {
                    document.getElementById('responseMessage').textContent = 'There was an error sending the email.';
                }
            })
            .catch(error => console.error('Error:', error));
        }
    </script>
	<script>
    document.addEventListener('DOMContentLoaded', function() {	
		function adjustTextareaHeight(el) {
			el.style.height = 'auto'; // Reset the height
			el.style.height = (el.scrollHeight) + 'px'; // Set the height based on content
		}
		
		// Attach the function to the textarea
		document.querySelectorAll('textarea').forEach(textarea => {
			textarea.addEventListener('input', function() {
				adjustTextareaHeight(this);
			});
		});	
    });	
	</script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const userRole = sessionStorage.getItem('role') || 'normal';
        
        if (userRole !== 'dev') {
            const responseMessage = document.createElement('div');
            responseMessage.textContent = `You are not a developer. Your current role: \${userRole}`;
            responseMessage.style.color = '#fff';
            responseMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            responseMessage.style.borderRadius = '25px';
            responseMessage.style.padding = '10px';
            responseMessage.style.position = 'fixed';
            responseMessage.style.top = '50%';
            responseMessage.style.left = '50%';
            responseMessage.style.transform = 'translate(-50%, -50%)';
            responseMessage.style.zIndex = '1000';
            responseMessage.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 1)';

            document.documentElement.style.overflow = 'hidden'; // Disable scrolling

            setTimeout(() => {
                document.documentElement.style.filter = 'blur(5px)';
            }, 10);

            setTimeout(() => {
                document.body.replaceChildren(responseMessage);
            }, 500);

            setTimeout(() => {
                document.documentElement.style.filter = '';
            }, 2000);
        }
    });
    </script>	
</body>
</html>
";
