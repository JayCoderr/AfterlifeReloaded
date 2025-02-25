function countdownTo2025() {
    const targetDate = new Date('October 8, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const timeDifference = targetDate - now;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24) + 5);
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) + 420);
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Display the result in the countdown div
    document.getElementById('countdown').innerHTML = 
        "Releasing in: " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is finished
    if (timeDifference < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = "We are now releasing!";
    }
}

// Update the countdown every 1 second
const countdownInterval = setInterval(countdownTo2025, 1000);