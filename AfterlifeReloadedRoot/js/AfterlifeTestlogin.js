document.getElementById('login-test-button').addEventListener('click', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.getElementById('test-username').value;
    const password = document.getElementById('test-password').value;

    try {
        // Sending login request to the server
        const response = await fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/AfterlifeUpdateUL.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
            credentials: 'include'
        });

        // Check if the login request was successful
        if (!response.ok) {
            console.error('Login request failed:', response.statusText);
            alert('Login failed. Please check your username and password.');
            return;
        }

        const data = await response.json(); // Parse the JSON response

        // Check if login is successful
        if (data.status === 'success') {
            console.log('Login Response Data:', data);

            // Check if 2FA is enabled (secretKey exists)
            if (data.secretKey) {
                // Retrieve the stored secret key from localStorage
                let storedSecretKey = localStorage.getItem('secretKey');

                // If no key is found or the stored key is different from the current key, update it
                if (!storedSecretKey || storedSecretKey !== data.secretKey) {
                    storedSecretKey = data.secretKey; // Set the new key
                    localStorage.setItem('secretKey', storedSecretKey); // Store it in localStorage
                    console.log("Updated Secret Key:", storedSecretKey);
                }

                // Generate QR code URL with the stored secret key
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/AfterlifeAI:${username}?secret=${storedSecretKey}&issuer=AfterlifeAI`;
                console.log("QR Code URL:", qrCodeUrl);

                // Display QR code for 2FA
                document.getElementById('qr-code-img').src = qrCodeUrl;
                document.getElementById('qr-code-img').style.display = 'block';
                document.getElementById('qr-code-container').style.display = 'block';

                // Prompt for OTP
                const otp = prompt("Please enter the OTP from your Google Authenticator app:");

                if (!otp) {
                    alert("OTP is required to continue.");
                    return;
                }

                try {
                    // Sending OTP verification request to the server
                    const otpResponse = await fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/verifyOTP.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: `username=${encodeURIComponent(username)}&otp=${encodeURIComponent(otp)}`,
                        credentials: 'include'
                    });

                    // Check OTP response
                    if (!otpResponse.ok) {
                        const errorText = await otpResponse.text();
                        console.error('OTP Request Failed:', errorText);
                        alert('OTP verification failed. Please try again.');
                        return;
                    }

                    const otpData = await otpResponse.json();
                    console.log('OTP Response Data:', otpData);

                    if (otpData.status !== 'success') {
                        alert('Invalid OTP. Please try again.');
                        return;
                    }

                    // Store session data only after OTP is verified
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('role', data.role);
                    sessionStorage.setItem('clantag', data.clantag);
                    sessionStorage.setItem('email', data.email);
                    sessionStorage.setItem('aiusername', data.aiusername);
                    sessionStorage.setItem('userProfileImage', data.userProfileImage);
                    sessionStorage.setItem('aiProfileImage', data.aiProfileImage);
                    sessionStorage.setItem('userBackgroundImage', data.userBackgroundImage);
                    sessionStorage.setItem('baseRgba', data.baseRgba);
					
					setUserData();

                    // Only redirect after session is set and OTP is verified successfully
                    window.location.replace("https://www.afterlifereloaded.com/AfterlifeAI.html");
					
					console.log("Session Storage Set: isLoggedIn ->", sessionStorage.getItem('isLoggedIn'));

                } catch (error) {
                    console.error("OTP Verification Error:", error);
                    alert("An error occurred while verifying OTP. Please try again.");
                }

            } else {
                // No 2FA required, proceed with normal login flow
                alert("Login successful!");

                // Store session data without OTP verification
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('role', data.role);
                sessionStorage.setItem('clantag', data.clantag);
                sessionStorage.setItem('email', data.email);
                sessionStorage.setItem('aiusername', data.aiusername);
                sessionStorage.setItem('userProfileImage', data.userProfileImage);
                sessionStorage.setItem('aiProfileImage', data.aiProfileImage);
                sessionStorage.setItem('userBackgroundImage', data.userBackgroundImage);
                sessionStorage.setItem('baseRgba', data.baseRgba);

                // Redirect without OTP
                window.location.replace("https://www.afterlifereloaded.com/AfterlifeAI.html");
            }

        } else {
            alert(data.message || 'An error occurred during login.');
            window.location.replace("https://www.afterlifereloaded.com/AfterlifeReloaded.html");
        }

    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred while processing your login. Please try again.');
    }
});

function setUserData() {
    setInterval(() => {
        userIsLoggedIn = sessionStorage.setItem('isLoggedIn', true);
        userRole = sessionStorage.setItem('role', data.role);
        userClan = sessionStorage.setItem('clantag', data.clantag);
        userEmail = sessionStorage.setItem('email', data.email);
        userAI = sessionStorage.setItem('aiusername', data.aiusername);
        userImage = sessionStorage.setItem('userProfileImage', data.userProfileImage);
        userAIImage = sessionStorage.setItem('aiProfileImage', data.aiProfileImage);
        userBackgroundImage = sessionStorage.setItem('userBackgroundImage', data.userBackgroundImage);
        userBaseRgb = sessionStorage.setItem('baseRgba', data.baseRgba);
    }, 10); // Runs every 500 milliseconds (0.5 seconds)
}
