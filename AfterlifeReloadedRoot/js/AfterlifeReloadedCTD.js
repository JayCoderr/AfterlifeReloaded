function updateDateTime() {
    const now = new Date();
    
    const hours = now.getHours() % 12 || 12; // Convert 24-hour to 12-hour format
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Add leading zero to minutes if needed
    const ampm = now.getHours() >= 12 ? 'pm' : 'am'; // Determine AM/PM and make it lowercase

    const timeString = `${hours}:${minutes} ${ampm}`; // Format time as 8:32 am
    document.getElementById('date-time').textContent = timeString;
}

// Call the function to set the time on page load
updateDateTime();

// Update the time every second continuously
setInterval(updateDateTime, 1000);