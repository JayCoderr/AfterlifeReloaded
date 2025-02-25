document.addEventListener("DOMContentLoaded", function () {
	// Ensure the button exists before attaching the event
	const button = document.getElementById("sendTestEmailBtn");
	if (button) {
		button.addEventListener("click", function () {
			// Send the request to the PHP script
			fetch("AfterlifeReloadedRoot/php/sendemail.php")
				.then(response => response.text())  // Get the response text
				.then(data => {
					// Show response on the page
					document.getElementById("responseMessage").textContent = data;  // Display the success/failure message
				})
				.catch(error => {
					console.error("Error:", error);
					document.getElementById("responseMessage").textContent = "An error occurred while sending the email.";
				});
		});
	}
});