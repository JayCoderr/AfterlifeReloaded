// Function to load fonts dynamically
function loadFonts() {
    fetch('https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/list-fonts.php')
        .then(response => response.json())
        .then(fonts => {
            const fontSelect = document.getElementById('fontSelect');
            fonts.forEach(font => {
                const fontName = font.replace('.flf', '');  // Remove the .flf extension for display
                const option = document.createElement('option');
                option.value = font;  // Use the full font file name (including .flf)
                option.textContent = fontName;  // Display the name without .flf
                fontSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading fonts:', error));
}

// Typing effect function
function simulateTyping(text, element, speed = 10) {
    let i = 0;
    element.textContent = '';  // Clear previous content
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Wait for the figlet script to be loaded before running the function
window.onload = function() {
    loadFonts();

    // Get the name from session storage or default to "test"
    let name = sessionStorage.getItem("AsciiText");
    if (!name || name.trim() === "") {
        name = "test"; // Default to "test" if no valid name is found
    }

    // If a valid name exists in the session, auto-fill the word input
    document.getElementById('wordInput').value = name;

    // Automatically trigger the ASCII art generation if the session has a valid name
    generateAsciiArt(name);
    
    // Event listener for generating ASCII art
    document.getElementById('generateBtn').addEventListener('click', function() {
        var word = document.getElementById('wordInput').value;

        // If the word input is empty, use the session value or default name
        if (!word) {
            word = name;
        }

        var selectedFont = document.getElementById('fontSelect').value;

        // Remove the .flf extension from the selected font before passing to figlet
        const fontWithoutExtension = selectedFont.replace('.flf', '');

        // Generate ASCII art using FIGlet
        figlet.defaults({ fontPath: 'https://www.afterlifereloaded.com/AfterlifeReloadedRoot/libs/figlet.js-1.8.0/fonts/' });
        figlet.text(word, { font: fontWithoutExtension }, function (err, asciiArt) {
            if (err) {
                console.error(err);
                document.getElementById('ascii-output').textContent = 'Error generating ASCII Art';
                return;
            }
            // Simulate typing effect
            simulateTyping(asciiArt, document.getElementById('ascii-output'));
        });
    });
};

// Function to generate ASCII art based on word
function generateAsciiArt(word) {
    var selectedFont = document.getElementById('fontSelect').value;

    // If no font is selected, set a default font
    if (!selectedFont) {
        selectedFont = 'Standard.flf'; // Set your default font
    }

    // Remove the .flf extension from the selected font before passing to figlet
    const fontWithoutExtension = selectedFont.replace('.flf', '');

    // Generate ASCII art using FIGlet
    figlet.defaults({ fontPath: 'https://www.afterlifereloaded.com/AfterlifeReloadedRoot/libs/figlet.js-1.8.0/fonts/' });
    figlet.text(word, { font: fontWithoutExtension }, function (err, asciiArt) {
        if (err) {
            console.error(err);
            document.getElementById('ascii-output').textContent = 'Error generating ASCII Art';
            return;
        }
        // Simulate typing effect
        simulateTyping(asciiArt, document.getElementById('ascii-output'));
    });
}