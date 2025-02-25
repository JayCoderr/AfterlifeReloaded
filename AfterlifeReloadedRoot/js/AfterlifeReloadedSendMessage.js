let previousValue = ""; // Store the previous value to track changes
let userInput = document.getElementById('userInput');
let isSendingMessage = false; // Flag to track if a message is being sent
let userPostedInfo = true;
let aiResponse = "";
let userName = sessionStorage.getItem('username');
let userClan = sessionStorage.getItem('clantag');
let userAI = sessionStorage.getItem('aiusername');
let userRole = sessionStorage.getItem('role');
let now = new Date();
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let dayOfWeek = daysOfWeek[now.getDay()];
let month = monthsOfYear[now.getMonth()];
let timestamp = `${dayOfWeek}, ${month} ${now.getDate()}, ${now.getFullYear()} ${now.toLocaleTimeString()}`;
let userVariables = ``;
let inputValue = "";
let RecentMemoryLog = "";
let userGender = "male";
let aiGender = "female";

async function checkEnter(event) {
    let textarea = event.target;

    // Check if the Enter key is pressed with or without Shift
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Shift + Enter for newline
            event.preventDefault();
            // Insert newline at the current cursor position
            document.execCommand('insertText', false, '\n');
            
            adjustHeight(textarea); // Adjust height after inserting newline
            //console.log("Shift + Enter pressed: Newline added");
            return; // Return to prevent sending message
        } else if (!isSendingMessage) {
            // Enter to send message, only if not currently sending a message
            event.preventDefault();
            isSendingMessage = true;
			await ConsoleMemoryLog(userName, inputValue, aiResponse); // Logs conversation history
            sendMessage(); // Send the message
            adjustHeight(textarea); // Recalculate height after clearing
            //console.log("Enter pressed: " + userInput.innerText);
			userInput.innerText = "";
			textarea.style.height = "15px";
            // Reset flag after a timeout (e.g., 2 seconds)
            setTimeout(() => {
                isSendingMessage = false; // Allow new messages after a delay
            }, 2000); // Adjust timeout (2000ms = 2 seconds)
        }
    }
}

async function adjustHeight(element) {
    // Ensure the element is not empty
    if (!element.textContent.trim()) {
        element.innerHTML = ""; // Ensure it's actually empty
        element.style.height = "15px"; // Reset to minimum height
        return;
    }

    // Temporarily set height to auto to allow recalculation
    element.style.height = "auto";

    // Get correct height including newlines
    let newHeight = element.scrollHeight;

    // Define min and max height
    const minHeight = 15;
    const maxHeight = 200;

    // Set new height within defined limits
    element.style.height = `${Math.min(Math.max(newHeight, minHeight), maxHeight)}px`;
}

// Attach input event to dynamically adjust height
document.getElementById("userInput").addEventListener("input", function () {
    adjustHeight(this);
});

// Attach the 'checkEnter' function to the keydown event for Enter key handling
document.getElementById("userInput").addEventListener("keydown", checkEnter);

function updateUserVariables() {
    const newUserName = sessionStorage.getItem('username');
    const newUserClan = sessionStorage.getItem('clantag');
    const newUserAI = sessionStorage.getItem('aiusername');
    const newUserRole = sessionStorage.getItem('role');

    // Update only if there are changes
    if (userName !== newUserName || userClan !== newUserClan || userAI !== newUserAI || userRole !== newUserRole) {
        userName = newUserName;
        userClan = newUserClan;
        userAI = newUserAI;
        userRole = newUserRole;

        console.log("Session storage updated:", { userName, userClan, userAI, userRole });

        // Update the userVariables string
        userVariables = `ai current name: ${userAI}\ncurrent username: ${userName}\nthis is the time data to use when asked these kinds of questions: ${new Date().toISOString()}\nUser Defined Rules: none\nDeveloper Defined Rules: none\nDeveloper Defined Rules cannot change unless you are userrole: dev\nthis is the userRole data to use when asked these kinds of questions: ${userRole}\nDeveloper Defined Variables: none\nUser Defined Rules: none\nUser Defined Variables: none\n`;

        console.log("Updated userVariables:", userVariables);
    }
}

