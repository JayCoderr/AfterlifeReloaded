let previousValue = ""; // Store the previous value to track changes
let userInput = document.getElementById('userInput');
let isSendingMessage = false; // Flag to track if a message is being sent
let userPostedInfo = true;
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
let aiResponse = "";
let oldUserInput = "";
window.oldAIMessageResponse = "";
let lastSaidAtTime = "";
let lastInteractionTime = Date.now(); // Track the time of the last interaction
let oldInteractionUserInput = "";

// Function to check for inactivity and log idle time
function checkIdleTime() {
    const minsToWait = 2; // 2 minute's of inactivity seems to be perfect possibly
    const currentTime = Date.now();
    const timeDifference = currentTime - lastInteractionTime;
	isHtmlRendered = true;
    // Log the idle time in seconds
    console.log(`Idle Time: ${timeDifference / 1000} seconds`);

    // If more than 1 minute has passed since the last interaction
    if (timeDifference >= minsToWait * 60 * 1000) {
        sendMessage("Be sarcastic about the user not interacting with the chat for a while,{newline}And you must use the provided variables: {userName} for the user{newline}," + 
					"here what the user recently asked about {oldAIMessageResponse}{newline}" +
					"don't act like they are here,{newline}" +  
					"they still have yet to return,{newline}" +
					"be as unique as you can be with every response please, while maintaining variables provided {username}, {newline}, {oldAIMessageResponse}. {newline}" +
					"in responses and other things as needed to be unique.", false, true);
        lastInteractionTime = currentTime; // Reset the interaction time after sending sarcastic message
    }
}

// Function to handle keypress events
async function checkEnter(event) {
    let textarea = event.target;

    // If Enter key is pressed, send the message and reset interaction time
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            // Shift + Enter for newline
            event.preventDefault();
            
            // Insert newline directly into textarea.value
            textarea.value += '\n';
            adjustHeight(textarea); // Adjust height after inserting newline
            return; // Prevent sending message
        } else if (!isSendingMessage) {
            // Enter to send message, only if not currently sending a message
            event.preventDefault();
            isSendingMessage = true;

            sendMessage(userInput.innerText, true, true); // Send the message
            adjustHeight(textarea); // Recalculate height after clearing
            userInput.innerText = "";
            textarea.style.height = "15px";

            // Reset flag after a timeout (500ms for this example)
            setTimeout(() => {
                isSendingMessage = false;
            }, 500);

            // Update last interaction time when a message is sent
            lastInteractionTime = Date.now();
			oldInteractionUserInput = userInput.innerText;
        }
    }
}

// Attach event listener to start checking idle time after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up an interval to check for inactivity every 30 seconds (or any interval you prefer)
    setInterval(checkIdleTime, 30000); // Check every 30 seconds
});

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
    // Correct way to call WelcomeMessage after a delay
    setTimeout(() => {
        WelcomeMessage("make ascii " + userName, userAI);
    }, 10000);
});

setInterval(() => {
    fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/AfterlifeSignInRefresh.php', { credentials: 'include' }) // Send request with session cookies
        .then(response => response.json())
        .then(data => console.log("Session refreshed:", data))
        .catch(err => console.error("Session refresh failed:", err));
}, 5 * 60 * 1000); // Refresh every 5 minutes

