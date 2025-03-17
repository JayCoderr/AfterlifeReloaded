<?php
header('Content-Type: text/html; charset=utf-8');

session_start();

$csvFile = 'AfterlifeReloadedResponses.csv';
 
// Ensure the user is logged in
if (!isset($_SESSION['isLoggedIn']) || !isset($_SESSION['username'])) {
    echo json_encode(['Unauthorized' => "You're either here illegally, or your username is invalid... you really shouldn't be trying to do this..."]); 
	exit;
}

// If no role is set, restrict access
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

// Check if the file exists; if not, display an error message.
if (!file_exists($csvFile)) {
    echo "<h2>Error: CSV file not found.</h2>";
    exit;
}

// Handle CSV purging
if (isset($_POST['purge'])) {
    if (file_put_contents($csvFile, '') !== false) {
        echo "<h2>CSV file purged successfully.</h2>";
    } else {
        echo "<h2>Error purging the CSV file.</h2>";
    }
}

// Handle CSV download
if (isset($_POST['download'])) {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="' . basename($csvFile) . '"');
    readfile($csvFile);
    exit; // Stop further execution
}

// Handle CSV refresh
if (isset($_POST['refresh'])) {
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// Handle CSV upload
if (isset($_POST['upload'])) {
    if (isset($_FILES['csv_upload']) && $_FILES['csv_upload']['error'] === UPLOAD_ERR_OK) {
        $uploadedFile = $_FILES['csv_upload']['tmp_name'];
        $uploadedFileName = basename($_FILES['csv_upload']['name']); // Use basename to prevent directory traversal

        // Move the uploaded file to the desired location
        if (move_uploaded_file($uploadedFile, $uploadedFileName)) {
            echo "<h2>Uploaded file: $uploadedFileName successfully!</h2>";
        } else {
            echo "<h2>Error moving the uploaded file.</h2>";
        }
    } else {
        echo "<h2>Error uploading file: " . $_FILES['csv_upload']['error'] . "</h2>";
    }
}

$file = fopen($csvFile, 'r');

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Afterlife Reloaded Natural Language</title>
    <style>
        body {
            color: rgb(255, 255, 255);
            font-family: Arial, sans-serif;
        }
        h1 {
            text-align: center;
        }
        .scroll-container {
            height: 564px; /* Fixed height for the entire scrollable container */
            margin: 0 auto;
            overflow-y: auto;
            border-radius: 5px;
            padding: 10px;
            background-color: rgba(0, 0, 50, 0.8);
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 1);
        }
        /* Hide scrollbar for Chrome, Safari, and Edge */
		.scroll-container::-webkit-scrollbar {
			width: 0; /* Remove scrollbar width */
			height: 0; /* For horizontal scrollbar if needed */
		}
        table {
            width: 100%;
            border-collapse: collapse;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 1);
        }      
        th, td {
            padding: 10px;
            text-align: left;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 1);
            vertical-align: top; /* Align text to the top of the cell */
        }

        /* Set fixed size for cells */
        td {
            height: 100px;
            width: 200px;
            overflow: auto; /* Allow overflow scrolling */
        }
        td {
            height: 100px;
            width: 200px;
            overflow: auto; /* Allow overflow scrolling */
        }		
		td::-webkit-scrollbar {
			width: 0; /* Remove scrollbar width */
			height: 0; /* For horizontal scrollbar if needed */
		}
		
		.scrollable-cell {
			height: 100px; /* Fixed height for the scrollable cell */
			width: 200px; /* Fixed width for the scrollable cell */
			overflow: auto; /* Allow overflow scrolling */
		}
		
		/* Hide scrollbar */
		.scrollable-cell::-webkit-scrollbar {
			width: 0; /* Remove scrollbar width */
			height: 0; /* For horizontal scrollbar if needed */
		}
        
        th {
            background-color: rgba(0, 0, 50, 0.8);
            box-shadow: 0px 4px 10px rgba(0,0,0,1);            
        }
        tr:nth-child(even) {
            background-color: rgba(0, 0, 50, 0.8);
            box-shadow: 0px 4px 10px rgba(0,0,0,1);            
        }
        button {
            background-color: rgba(0, 0, 70, 0.8);
            color: rgb(255, 255, 255);
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 5px;
            box-shadow: 0px 4px 10px rgba(0,0,0,1);            
        }
        button:hover {
            background-color: rgb(0, 0, 100);
            box-shadow: 0px 4px 10px rgba(0,0,0,0.5);            
        }
        input[type='file'] {
            display: none; /* Hide default file input */
        }
        label {
            background-color: rgb(0, 0, 70);
            color: rgb(255, 255, 255);
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0px 4px 10px rgba(0,0,0,1);            
        }
        label:hover {
            background-color: rgb(0, 0, 100);
            box-shadow: 0px 4px 10px rgba(0,0,0,0.5);            
        }	
		#aiResponse, #userResponse {
			white-space: pre-wrap; /* Preserve formatting such as line breaks and spaces */
			overflow: auto;
		}
		
		#aiResponse::-webkit-scrollbar, #userResponse::-webkit-scrollbar {
			width: 0; /* Remove scrollbar width */
			height: 0; /* For horizontal scrollbar if needed */
		}
		.response {
			overflow: auto; /* Allow scrolling if necessary */
			white-space: pre-wrap; /* Preserve white space formatting */
			max-height: 150px; /* Set a maximum height */
			width: 400px; /* Set width to match */
		}
		
		/* Hide the scrollbar */
		.response::-webkit-scrollbar {
			width: 0; /* Remove scrollbar width */
			height: 0; /* Remove scrollbar height */
		}		
    </style>
	<script>
	function cycleResponse(index, responses, responseIndexDisplay, nextBtn) {
		// Hide all responses in this specific container
		responses.forEach(response => response.style.display = 'none');
	
		// Show the current response based on the updated index
		responses[index].style.display = 'block';
	
		// Update the displayed response index
		responseIndexDisplay.innerText = (index + 1) + ' of ' + responses.length;
	
		// Show the next button if there are multiple responses
		nextBtn.style.display = responses.length > 1 ? 'inline-block' : 'none';
	}
	
	function nextResponse(button) {
		const responsesContainer = button.closest('td');
		const responseIndexDisplay = responsesContainer.querySelector('.responseIndex');
		const responses = Array.from(responsesContainer.querySelectorAll('.response'));
		const nextBtn = button;
	
		// Get or initialize the current index
		let currentIndex = parseInt(button.getAttribute('data-index'), 10) || 0;
	
		// Move to the next response, cycling back to the first if at the end
		currentIndex = (currentIndex + 1) % responses.length;
	
		// Update the index in the button's data attribute
		button.setAttribute('data-index', currentIndex);
	
		// Call cycleResponse to update visibility and index display
		cycleResponse(currentIndex, responses, responseIndexDisplay, nextBtn);
	}
	
	function editResponse(button) {
		const responsesContainer = button.closest('td');
		const responseDivs = responsesContainer.querySelectorAll('.response');
		let responseDiv;
	
		// If there's more than one response, select the one to replace based on the button's data-row-index
		if (responseDivs.length > 1) {
			const responseToReplaceIndex = parseInt(button.previousElementSibling.getAttribute('data-index'), 10);
			responseDiv = responseDivs[responseToReplaceIndex];
		} else {
			// If there's only one response, just use the first one
			responseDiv = responseDivs[0];
		}
	
		// Create a textarea to allow editing
		const textArea = document.createElement('textarea');
		textArea.value = responseDiv.innerText.replace(' &&& ', '{delimiter}'); // Replace delimiter for editing
		textArea.style.width = '400px';
		textArea.style.height = '150px';
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.5)';
		textArea.style.background = 'rgba(0, 0, 30, 0.9)';
		textArea.style.color = 'white';
	
		// Replace the original response with the textarea for editing
		responseDiv.parentNode.replaceChild(textArea, responseDiv);
	
		// Change the button to save the edited response
		button.innerText = 'Save';
		button.onclick = function() { saveResponse(textArea, button); };
	}
	
	function saveResponse(textArea, button, responseToReplaceIndex) {
		const updatedResponse = textArea.value
			.replace(/{delimiter}/g, ' &&& ')  // Convert back to original delimiter
			.replace(/<br\s*\/?>/gi, '{newline}') // Replace <br> tags with {newline}
			.replace(/\\n/g, '{newline}');
	
		const newResponseDiv = document.createElement('div');
		newResponseDiv.className = 'response';
		newResponseDiv.innerHTML = updatedResponse;
	
		textArea.parentNode.replaceChild(newResponseDiv, textArea);
	
		const rowIndex = button.getAttribute('data-row-index');
	
		fetch('update_csv.php', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				'rowIndex': rowIndex,
				'newResponse': updatedResponse,
				'responseToReplaceIndex': responseToReplaceIndex
			})
		})
		.then(response => response.text())
		.then(data => {
			console.log(data);
			button.innerText = 'Edit';
			button.onclick = function() { editResponse(button); };
		})
		.catch(error => console.error('Error:', error));
	}
	</script>	