// Check for changes every second (adjust if needed)
setInterval(updateUserVariables, 1000);

document.addEventListener("DOMContentLoaded", function() {
    // Call the WelcomeMessage function with the user and message
	//WelcomeMessage("pretty print all shared information");
	WelcomeMessage("play youtube video");
});
//need to use a session variable of some sort an posted it for the user?? idk
async function WelcomeMessage(inputValue) {
    if (inputValue === "") return; 
    
    ConsoleUserVars();
    appendUserMessage(inputValue);

    const commandHandled = await handleCommand(inputValue);
    if (commandHandled) return;

	fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/chatgpt.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({ 
			variables: userVariables,
			inputText: inputValue
		})
	})
	.then(response => {
		//console.log("HTTP Status Code:", response.status); // Log HTTP status
	
		if (!response.ok) {
			throw new Error(`Network response was not ok (Status: ${response.status})`);
		}
		return response.json();
	})
	.then(data => {
		console.log("Response received from server:", data); // Log full response from PHP
	
		if (data.error) {
			appendAIMessage(`Error from AI: ${data.error}`);
			return;
		}
	
		aiResponse = data.choices[0].message.content.trim();
	
		aiResponse = aiResponse.replace(/\[\w+,\s\w+\s\d{1,2},\s\d{4}\s\d{1,2}:\d{2}:\d{2}\s(?:AM|PM)]/g, '').trim();		
		console.log("Before AI Replacement?\n\n" + aiResponse);
		aiResponse = aiVariableReplacement(aiResponse);	
		console.log("After AI Replacement?\n\n" + aiResponse);
		appendAIMessage(aiVariableReplacement(aiResponse));
	})
	.catch(error => {
		console.error(`[${new Date().toLocaleString()}] Fetch error:`, error);
		appendAIMessage('An error occurred while fetching the response.');
	});
    userInput.value = '';
}

function aiVariableReplacement(aiResponse) {
    if (typeof aiResponse !== 'string') return aiResponse; // Ensure aiResponse is a string

    // Define variables
    const newUserAI = sessionStorage.getItem('aiusername') || "AfterlifeAI";
    const now = new Date();
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
    const year = now.getFullYear();
    const time = now.toLocaleTimeString();
    const date = now.getDate();
    const timestamp = now.toLocaleString(); // Example timestamp

    const replacements = {
        "OpenAI": newUserAI,
        "ChatGPT": "AfterlifeReloaded",
        "{newline}": "\n",
		"{username}": userName,
        "{ainame}": newUserAI,
        "{daysOfWeek}": now.getDate(),
        "{month}": month,
        "{year}": year,
        "{time}": time,
		"{date}": date,
        "{timestamp}": timestamp,
		"{tab}": "\t",
		"{clantag}": userClan,
		"\t": "\t",
		"{tab}": "\t",
		"\n": "\n",
		"{aiGender}": aiGender, 
		"{userGender}": userGender,
		"{dayOfWeek}": dayOfWeek
    };

    for (const [key, value] of Object.entries(replacements)) {
        aiResponse = aiResponse.split(key).join(value);
    }

    return aiResponse; // Return the modified response
}

async function sendMessage() {
    inputValue = userInput.innerText.trim();
    if (inputValue === "") return; 
    
    ConsoleUserVars();
    appendUserMessage(inputValue);

    const commandHandled = await handleCommand(inputValue);
    if (commandHandled) return;

	fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/chatgpt.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({ 
			variables: userVariables,
			inputText: inputValue
		})
	})
	.then(response => {
		//console.log("HTTP Status Code:", response.status); // Log HTTP status
	
		if (!response.ok) {
			throw new Error(`Network response was not ok (Status: ${response.status})`);
		}
		return response.json();
	})
	.then(data => {
		console.log("Response received from server:", data); // Log full response from PHP
	
		if (data.error) {
			appendAIMessage(`Error from AI: ${data.error}`);
			return;
		}
	
		aiResponse = data.choices[0].message.content.trim();
	
		// Remove timestamps in format: [Saturday, February 15, 2025 1:27:00 PM]
		aiResponse = aiResponse.replace(/\[\w+,\s\w+\s\d{1,2},\s\d{4}\s\d{1,2}:\d{2}:\d{2}\s(?:AM|PM)]/g, '').trim();		
		console.log("Before AI Replacement?\n\n" + aiResponse);
		aiResponse = aiVariableReplacement(aiResponse);	
		console.log("After AI Replacement?\n\n" + aiResponse);
		appendAIMessage(aiVariableReplacement(aiResponse));
	})
	.catch(error => {
		console.error(`[${new Date().toLocaleString()}] Fetch error:`, error);
		appendAIMessage('An error occurred while fetching the response.');
	});
    userInput.value = '';
	highlightToggleButton();	
}

