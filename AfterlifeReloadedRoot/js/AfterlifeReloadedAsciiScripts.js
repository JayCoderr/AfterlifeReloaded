// Retrieve the sessionStorage item using the ID
const userName = sessionStorage.getItem('username');
const handleAIResponse = sessionStorage.getItem("handleCmdAIResponse_" + userName);
const aiusernamex = sessionStorage.getItem('aiusername');
let defaultOption = "";
let fontSelect = "";
		
// Check if the response exists in sessionStorage
if (handleAIResponse) 
{
	console.log("Retrieved AI response from sessionStorage:", handleAIResponse);
} 
else 
{
	console.log("No response found.");
}	
// Function to load fonts dynamically
function loadFonts() {
    return new Promise((resolve, reject) => {
        fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/list-fonts.php')
            .then(response => response.json())  // Return JSON response
            .then(fonts => {
                fontSelect = document.getElementById('fontSelect');
                fontSelect.innerHTML = '';  // Clear any existing options

                // Default option for 'Standard'
                defaultOption = document.createElement('option');
                defaultOption.value = 'Standard';
                defaultOption.textContent = 'Standard';
                fontSelect.appendChild(defaultOption);

                // Populate the dropdown with font names
                fonts.forEach(font => {
                    const fontName = font.replace('.flf', '');  // Remove the .flf extension for display
                    const option = document.createElement('option');
                    option.value = font;  // Use the full font file name (including .flf)
                    option.textContent = fontName;  // Display the name without .flf
                    fontSelect.appendChild(option);
                });

                // Save the fonts list for later use
                window.availableFonts = fonts;
                resolve(fonts);  // Resolve with the loaded fonts
            })
            .catch(error => {
                console.error('Error loading fonts:', error);
                reject(error);  // Reject if an error occurs
            });
    });
}

