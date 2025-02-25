const responses = [
    "Welcome to Afterlife Reloaded 7.0,",
    "This is an AI that can do the following:<br><br> Generate user responses,<br> Generate images, code, mods, etc.",
    "I will keep you updated daily,<br> you can check here for any updates.",
    "Thank you for checking out the website.",
    "Cleaned the login/welcome page up more.",
    "Cleaned the about page more.",
    "Cleaned the AI's page up more.",
    "Added more scripts to various things.",
    "Only users with dev/early access are allowed to log in at the moment.",
    "I plan to try to push this out,<br>Before the time runs out.<br> It just depends on how long it takes to design and code it.",
    "The desktop version will not be automatically released,<br> as it needs to be rebuilt.",
    "We've integrated new features to enhance user experience,<br>including a faster response time.",
    "Your feedback is invaluable; feel free to share your thoughts!",
    "Updates will be rolling out frequently,<br>stay tuned for more exciting features!",
    "We've improved the backend for better performance,<br>making interactions smoother.",
    "Don't forget to check the changelog for detailed updates!",
    "New tutorials and guides will be available soon,<br>helping you maximize your usage.",
    "Explore the new AI capabilities and let us know what you think!",
    "We're constantly working to improve, so stay connected!<br> Your support makes a difference.",
    "Exciting collaborations are on the horizon,<br>bringing you even more innovative tools!",
    "Thank you for being a part of the Afterlife community!"
];
let currentResponseIndex = 0; // Start with the first response
function typeMessage(message, index = 0) {
    const messageTextElement = document.getElementById('message-text');
    // Clear the message text before typing
    messageTextElement.innerHTML = ''; // Use innerHTML to allow HTML tags
    
    // Recursive function to simulate typing effect
    function typeChar() {
        if (index < message.length) {
            if (message.charAt(index) === '<') {
                // Handle the case for HTML tags
                const tagEndIndex = message.indexOf('>', index) + 1;
                if (tagEndIndex > 0) {
                    // Add the whole tag to innerHTML
                    messageTextElement.innerHTML += message.substring(index, tagEndIndex);
                    index = tagEndIndex; // Move index past the tag
                }
            } else {
                // Add regular characters to innerHTML
                messageTextElement.innerHTML += message.charAt(index);
                index++;
            }
            setTimeout(typeChar, 100); // Adjust typing speed here
        } else {
            setTimeout(() => {
                currentResponseIndex = (currentResponseIndex + 1) % responses.length; // Loop through responses
                typeMessage(responses[currentResponseIndex]); // Call typing function for the next response
            }, 2000); // Pause before starting the next message
        }
    }
    typeChar(); // Start typing the first character
}
// Start the typing effect with the first response
typeMessage(responses[currentResponseIndex]);