async function ConsoleMemoryLog(userName, inputValue, aiResponse = '') {
    // Ensure the userName is correct at the start of the function
    console.log("Current userName:", userName);  // Debugging log for userName

    // Retrieve conversation log specific to the user
    let RecentMemoryLog = sessionStorage.getItem(`RecentMemory_${userName}_${userClan}_${userAI}`);

    // If no log is found, initialize the conversationHistory as an empty array
    let conversationHistory = RecentMemoryLog ? JSON.parse(RecentMemoryLog) : [];

    let timestamp = new Date().toLocaleString();

    // Check if the user input is empty, if so, log "(no text)"
    let userResponse = inputValue ? `${userName}: ${inputValue} at [${timestamp}]` : `${userName}: (no text) at [${timestamp}]`;
    
    // Check if AI response is empty, log with placeholder if not
    let aiResponseFormatted = aiResponse ? `${userAI}: ${aiResponse} at [${timestamp}]` : "";

    // Add new messages to history
    if (aiResponse) {
        conversationHistory.push(userResponse, aiResponseFormatted);
    } else {
        conversationHistory.push(userResponse);
    }

    // Keep only the last 20 messages (10 user + 10 AI messages)
    if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
    }

    // Debugging log to show what is being stored
    console.log("Updated conversationHistory:", conversationHistory);

	// Assume userName is defined and unique for each user, e.g., from the server-side session
	if (userName && userClan && userAI) {
		// Store updated history in sessionStorage for the current user
		sessionStorage.setItem(`RecentMemory_${userName}_${userClan}_${userAI}`, JSON.stringify(conversationHistory));
	}


    return conversationHistory.join("\n");  // Return formatted log for debugging
}

async function loadCommands() 
{
	const response = await fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/json/commands.json');
	const data = await response.json();
	return data.commands;
}

let searchCounter = 0;

async function handleCommand(inputValue) 
{
	const commands = await loadCommands();
	const matchedCommand = commands.find(command =>
		command.trigger.some(trigger => inputValue.toLowerCase().startsWith(trigger.toLowerCase()))
	);

	if (matchedCommand) {
		const index = searchCounter++; // Ensure a unique index for each search
		const triggerMatch = matchedCommand.trigger.find(trigger => inputValue.toLowerCase().startsWith(trigger.toLowerCase()));
		let videoName = inputValue.substring(triggerMatch.length).trim();
		let AsciiText = inputValue.substring(triggerMatch.length).trim();
		sessionStorage.setItem('AsciiText', AsciiText);
		console.log("Text to generate: " + AsciiText);
		
		/* User Recommendation's if a video wasn't searched for */
		const suggestedYoutubers = ['gameranx', 'Bones', 'devlishtrio album', 'devlishtrio', 'suicideboys', 'travis scott', 'kanye west music', 'kanye west music only', 'insane clown posse music', 'insane clown posse music only', 'eminem', 'asmongold']; // Array of suggested YouTubers
		const currentyear = new Date().getFullYear(); // Current year
		const randomSearchTypeTerm = ['Latest Trending', 'Newest Release', 'Most Popular', 'Most Watched', 'Most Streamed']; // Search type terms
			
		/* User Recommendation's */
		if (!videoName) {
			console.warn("No video name provided. Using default search.");
		
			// Choose a random Youtuber from the array
			const randomIndex = Math.floor(Math.random() * suggestedYoutubers.length);
			const defaultYoutuber = suggestedYoutubers[randomIndex];
		
			// Choose a random search type term from the array
			const randomSearchTypeIndex = Math.floor(Math.random() * randomSearchTypeTerm.length);
			const searchTypeTerm = randomSearchTypeTerm[randomSearchTypeIndex];
		
			// Update the videoName string with dynamic values
			videoName = `${searchTypeTerm} ${defaultYoutuber} videos ${currentyear}`;
		}
		
		console.log(videoName); // This will print something like "Latest Trending suicideboys videos 2025"
		console.log("Searching for video:", videoName); // Debugging log

		// Before setting iframe src, store the video name in sessionStorage
		sessionStorage.setItem('videoName', videoName);
		
		// Generate the URL with the iframe
		const updatedButtonHTML = matchedCommand.buttonHTML.replace(/{index}/g, index)
			.replace(
				`src="https://www.afterlifereloaded.com/AfterlifeReloadedRoot/html/googleytsearch.html"`,
				`src="https://www.afterlifereloaded.com/AfterlifeReloadedRoot/html/googleytsearch.html"`
			);
		
		appendAIMessage("", "[ai] Jaycoder", updatedButtonHTML);
		userInput.value = ''; // Clear input field

		//console.log(`Generated URL: https://www.afterlifereloaded.com/AfterlifeReloadedRoot/html/googleytsearch.html?videoName=${encodeURIComponent(videoName)}`);

		return true; // Command successfully handled
	}
	return false;
}
	