// Typing effect function
function simulateTyping(text, element, speed = 10) {
    let i = 0;
    element.textContent = '';  // Clear previous content
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Wait for the figlet script to be loaded before running the function
window.onload = function() 
{
    loadFonts();

    // Get the asciiToGen from session storage or default to "test"
    let asciiToGen = sessionStorage.getItem("${userName}_messageInput");
    if (!asciiToGen || asciiToGen.trim() === "") {
        asciiToGen = ""; // Default to "test" if no valid asciiToGen is found
    }

    // If a valid asciiToGen exists in the session, auto-fill the word input
    document.getElementById('wordInput').value = asciiToGen;

    // Automatically trigger the ASCII art generation if the session has a valid asciiToGen
	typeOutAIResponse();//type ai response before generating the ascii
    generateAsciiArt(asciiToGen, false);
    
    // Event listener for generating ASCII art
    document.getElementById('generateBtn').addEventListener('click', function() 
	{
		var word = document.getElementById('wordInput').value;
	
		// If the word input is empty, use the session value or default asciiToGen
		if (!word) {
			word = asciiToGen;
		}
	
		var selectedFont = document.getElementById('fontSelect').value;
	
		// Remove the .flf extension from the selected font before passing to figlet
		const fontWithoutExtension = selectedFont.replace('.flf', '');

		// Generate ASCII art using FIGlet
		figlet.defaults({ fontPath: 'https://www.afterlifereloaded.com/AfterlifeReloadedRoot/libs/figlet.js-1.8.0/fonts/' });
		figlet.text(word, { font: fontWithoutExtension }, function (err, asciiArt) 
		{
			if (err) 
			{
				console.error(err);
				document.getElementById('ascii-output').textContent = 'Error generating ASCII Art';
				return;
			}
			// Simulate typing effect
			simulateTyping(asciiArt, document.getElementById('ascii-output'));
		});
	});
	
	async function typeOutAIResponse() {
		let userName = sessionStorage.getItem('username');
		let userInputMessage = sessionStorage.getItem("${userName}_messageInput");
		userInputMessage = userInputMessage
		.replace("of your name", aiusernamex)
		.replace("of my name", userName);
	
		try {
			console.log("Generating ASCII Art...");
			let asciiArt = await generateAsciiArt(userInputMessage, true);
	
			let inputValue = [
				"make this response and use the variables provided: Hello, {userName}, I am generating the ASCII based on your prompt: {userInputMessage},\n" +
				"```ascii\n{ascii}\n```",
			
				"make this response and use the variables provided: Hi {userName}, here is the ASCII art based on your input: {userInputMessage}. Here's the result:\n" +
				"```ascii\n{ascii}\n```",
			
				"make this response and use the variables provided: Greetings {userName}! Your request: '{userInputMessage}' has been processed. Check out the ASCII below:\n" +
				"```ascii\n{ascii}\n```",
			
				"make this response and use the variables provided: Hey {userName}, you've asked for ASCII art of '{userInputMessage}'. Here's the result:\n" +
				"```ascii\n{ascii}\n```",
			
				"make this response and use the variables provided: Hello {userName}, based on your input '{userInputMessage}', here's the ASCII output:\n" +
				"```ascii\n{ascii}\n```"
			];
			
			// Generate a random index to select a message
			const randomIndex = Math.floor(Math.random() * inputValue.length);
			
			// Select a random message
			const selectedMessage = "be sarcastic about the user not interacting with the chat for a while{newline}and you must use the provided variables: {username} for the user{newline}here what the user recently asked about {oldaimessageresponse}{newline}don't act like they are here{newline}they still have yet to return{newline}be as unique as you can be with every response please while maintaining variables provided {username} {newline} {oldaimessageresponse} {newline}in responses and other things as needed to be unique";
			
			// Replace the placeholders with the actual values
			const finalMessage = selectedMessage
	
			console.log("Input value for AI response:", inputValue);
	
			const response = await fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/AfterlifeReloadedBack.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams({ inputText: finalMessage })
			});
	
			console.log("Response status:", response.status);
	
			if (!response.ok) {
				throw new Error(`Server returned error: ${response.statusText}`);
			}
	
			const rawResponse = await response.text();
			console.log("Raw response before JSON parsing:", rawResponse);
	
			const responseJson = JSON.parse(rawResponse);
			let aiResponse = responseJson.choices?.[0]?.message?.content || "No response";
	
			aiResponse = aiResponse				
			    .replace("{userName}", userName)
				.replace("{userInputMessage}", userInputMessage)
				.replace("{ascii}", asciiArt)
				.replace("ascii", "")
				.replace("```", "```ascii");
	
			console.log("AI Response after replacements:", aiResponse);
	
			// Extract ASCII art from the AI response
			let asciiContent = aiResponse.match(/```ascii\n([\s\S]*?)\n```/);
			let extractedAscii = asciiContent ? asciiContent[1] : "No ASCII Art found";
	
			// Remove the ASCII part from the aiResponse and update the #asciiaimessage element
			const asciiRemovedResponse = aiResponse.replace(/```ascii\n([\s\S]*?)\n```/, '');
	
			// Type out the AI message first
			const asciiAiMessageElement = document.getElementById('asciiaimessage');
			asciiAiMessageElement.textContent = '';  // Clear previous content
			await typeOutText(asciiAiMessageElement, asciiRemovedResponse);
	
			// After the AI message is typed, type out the ASCII art
			const asciiOutputElement = document.getElementById('ascii-output');
			asciiOutputElement.textContent = '';  // Clear previous content
			await typeOutText(asciiOutputElement, extractedAscii);
	
		} catch (error) {
			console.error("Error fetching AI response:", error);
		}
	}
	
	// Function to simulate typing effect
	async function typeOutText(element, text) {
		for (let i = 0; i < text.length; i++) {
			element.textContent += text[i];
			await new Promise(resolve => setTimeout(resolve, 5)); // Adjust speed (ms) for smooth typing
		}
	}

};
// Function to generate ASCII art based on word
async function generateAsciiArt(word, isRandomFont) {
    try {
        // Load the list of fonts if not already loaded
        let fonts = window.availableFonts || [];
        if (fonts.length === 0) {
            console.log('Fonts not loaded, loading fonts...');
            fonts = await loadFonts();  // Wait for the fonts to be loaded
        }

        // Choose font based on isRandomFont
        let selectedFont;
        if (isRandomFont) {
            // Pick a random font from the list and try until successful
            let success = false;
            let attempts = 0;
            while (!success && attempts < fonts.length) {
                // Pick a random font from the list
                selectedFont = fonts[Math.floor(Math.random() * fonts.length)] || 'Standard';
                try {
                    await generateAsciiWithFont(word, selectedFont); // Try generating with the selected font
                    success = true; // If no error, mark as successful
                } catch (err) {
                    console.error(`Error with font ${selectedFont}, trying another font...`);
                    attempts++;
                }
            }

            if (!success) {
                console.error('Failed to generate ASCII Art with any font');
                return "Error generating ASCII Art";
            }

            let fontDropDown = document.getElementById('fontSelect');
            fontDropDown.value = selectedFont;
        } else {
            // Use the selected font from the dropdown
            selectedFont = document.getElementById('fontSelect').value || 'Standard';
        }

        figlet.defaults({ fontPath: 'https://www.afterlifereloaded.com/AfterlifeReloadedRoot/libs/figlet.js-1.8.0/fonts/' });
        return new Promise((resolve, reject) => {
            figlet.text(word, { font: selectedFont.replace('.flf', '') }, function (err, asciiArt) {
                if (err) {
                    console.error(err);
                    reject('Error generating ASCII Art');
                } else {
                    resolve(asciiArt);
                }
            });
        });

    } catch (error) {
        console.error("Error in generateAsciiArt:", error);
        return "Error generating ASCII Art";
    }
}

// Helper function to generate ASCII Art with a specific font and throw error if it fails
function generateAsciiWithFont(word, font) {
    return new Promise((resolve, reject) => {
        figlet.text(word, { font: font.replace('.flf', '') }, function (err, asciiArt) {
            if (err) {
                reject(`Error with font ${font}`);
            } else {
                resolve(asciiArt);
            }
        });
    });
}
