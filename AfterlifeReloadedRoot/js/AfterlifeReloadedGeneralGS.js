const title = "Afterlife AI 7.0";
const titleElement = document.getElementById("navbar-title");
const pageTitleElement = document.querySelector("title");

async function typeTitle() {
    while (true) {
        // Type out the title
        for (const char of title) {
            titleElement.textContent += char;
            pageTitleElement.textContent += char;
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Pause after fully typing the text
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Delete text character by character (simulating backspacing)
        for (let i = title.length; i > 0; i--) {
            titleElement.textContent = title.substring(0, i - 1);
            pageTitleElement.textContent = title.substring(0, i - 1);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Pause before starting again
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
typeTitle();

function updateDateTime() {
    const now = new Date();
    
    const hours = now.getHours() % 12 || 12; // Convert 24-hour to 12-hour format
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Add leading zero to minutes if needed
    const ampm = now.getHours() >= 12 ? 'pm' : 'am'; // Determine AM/PM and make it lowercase

    return `${hours}:${minutes} ${ampm}`; // Format time as 8:32 am
}
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
    }
    if (e.key === 'F12') {
        e.preventDefault();
    }
});
async function verifyLoginStatus() {
    try {
        const response = await fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/IsVerified.php', {
            method: 'GET',
            credentials: 'include'
        });

        const result = await response.json();
        
        // Fetch sessionStorage values
        const userIsLoggedIn = sessionStorage.getItem('isLoggedIn');
        const userName = sessionStorage.getItem('username');
        const userClan = sessionStorage.getItem('clantag');
        const userEmail = sessionStorage.getItem('email');
        const userAI = sessionStorage.getItem('aiusername');
        const userImage = sessionStorage.getItem('userProfileImage');
        const userAIImage = sessionStorage.getItem('aiProfileImage');
        const userBackgroundImage = sessionStorage.getItem('userBackgroundImage');
        const userBaseRgb = sessionStorage.getItem('baseRgba');
		
        // Adjust the check based on result.isLoggedIn
		
        if (userIsLoggedIn === 'true') {
		console.log(`
		Userlogin Status: ${userIsLoggedIn}
		Username: ${userName}
		Usertag: ${userClan}
		Useremail: ${userEmail}
		UserAI: ${userAI}
		UserImage: ${userImage}
		UserAIImage: ${userAIImage}
		UserBackgroundImage: ${userBackgroundImage}
		UserBaseRgb: ${userBaseRgb}
		`);
		
		console.log(`
			welcome to
		 █████╗ ███████╗████████╗███████╗██████╗ ██╗     ██╗███████╗███████╗
		██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗██║     ██║██╔════╝██╔════╝
		███████║█████╗     ██║   █████╗  ██████╔╝██║     ██║█████╗  █████╗  
		██╔══██║██╔══╝     ██║   ██╔══╝  ██╔══██╗██║     ██║██╔══╝  ██╔══╝  
		██║  ██║██║        ██║   ███████╗██║  ██║███████╗██║██║     ███████╗
		╚═╝  ╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝     ╚══════╝
		still being developed changes may occure during this process.
		`);
        } else {
            console.log('User is not logged in, redirecting...');
            window.location.replace("https://www.afterlifereloaded.com/AfterlifeReloaded.html");
        }
    } catch (error) {
        console.error('Error verifying login status:', error);
        window.location.replace("https://www.afterlifereloaded.com/AfterlifeReloaded.html");
    }
}

document.addEventListener('DOMContentLoaded', verifyLoginStatus);
