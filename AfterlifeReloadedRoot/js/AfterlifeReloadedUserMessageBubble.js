// Retrieve user-related data from sessionStorage with fallback values
const userCurrentName = sessionStorage.getItem('username') || 'DefaultName';
const userCurrentClantag = sessionStorage.getItem('clantag') || '[DefaultClan]';
const userCurrentProfilPic = sessionStorage.getItem('userProfileImage') || 'default-profile-pic.jpg';
let oldMessage = "";

function appendUserMessage(message) {
    const scrollablePanel = document.querySelector('.scrollable-panel');
    const userResponseDiv = document.createElement('div');
    userResponseDiv.className = 'response-container user-response';
	oldUserInput = oldMessage;
	oldMessage = message;
	
	sessionStorage.setItem('${userCurrentName}_messageInput', message);
    // Use session storage values directly
    userResponseDiv.innerHTML = `
        <div class="panel">
            <img src="${userCurrentProfilPic}" alt="User Picture">
            <div id="${userCurrentName}_${generateUniqueId("userbubbleName")}" class="username">${userCurrentClantag} ${userCurrentName}</div>
            <div class="message-content">
                <br>${message}
            </div>
        </div>`;

    scrollablePanel.appendChild(userResponseDiv);
    //scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
}

// Function to update all username elements (optional)
function updateUsernames() {
    const usernameElements = document.querySelectorAll('.username');
    usernameElements.forEach((element) => {
        element.textContent = `${userCurrentClantag} ${userCurrentName}`;
    });
}