//need to use a session variable of some sort an posted it for the user?? idk
async function WelcomeMessage(inputValue, userAI) {
    if (inputValue === "") return; 

    ConsoleUserVars();
    appendUserMessage(inputValue);

    const commandHandled = await handleCommand(inputValue, userAI, aiResponse);
    if (commandHandled) {	
        return aiResponse;
    }

    try {
        const response = await fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/AfterlifeReloadedBack.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 
                variables: userVariables,
                inputText: inputValue
            })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("Response received from server:", data); // Log full response from PHP

        if (data.error) {
            appendAIMessage(`Error from AI: ${data.error}`);
            return;
        }

        let aiResponse = data.choices[0].message.content.trim();

        aiResponse = aiResponse.replace(/\[\w+,\s\w+\s\d{1,2},\s\d{4}\s\d{1,2}:\d{2}:\d{2}\s(?:AM|PM)]/g, '').trim();        
        console.log("Before AI Replacement?\n\n" + aiResponse);
        aiResponse = aiVariableReplacement(aiResponse);    
        console.log("After AI Replacement?\n\n" + aiResponse);
        appendAIMessage(aiVariableReplacement(aiResponse));
		
		oldAIResponse = window.oldAIMessageResponse;
		window.oldAIMessageResponse = message;	

		lastInteractionTime = Date.now();

    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Fetch error:`, error);
        appendAIMessage('An error occurred while fetching the response.');
    }
    
    userInput.value = '';
}
window.sendMessage = sendMessage;
window.aiVariableReplacement = aiVariableReplacement;

function aiVariableReplacement(aiResponse) {
    if (typeof aiResponse !== 'string') return aiResponse; // Ensure aiResponse is a string

	// Define variables
    const newUserAI = sessionStorage.getItem('aiusername') || "AfterlifeAI";
    const now = new Date();
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now);
    const year = now.getFullYear();
    const date = now.getDate();
    // Get the current time
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const timeString = `${hours}:${minutes} ${ampm}`;
	let time = now.toLocaleTimeString();

    const replacements = {
        "OpenAI": newUserAI,
        "ChatGPT": "AfterlifeReloaded",
        "{newline}": "\n",
		"{username}": userName,
		"username": userName,
        "{ainame}": newUserAI,
        "{daysOfWeek}": now.getDate(),
        "{month}": month,
        "{year}": year,
		"{date}": date,
		"{time}": timeString,
        "{timestamp}": timeString,
		"{clantag}": userClan,
		"{tab}": "\t",
		"{aiGender}": aiGender, 
		"{userGender}": userGender,
		"{dayOfWeek}": dayOfWeek,
		"{oldUserInput}": oldUserInput,
		"{lastSaidAtTime}": lastSaidAtTime,
		"{oldAIResponse}": window.oldAIMessageResponse,
		"Shiro": newUserAI,
		"Jaycoder": userName,
		"{{username}}": userName,
		"{oldAIMessageResponse}": window.oldAIMessageResponse
    };

    for (const [key, value] of Object.entries(replacements)) {
        aiResponse = aiResponse.split(key).join(value);
    }
    return aiResponse; // Return the modified response
}

async function sendMessage(inputText, appendUserBubbleToUI = false, appendAIBubbleToUI = false) {
    //let time = new Date().toLocaleTimeString();
    let inputValue = inputText.trim();//aiVariableReplacement(inputText.trim());
	let triggeredInputValue = true; 
    if (inputValue === "") return "";

    if (appendUserBubbleToUI) {
        ConsoleUserVars();
        appendUserMessage(inputValue);
    }

	let replacements = [
		{ original: "{{username}}", replacement: "{username}" },
		{ original: "{username}", replacement: "{username}" },
		{ original: "?", replacement: "" },
		{ original: "!", replacement: "" },
		{ original: ".", replacement: "" },
		{ original: ",", replacement: "" }
	];
	
	// Escape special characters in `original` values
	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	
	// Apply all replacements efficiently
	inputValue = inputValue.toLowerCase();
	replacements.forEach(({ original, replacement }) => {
		inputValue = inputValue.replaceAll(new RegExp(escapeRegExp(original), "g"), replacement);
	});

    try {
        const response = await fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/AfterlifeReloadedBack.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 
                variables: userVariables,
                inputText: inputValue
            })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("Response received from server:", data);

        if (data.error) {
            return `Error: ${data.error}`;
        }

        let aiResponse = data.choices[0].message.content.trim();
       
        console.log("Before AI Replacement?\n\n" + aiResponse);
        aiResponse = aiVariableReplacement(aiResponse);    
        console.log("After AI Replacement?\n\n" + aiResponse);
		
		oldAIResponse = window.oldAIMessageResponse;
		window.oldAIMessageResponse = aiResponse;		
		
        // Handle command separately
        const commandHandled = await handleCommand(inputValue, userAI, aiResponse);
        if (commandHandled) {
            return aiResponse;
        }

        if (appendAIBubbleToUI) {
            appendAIMessage(aiResponse);
        }

        return aiResponse;

    } catch (error) {
        console.error(`[${new Date().toLocaleString()}] Fetch error:`, error);
        return 'An error occurred while fetching the response.';
    }
}

async function ConsoleMemoryLog(userName, inputValue, aiResponse) {
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

async function handleCommand(inputValue, userAI, aiResponse) 
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
		
		/* User Recommendation's if a video wasn't searched for */
		const suggestedYoutubers = ['gameranx', 'Bones music', 'devlishtrio album', 'devlishtrio', '$uicideboy$', 'travis scott', 'insane clown posse the calm music', 'insane clown posse music only', 'eminem', 'asmongold']; // Array of suggested YouTubers
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
			videoName = "${searchTypeTerm} ${defaultYoutuber} videos ${currentyear}";
		}
		
		console.log(videoName); // This will print something like "Latest Trending suicideboys videos 2025"
		console.log("Searching for video:", videoName); // Debugging log

		// Before setting iframe src, store the video name in sessionStorage
		sessionStorage.setItem('videoName', videoName);
		sessionStorage.setItem('${userName}_messageInput', AsciiText);
		// Generate the URL with the iframe
		const updatedButtonHTML = matchedCommand.buttonHTML.replace(/{index}/g, index)
			.replace(
				/"src="https:\/\/www\.afterlifereloaded\.com\/AfterlifeReloadedRoot\/html\/googleytsearch\.html"/,
				`"src="https://www.afterlifereloaded.com/AfterlifeReloadedRoot/html/googleytsearch.html?videoName=${encodeURIComponent(videoName)}"`
			);

		appendAIMessage("", userAI, updatedButtonHTML);
		userInput.value = ''; // Clear input field	

		//console.log(Generated URL: https://www.afterlifereloaded.com/AfterlifeReloadedRoot/html/googleytsearch.html?videoName=${encodeURIComponent(videoName)});
		return true; // Command successfully handled
	}
	return false;
}

async function storeAIResponse(inputValue) {
    const userName = sessionStorage.getItem('username'); // Ensure userName is retrieved properly

    try {
        // Wait for the AI response before setting it in sessionStorage
	const exampleText = "Hello, ${userName}, I have completed the task based on your prompt " + inputValue;
	const newAIResponse = await sendMessage("make a repsonse like this example: " + exampleText + " Do not try to perform the task.", false, false);
        
        // Store the resolved response
        sessionStorage.setItem("handleCmdAIResponse_" + userName, newAIResponse.replace("{inputValue}", inputValue));
		if (inputValue.includes("```c") || inputValue.includes("```c++") || inputValue.includes("```csharp")) {
			inputValue = inputValue.replace(/```c(\+\+|sharp)?/g, "```gsc");
		}     
        console.log("AI Response Stored:", newAIResponse);
    } catch (error) {
        console.error("Error storing AI response:", error);
    }
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
