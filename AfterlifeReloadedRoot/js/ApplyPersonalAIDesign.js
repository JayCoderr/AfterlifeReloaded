// Function to apply the color to all matching elements
function applyBackgroundColorToElements(selectors, baseRgba) {
    selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            element.style.backgroundColor = baseRgba;
        });
    });
}

function updateElementColors() {
    const elementsConfig = {
        '.navbar': { alpha: 0, hover: null, hueShift: 0, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.user-response .panel': { alpha: 0, hover: null, hueShift: 0, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.ai-response .panel': { alpha: 0, hover: null, hueShift: 0, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.user-input input': { alpha: 0, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.aiusername': { alpha: 0.3, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.username': { alpha: 0.3, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.footer': { alpha: 0, hover: null, hueShift: 0, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.render-html-button': { alpha: 0, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.rich-textbox': { alpha: 0.6, hover: null, hueShift: 0, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.settings-btn': { alpha: 0.3, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.hud-panel': { alpha: 0.5, hover: null, hueShift: 0, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.tab': { alpha: 0.5, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.tab.active': { alpha: 0.7, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.close-btn': { alpha: 0.7, hover: null, hueShift: 30, boxShadow: "0px 4px 10px rgba(0,0,0,1)" },
        '.code-navbar': { alpha: 0.8, hover: null, hueShift: 0, boxShadow: null }
    };

    const baseRgba = sessionStorage.getItem('baseRgba') || 'rgba(255, 255, 255, 0.8)';
    const rgbaMatch = baseRgba.match(/\d+/g);
    if (!rgbaMatch) return;

    const r = parseInt(rgbaMatch[0]), g = parseInt(rgbaMatch[1]), b = parseInt(rgbaMatch[2]);
    const originalAlpha = parseFloat(rgbaMatch[3]) / 255 || 0.8;

    function adjustRgb(value) {
        return value > 100 ? value - 50 : value;
    }

    const adjustedR = adjustRgb(r);
    const adjustedG = adjustRgb(g);
    const adjustedB = adjustRgb(b);

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
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
            r = g = b = l;
        } else {
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hueToRgb(p, q, h / 360 + 1 / 3);
            g = hueToRgb(p, q, h / 360);
            b = hueToRgb(p, q, h / 360 - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    const [baseHue, baseSat, baseLight] = rgbToHsl(r, g, b);

    Object.entries(elementsConfig).forEach(([selector, config]) => {
        document.querySelectorAll(selector).forEach((element) => {
            let alpha = config.alpha === 0 ? originalAlpha : config.alpha;
            const defaultColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            const hoverHue = baseHue + config.hueShift;
            const [hoverR, hoverG, hoverB] = hslToRgb(hoverHue, baseSat, baseLight);
            const hoverColor = config.hover ?? `rgba(${hoverR}, ${hoverG}, ${hoverB}, ${alpha})`;

            element.style.backgroundColor = defaultColor;

            // Box shadow logic
			const boxShadowColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
			const boxShadowValue = config.boxShadow !== null ? config.boxShadow : `0px 4px 10px ${boxShadowColor}`;
            element.style.boxShadow = boxShadowValue;

            element.addEventListener("mouseover", () => element.style.backgroundColor = hoverColor);
            element.addEventListener("mouseout", () => element.style.backgroundColor = defaultColor);
        });
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    Object.entries(elementsConfig).forEach(([selector, config]) => {
                        if (node.matches(selector) || node.querySelector(selector)) {
                            let alpha = config.alpha === 0 ? originalAlpha : config.alpha;
                            const defaultColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

                            const hoverHue = baseHue + config.hueShift;
                            const [hoverR, hoverG, hoverB] = hslToRgb(hoverHue, baseSat, baseLight);
                            const hoverColor = config.hover ?? `rgba(${hoverR}, ${hoverG}, ${hoverB}, ${alpha})`;

                            const boxShadowColor = `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
                            const boxShadowValue = config.boxShadow ?? `0px 4px 10px ${boxShadowColor}`;

                            if (node.matches(selector)) {
                                node.style.backgroundColor = defaultColor;
                                node.style.boxShadow = boxShadowValue;
                                node.addEventListener("mouseover", () => node.style.backgroundColor = hoverColor);
                                node.addEventListener("mouseout", () => node.style.backgroundColor = defaultColor);
                            } else {
                                node.querySelectorAll(selector).forEach((child) => {
                                    child.style.backgroundColor = defaultColor;
                                    child.style.boxShadow = boxShadowValue;
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
