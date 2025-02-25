const titleElement = document.getElementById('title-text');
const messages = [
    "Welcome to: ",
	"Afterlife Reloaded",
	"Afterlife Reloaded v7 😎",
    "Afterlife is updated daily! 😎",
    "Login to afterlife reloaded v7",
	"Updated last: 2/11/2025",
	"Enjoy your stay.."
	
]; // Array of messages to cycle through

let messageIndex = 0;  // To track the current message
let charIndex = 0;      // To track the current character in the message
const typingSpeed = 50; // Typing speed in ms
const deletingSpeed = 30; // Speed for deleting characters
const pauseTime = 1000; // Pause time after full message

function typeText() {
    charIndex = 0; // Reset character index
    let lastTime = 0;
    let currentMessage = messages[messageIndex];

    function typingLoop(time) {
        if (time - lastTime >= typingSpeed) {
            if (charIndex < currentMessage.length) {
                // Add next character of the current message
                titleElement.textContent = currentMessage.substring(0, charIndex + 1);
                document.title = titleElement.textContent; // Update tab title
                charIndex++;
            } else {
                // Once full message is typed, wait before deleting
                setTimeout(deleteText, pauseTime);
                return;
            }
            lastTime = time;
        }
        requestAnimationFrame(typingLoop);
    }

    function deleteText() {
        let lastDeleteTime = 0;

        function deletingLoop(time) {
            if (time - lastDeleteTime >= deletingSpeed) {
                if (charIndex > 0) {
                    // Remove one character at a time
                    titleElement.textContent = currentMessage.substring(0, charIndex - 1);
                    document.title = titleElement.textContent;
                    charIndex--;
                } else {
                    // Once deletion is complete, switch to the next message
                    messageIndex = (messageIndex + 1) % messages.length;
                    setTimeout(typeText, 500); // Small delay before next message
                    return;
                }
                lastDeleteTime = time;
            }
            requestAnimationFrame(deletingLoop);
        }
        requestAnimationFrame(deletingLoop);
    }

    requestAnimationFrame(typingLoop);
}

typeText(); // Start the typing loop
