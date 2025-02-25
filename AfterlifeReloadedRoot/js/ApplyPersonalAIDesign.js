// Function to apply the color to all matching elements
function applyBackgroundColorToElements(selectors, baseRgba) {
    selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            element.style.backgroundColor = baseRgba;
        });
    });
}

// Function to update the color for multiple elements dynamically with hover & hue adjustment
function updateElementColors() {
    const elementsConfig = {
        '.navbar': { alpha: 0, hover: null, hueShift: 0 },
        '.user-response .panel': { alpha: 0, hover: null, hueShift: 0 },
        '.ai-response .panel': { alpha: 0, hover: null, hueShift: 0 },
        '.user-input input': { alpha: 0, hover: null, hueShift: 250 },
        '.aiusername': { alpha: 0.3, hover: null, hueShift: 250 },
        '.username': { alpha: 0.3, hover: null, hueShift: 250 },
        '.footer': { alpha: 0, hover: null, hueShift: 0 },
        '.render-html-button': { alpha: 0, hover: null, hueShift: 250 },
        '.rich-textbox': { alpha: 0.6, hover: null, hueShift: 0 },
        '.settings-btn': { alpha: 0.3, hover: null, hueShift: 250 },
        '.hud-panel': { alpha: 0.5, hover: null, hueShift: 0 },
        '.tab': { alpha: 0.5, hover: null, hueShift: 250 },
        '.tab.active': { alpha: 0.7, hover: null, hueShift: 250 },
		'.tab.active': { alpha: 0.7, hover: null, hueShift: 250 },
        '.close-btn': { alpha: 0.7, hover: null, hueShift: 250 }
    };

    // Retrieve stored color or fallback to default
    const baseRgba = sessionStorage.getItem('baseRgba') || 'rgba(255, 255, 255, 0.8)';

    // Extract RGB and Alpha values
    const rgbaMatch = baseRgba.match(/\d+/g);
    if (!rgbaMatch) return;

    const r = parseInt(rgbaMatch[0]), g = parseInt(rgbaMatch[1]), b = parseInt(rgbaMatch[2]);
    const originalAlpha = parseFloat(rgbaMatch[3]) / 255 || 0.8;

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }
        return [h, s, l];
    }

    // Convert HSL to RGB
    function hslToRgb(h, s, l) {
        let r, g, b;

        function hueToRgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hueToRgb(p, q, h / 360 + 1 / 3);
            g = hueToRgb(p, q, h / 360);
            b = hueToRgb(p, q, h / 360 - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // Convert base RGB to HSL
    const [baseHue, baseSat, baseLight] = rgbToHsl(r, g, b);

    // Apply colors and hover effects
    Object.entries(elementsConfig).forEach(([selector, config]) => {
        document.querySelectorAll(selector).forEach((element) => {
            let alpha = config.alpha === 0 ? originalAlpha : config.alpha;
            const defaultColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            // Apply hue shift for hover
            const hoverHue = baseHue + config.hueShift;
            const [hoverR, hoverG, hoverB] = hslToRgb(hoverHue, baseSat, baseLight);
            const hoverColor = config.hover ?? `rgba(${hoverR}, ${hoverG}, ${hoverB}, ${alpha})`;

            element.style.backgroundColor = defaultColor;

            // Apply hover effect
            element.addEventListener("mouseover", () => element.style.backgroundColor = hoverColor);
            element.addEventListener("mouseout", () => element.style.backgroundColor = defaultColor);
        });
    });

    // Set up a MutationObserver to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Ensure the node is an element
                    Object.entries(elementsConfig).forEach(([selector, config]) => {
                        if (node.matches(selector) || node.querySelector(selector)) {
                            let alpha = config.alpha === 0 ? originalAlpha : config.alpha;
                            const defaultColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                            
                            const hoverHue = baseHue + config.hueShift;
                            const [hoverR, hoverG, hoverB] = hslToRgb(hoverHue, baseSat, baseLight);
                            const hoverColor = config.hover ?? `rgba(${hoverR}, ${hoverG}, ${hoverB}, ${alpha})`;

                            if (node.matches(selector)) {
                                node.style.backgroundColor = defaultColor;
                                node.addEventListener("mouseover", () => node.style.backgroundColor = hoverColor);
                                node.addEventListener("mouseout", () => node.style.backgroundColor = defaultColor);
                            } else {
                                node.querySelectorAll(selector).forEach((child) => {
                                    child.style.backgroundColor = defaultColor;
                                    child.addEventListener("mouseover", () => child.style.backgroundColor = hoverColor);
                                    child.addEventListener("mouseout", () => child.style.backgroundColor = defaultColor);
                                });
                            }
                        }
                    });
                }
            });
        });
    });

    // Observe changes in the entire document body
    observer.observe(document.body, { childList: true, subtree: true });
}

// Apply background colors based on default or modified alpha values
function applyBackgroundColorToElements(selectors, baseRgba, modifiedAlphaSelectors, r, g, b, originalAlpha) {
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            let alpha = modifiedAlphaSelectors[selector] ?? originalAlpha; // Use modified alpha if applicable

            // Construct final RGBA color
            const newColor = modifiedAlphaSelectors[selector] 
                ? `rgba(${r}, ${g}, ${b}, ${alpha})` // Apply modified alpha
                : baseRgba; // Keep original color

            element.style.backgroundColor = newColor;
        });
    });
}

// Call the function to update colors on page load or dynamically
updateElementColors();
