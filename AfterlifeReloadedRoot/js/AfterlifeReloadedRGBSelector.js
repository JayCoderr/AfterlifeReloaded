const elementsToChange = [
    '#TopBar', '#test-login-form', '#rgbaPicker', '#user-image', '#AIName', '#message-text',
    '#test-username', '#test-password', '#login-test-button', '#countdown', '#footerHud', 
    '#footerText', '#navigationBar', '#navbarUL', '#AfterlifeReloadedAboutPanel', '#ai-username', 
    '#aboutMessageBoard', '#AboutTitle', 
    '.info-panel', '.footer-text', '.navbarUL', '.footer', '.video-container',
    'button', 'footer', '.title-text'
];

const rgbaPicker = document.getElementById('rgbaPicker');
const openColorPickerButton = document.getElementById('openColorPicker');

// Show/Hide RGBA picker when the button is clicked
openColorPickerButton.addEventListener('click', (event) => {
    event.stopPropagation();      // Prevent event bubbling
    event.preventDefault();       // Prevent default action (e.g., form submission)
    
    // Toggle the visibility of the RGBA picker
    rgbaPicker.style.display = rgbaPicker.style.display === 'block' ? 'none' : 'block';
});

// Update color live and change button's background color
const sliders = document.querySelectorAll('.slider');
sliders.forEach(slider => {
    slider.addEventListener('input', updateColorsLive);
});

function updateColorsLive() {
    const r = document.getElementById('r').value;
    const g = document.getElementById('g').value;
    const b = document.getElementById('b').value;
    const a = document.getElementById('a').value;

    const color = `rgba(${r}, ${g}, ${b}, ${a})`;

    // Change button to reflect current color
    openColorPickerButton.style.backgroundColor = color;

    // Apply the color to all target elements
    elementsToChange.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.backgroundColor = color;
        });
    });
}

// Initial button color
openColorPickerButton.style.backgroundColor = '${baseColor}';