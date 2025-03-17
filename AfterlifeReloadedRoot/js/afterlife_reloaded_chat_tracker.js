async function updateConversationHistory()
{
	const sessionIdKey = 'uniqueid';
    let uniqueId = sessionStorage.getItem(sessionIdKey);

    if (!uniqueId) {
        uniqueId = generateUniqueId('AfterlifeReloaded');
        sessionStorage.setItem(sessionIdKey, uniqueId);
        console.log('New conversation started with ID:', uniqueId);
    } else {
        console.log('Continuing with existing conversation ID:', uniqueId);
    }
    updateConversation();
}

let lastSentConversation = "";

function updateConversation() {	
    const uniqueId = sessionStorage.getItem('uniqueid');
    if (!uniqueId) return console.error("No unique session ID found.");

    const date = new Date().toISOString();
    const userNameResponse = sessionStorage.getItem('username') || "UnknownUser";
    const subject = "Sample Subject";

    // Sanitize input
    const formattedUserMessage = oldUserInput.trim().trimEnd().trimStart();
    const formattedAIResponse = oldAIResponse.trim().trimEnd().trimStart();
    
    // Format the conversation
    const newConversation = `${formattedUserMessage}####${formattedAIResponse}####${subject}####${userNameResponse}####${date}####${uniqueId}`;

    // Log formatted conversation for debugging
    console.log("Formatted Conversation:", newConversation); // Debug log

    // Check if the current conversation is the same as the last sent one
    if (newConversation !== lastSentConversation) {
        lastSentConversation = newConversation; // Update the global variable
        console.log("Sending conversation to backend...");

        // Send conversation data to backend
        fetch('/AfterlifeReloadedRoot/html/save_conversation.php', {
            method: 'POST',
            body: JSON.stringify({ conversation: newConversation }),
            headers: { 'Content-Type': 'application/json' },
        }).then(() => console.log('Conversation saved successfully.'))
          .catch(error => console.error('Error storing conversation:', error));
    } else {
        console.log("Duplicate message detected, not sending.");
    }
}