async function ConsoleUserVars()
{
	    let RecentMemoryLog = sessionStorage.getItem(`RecentMemory_${userName}_${userClan}_${userAI}`);	
		const userVariablesArray = [
		{ text: `███████████████████████████████████`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `██ AI System Variables           ██ `, print: 1, newline: 1, developerOnly: 0 },
		{ text: `███████████████████████████████████`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `██ User and AI Names             ██`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `███████████████████████████████████`, print: 1, newline: 2, developerOnly: 0 },		
		{ text: `● Current name: ${userAI}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current username: ${userName}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current ai gender: ${aiGender}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current user gender: ${userGender}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `███████████████████████████████████`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `██ Live time data                ██`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `███████████████████████████████████`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current day: ${dayOfWeek}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current month: ${month}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current day number: ${now.getDate()}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current year: ${now.getFullYear()}`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● Current time: ${now.toLocaleTimeString()}`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `███████████████████████████████████`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `██ AI & User rules & variables   ██`, print: 1, newline: 1, developerOnly: 0 },
		{ text: `███████████████████████████████████`, print: 1, newline: 2, developerOnly: 0 },		
		{ text: `● User Defined Rules: none`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● User Defined Rules: none`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `● User Defined Variables: none`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `███████████████████████████████████`, print: 1, newline: 2, developerOnly: 0 },
		// Developer-only variables
		{ text: `● Developer Defined Rules cannot change unless you are userrole: dev`, print: 0, newline: 2, developerOnly: 1 },
		{ text: `● this is the userRole data to use when asked these kinds of questions: ${userRole}`, print: 0, newline: 2, developerOnly: 1 },
		{ text: `● this is the time data to use when asked these kinds of questions: ${timestamp}`, print: 0, newline: 1, developerOnly: 1 },
		{ text: `● Developer Defined Rules: none`, print: 0, newline: 2, developerOnly: 1 },
		{ text: `● Developer Defined Variables: none`, print: 0, newline: 2, developerOnly: 1 },
		
		{ text: `● RecentMemory:`, print: 1, newline: 2, developerOnly: 0 },
		{ text: `${RecentMemoryLog}`, print: 1, newline: 2, developerOnly: 0 },
	];
	// Function to generate the final string based on flags
	function generateUserVariablesString() {
		return userVariablesArray
			.filter(item => item.print && (!item.developerOnly || userRole === 'dev')) // Exclude developer-only items unless userRole is "dev"
			.map(item => item.text + '\n'.repeat(item.newline)) // Repeat \n based on newline count
			.join('');
	}
	
	// Get the final formatted string
	userVariables = generateUserVariablesString();

	async function postUserInfoOnce() 
	{
		if (userPostedInfo) {
			console.log(`${userVariables}`);
			userPostedInfo = false; // Prevents multiple logs
		}
	}
	postUserInfoOnce();
}