</head>
<body>";
$placeholders = [
    '{newline}' => "{newline}",
    '{tab}' => "{tab}",
    '{ainame}' => '{ainame}',
    '{username}' => '{username}',
];

// Wrap the table in a scrollable container
echo "<div class='scroll-container'>";
echo "<h1>Afterlife Reloaded Natural Language</h1>";
echo "<form method='post' action='' enctype='multipart/form-data' style='text-align: center;'>";
echo "<button type='submit' name='purge' onclick='return confirm(\"Are you sure you want to purge the CSV file?\");'>Purge CSV</button> ";
echo "<button type='submit' name='download'>Download CSV</button> ";
echo "<button type='submit' name='refresh'>Refresh CSV</button> ";
echo "<label for='csv_upload'>Choose CSV File</label>";
echo "<input type='file' id='csv_upload' name='csv_upload' accept='.csv'>";
echo "<button type='submit' name='upload'>Upload CSV</button>";
echo "</form>";
echo "<table>";
echo "<tr><th>User Input</th><th>AI Responses</th><th>Date & Time</th></tr>";

$rowIndex = 0; // Initialize row index

// Open the CSV file for reading
if (($file = fopen('AfterlifeReloadedResponses.csv', 'r')) !== false) {
    while (($line = fgets($file)) !== false) {
        // Use custom explode function since we're using #### as the delimiter
        $columns = explode('####', $line);
        
        // Revert placeholders only once to avoid duplication
        $userInput = htmlspecialchars(str_replace(array_keys($placeholders), $placeholders, trim($columns[0])));
        $aiResponses = htmlspecialchars(str_replace(array_keys($placeholders), $placeholders, trim($columns[1])));
        $dateTime = htmlspecialchars(trim($columns[2]));  // DateTime likely doesn’t need newlines/tabs reverted

        echo "<tr>";
        echo "<td><div id='userResponse' style='height: 150px; width: 400px; overflow: auto; white-space: pre;'>$userInput</div></td>";

        if (strpos($aiResponses, ' &&& ') !== false || strpos($aiResponses, '&amp;&amp;&amp;') !== false) {
            // Clean up the responses if they contain encoded delimiters
            $cleanedResponses = str_replace(' &amp;&amp;&amp; ', ' &&& ', $aiResponses);
            $responsesArray = explode(" &&& ", $cleanedResponses);
            $totalResponses = count($responsesArray);
            
            echo "<td>";
            echo "<div class='aiResponseContainer' style='height: 150px; width: 400px; overflow: auto;'>";
            echo "<div class='responseIndex'>1 of $totalResponses</div>"; // Initial counter

            foreach ($responsesArray as $index => $response) {
                echo "<div class='response' data-index='$index' style='display: " . ($index === 0 ? 'block' : 'none') . "; white-space: pre;'>$response</div>";
            }

            echo "<button class='next-btn' data-row-index='$rowIndex' onclick='nextResponse(this);'>Next</button>";
            echo "<button data-row-index='$rowIndex' onclick='editResponse(this)'>Edit</button>";
            echo "</div></td>";
        } else {
            echo "<td><div class='response' style='height: 150px; width: 400px; overflow: auto; white-space: pre;'>$aiResponses</div>";
            echo "<button type='button' data-row-index='$rowIndex' onclick='editResponse(this);'>Edit</button></td>";
        }

        echo "<td><div style='height: 150px; width: 200px; overflow: auto;'>$dateTime</div></td>";
        echo "</tr>";

        $rowIndex++; // Increment row index for each row
    }
    fclose($file);
}

echo "</table>";
echo "</div>"; // Close scroll container
echo "</body></html>";
exit;
?>