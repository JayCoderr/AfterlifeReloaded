let messages = [];
const messageElement = document.getElementById('message');
const imageElement = document.getElementById('message-image');
let currentMessageIndex = null; // Index of the selected message
let isTyping = false; // Flag to indicate if typing is in progress

// Fetch messages from the JSON file
fetch('/AfterlifeReloadedRoot/json/messages.json')
    .then(response => response.json())
    .then(data => {
        messages = data; // Assign fetched data to messages array
        if (messages.length > 0) {
            currentMessageIndex = getRandomIndex(); // Select a random message index on load
            typeMessage(); // Start typing the selected message
        }
    })
    .catch(error => console.error('Error fetching messages:', error));

function getRandomIndex() {
    return Math.floor(Math.random() * messages.length); // Generate a random index
}

function typeMessage() {
    if (isTyping) return; // Exit if already typing

    const message = messages[currentMessageIndex]; // Select the message from the initial random index
    if (!message) return; // Early exit if no message is available

    imageElement.src = message.img; // Set the image
    messageElement.innerHTML = ''; // Clear previous message

    let index = 0; // Track the character index
    isTyping = true; // Set the typing flag to true

    const typeInterval = setInterval(() => {
        if (index < message.text.length) {
            messageElement.innerHTML += message.text.charAt(index); // Add character to the message
            index++; // Move to the next character
        } else {
            clearInterval(typeInterval); // Stop typing when done
            isTyping = false; // Reset the typing flag

            // Set a timeout before retyping the same message
            setTimeout(() => {
                messageElement.innerHTML = ''; // Clear the message before retyping
                typeMessage(); // Start typing the same message again
            }, 2000); // Pause for 2 seconds before retyping
        }
    }, 100); // Typing speed (100ms per character)
}

// Start typing the selected message on window load
window.onload = () => {
    if (messages.length > 0) {
        typeMessage(); // Start typing the selected message
    }
};