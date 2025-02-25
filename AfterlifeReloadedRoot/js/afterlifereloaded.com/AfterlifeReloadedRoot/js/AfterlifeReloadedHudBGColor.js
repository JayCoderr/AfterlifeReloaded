// Function to generate a random RGBA color
function getRandomColor() {
    // Generate random values for R, G, and B (0 to 255)
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    // Optional: Random value for A (alpha channel, between 0 and 1), or fixed transparency
    const a = 0.9; // Generates a number between 0 and 1 with two decimals

    // Return the random rgba color as a string
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const baseColor = `${getRandomColor()}`;

// Generate random box shadow with random color
const baseColorShadow = `${getRandomColor()}`;
const boxShadowStyle = `0px 4px 8px ${baseColorShadow}`;
const boxShadowStyleOffsetFix = `0px -4px 8px ${baseColorShadow}`;
const textShadowTest = `0 0 10px ${baseColorShadow}, 0 0 20px ${baseColorShadow}}`;

// List of elements with flags for 'applyGlow' and 'type' (1 for class, 2 for id, 0 for tag)
let elements = [
    { selector: 'TopBar', applyGlow: 1, type: 2, alpha: 1, borderRadius: '0px' },                // ID
    { selector: 'test-login-form', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' },       // ID
    { selector: 'user-image', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' },            // ID
    { selector: 'AIName', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' },                // ID
    { selector: 'message-text', applyGlow: 1, type: 2, alpha: 1, borderRadius: '5px' },          // ID
    { selector: 'date-time', applyGlow: 0, type: 2, alpha: 0, borderRadius: '25px' },             // ID
    { selector: 'test-username', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' },         // ID
    { selector: 'test-password', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' },         // ID
    { selector: 'login-test-button', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' },     // ID
    { selector: 'countdown', applyGlow: 1, type: 2, alpha: 1, borderRadius: '5px' },             // ID
    { selector: 'footerHud', applyGlow: 2, type: 2, alpha: 1, borderRadius: '0px' },             // ID
    { selector: 'footerText', applyGlow: 1, type: 2, alpha: 1, borderRadius: '5px' },            // ID
    { selector: 'navigationBar', applyGlow: 1, type: 2, alpha: 1, borderRadius: '0px' },         // ID
    { selector: 'navbarUL', applyGlow: 1, type: 2, alpha: 1, borderRadius: '0px' },              // ID
    { selector: 'AfterlifeReloadedAboutPanel', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' }, // ID
    { selector: 'ai-username', applyGlow: 1, type: 2, alpha: 1, borderRadius: '25px' },                 // ID
    { selector: 'aboutMessageBoard', applyGlow: 1, type: 2, alpha: 1, borderRadius: '15px' },        //ID
    { selector: 'AboutTitle', applyGlow: 3, type: 2, alpha: 0, borderRadius: '15px' },              //ID
    { selector: 'info-panel', applyGlow: 1, type: 1, alpha: 1, borderRadius: '25px' },            // Class
    { selector: 'footer-text', applyGlow: 0, type: 1, alpha: 1, borderRadius: '25px' },           // Class
    { selector: 'navbarUL', applyGlow: 1, type: 1, alpha: 1, borderRadius: '0px' },              // Class
    { selector: 'footer', applyGlow: 2, type: 1, alpha: 1, borderRadius: '25px' },                // Class
    { selector: 'video-container', applyGlow: 0, type: 1, alpha: 1, borderRadius: '25px' },       // Class
    { selector: 'button', applyGlow: 1, type: 0, alpha: 1, borderRadius: '25px' },                // Tag
    { selector: 'footer', applyGlow: 2, type: 0, alpha: 1, borderRadius: '5px' },                 // Tag
    { selector: 'title-text', applyGlow: 0, type: 2, alpha: 0, borderRadius: '0' },                 // Tag 
    { selector: 'openColorPicker', applyGlow: 1, type: 2, alpha: 1, borderRadius: '50px' }
];

// Loop through the array and apply background color and optional glow based on 'type'
elements.forEach(function(element) {
    let domElement;

    // Determine the type and get the element(s) accordingly
    if (element.type === 1) {
        // Select by class
        domElement = document.getElementsByClassName(element.selector);
    } else if (element.type === 2) {
        // Select by ID
        domElement = document.getElementById(element.selector);
    } else {
        // Select by tag or other selector
        domElement = document.getElementsByTagName(element.selector);
    }

    // Apply background and glow if it's a valid element or node list
    if (domElement) {
        if (domElement instanceof HTMLCollection || domElement instanceof NodeList) {
            // If it's a collection (like class or tag selectors), loop through all elements
            Array.from(domElement).forEach(function(el) {
                applyStyles(el, element);
            });
        } else {
            // If it's a single element (like ID), apply styles directly
            applyStyles(domElement, element);
        }
    }
});

// Helper function to apply styles based on 'applyGlow' and 'alpha'
function applyStyles(el, element) {
    // Determine the alpha value (0 for fully transparent, 0.9 for semi-transparent)
    const alpha = element.alpha === 1 ? 0.9 : 0;

    // Modify the base color with the determined alpha
    const backgroundColorWithAlpha = baseColor.replace(/rgba?\((\d+), (\d+), (\d+), \d+(\.\d+)?\)/, 
        `rgba($1, $2, $3, ${alpha})`);

    // Apply background color with the determined alpha
    el.style.backgroundColor = backgroundColorWithAlpha;

    // Conditionally apply the glow (box shadow) based on 'applyGlow'
    if (element.applyGlow === 1) {
        el.style.boxShadow = boxShadowStyle;
    }
    else if(element.applyGlow === 2){
        el.style.boxShadow = boxShadowStyleOffsetFix;
    }
    else if(element.applyGlow === 3){
         el.style.textShadow = textShadowTest;
    }
    else {
        el.style.boxShadow = 'none'; // No glow effect
    }
    el.style.borderRadius = element.borderRadius;
}