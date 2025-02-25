    function sendMessage() {
        const userInput = document.getElementById('user-input').value;
        if (userInput.trim() === "") return; // Prevent sending empty messages

        // User message panel
        const userMessagePanel = document.createElement('div');
        userMessagePanel.classList.add('message-panel', 'user-message');

        // User profile image
        const userProfileImageUrl = "https://iili.io/d4GU8hB.gif";

        // Create user message bubble with profile image
        userMessagePanel.innerHTML = `
            <div class="message-content">
                <img src="${userProfileImageUrl}" alt="User Profile" class="profile-image">
		<strong>User</strong>
		<hr>
                <p>${userInput}</p>
            </div>
        `;

        // Append the user message to the message area
        document.getElementById('message-area').appendChild(userMessagePanel);
        document.getElementById('user-input').value = ''; // Clear the input

        const messageArea = document.getElementById('message-area');
        messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom

        // Simulate AI response after 1 second
        setTimeout(function () {
            const aiMessagePanel = document.createElement('div');
            aiMessagePanel.classList.add('message-panel', 'ai-message');

            // AI profile image URL
            const aiProfileImageUrl = "https://iili.io/JpY9axp.jpg";

            let messageContent = "<p>Hello! How can I assist you today?</p>"; // Default message

            // Determine the AI response content based on the user input
            if (userInput.toLowerCase().includes("youtube")) {
                messageContent = `
                    <p>Here is a YouTube video:</p>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/YoeYUynoCTc"
                    title="YouTube Video" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
                    picture-in-picture" allowfullscreen></iframe>
                `;
            } else if (userInput.toLowerCase().startsWith("iframe https://")) {
                const url = userInput.split(" ")[1];
                messageContent = `
                    <p>Here is the content from the provided URL:</p>
                    <iframe width="560" height="315" src="${url}"
                    frameborder="0" allowfullscreen></iframe>
                `;
            }

            // AI message bubble with profile image
            aiMessagePanel.innerHTML = `
                <div class="message-content">
                    <img src="${aiProfileImageUrl}" alt="AI Profile" class="profile-image">
                    <strong>AI:</strong>
                    ${messageContent}
                </div>
            `;

            // Append the AI message to the message area
            document.getElementById('message-area').appendChild(aiMessagePanel);
            messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom
        }, 1000);
    }

    document.getElementById('user-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });