const link = document.querySelector('.footer-text a.glow');

// Expanded color palette for smoother transitions
const colors = [
    'rgb(255, 87, 51)', 
    'rgb(255, 165, 0)', 
    'rgb(255, 255, 51)',
    'rgb(51, 255, 87)', 
    'rgb(51, 204, 255)',
    'rgb(51, 87, 255)', 
    'rgb(153, 51, 255)',
    'rgb(240, 51, 255)',
    'rgb(255, 51, 166)',
    'rgb(240, 255, 51)' 
];

let colorIndex = 0; // Current color index
let colorInterval; // Variable to store the color changing interval

link.addEventListener('mouseover', function() {
    // Start changing the glow color
    colorInterval = setInterval(() => {
        // Get the next color and cycle back if needed
        const currentColor = colors[colorIndex];
        link.style.textShadow = `0 0 5px ${currentColor}, 0 0 10px ${currentColor}, 0 0 15px ${currentColor}`; // Change glow
        colorIndex = (colorIndex + 1) % colors.length; // Move to the next color, looping back to start
    }, 300); // Change color every 300 ms for smoother transition
});

link.addEventListener('mouseout', function() {
    // Reset the glow effect when not hovering
    clearInterval(colorInterval); // Stop the color changing interval
    link.style.textShadow = '0 0 5px rgba(255, 255, 0, 0), 0 0 10px rgba(255, 255, 0, 0), 0 0 15px rgba(255, 255, 0, 0)'; // Reset glow
});