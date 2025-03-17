function escapeHtml(html) {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}
const BubbleUserAI = sessionStorage.getItem('aiusername');
let oldAIResponse = "";

function generateUniqueId(prefix = 'codeNav') {
    // Encrypt the prefix using Base64 encoding
    const encryptedPrefix = btoa(prefix); // btoa() encodes to Base64

    // Truncate and convert to alphanumeric characters (Base64 can have + and /, so we remove these and convert to uppercase)
    let truncatedPrefix = encryptedPrefix.slice(0, 10);  // Limit to 10 characters of Base64
    truncatedPrefix = truncatedPrefix.replace(/[+/=]/g, ''); // Remove any non-alphanumeric characters
    truncatedPrefix = truncatedPrefix.toUpperCase(); // Ensure uppercase alphanumeric

    // Now format the truncated and cleaned prefix to match the 0000-0000 format
    truncatedPrefix = truncatedPrefix.padStart(8, '0').replace(/([A-Za-z0-9]{4})([A-Za-z0-9]{4})/, '$1-$2');

    // Randomly choose between hex, byte, or custom encoding for the unique ID
    const encodingTypes = ['hex', 'byte', 'custom'];
    const encodingType = encodingTypes[Math.floor(Math.random() * encodingTypes.length)];

    let uniqueIdPart;

    switch (encodingType) {
        case 'hex':
            // Generate a random hex string
            uniqueIdPart = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
            break;
        case 'byte':
            // Generate a random byte sequence
            uniqueIdPart = Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')).join('');
            break;
        case 'custom':
            // Custom encoded ID (could use Base64 or any other custom encoding logic)
            uniqueIdPart = Math.random().toString(36).substr(2, 10).toUpperCase();
            break;
        default:
            uniqueIdPart = Math.floor(Math.random() * 10000000).toString().toUpperCase();
    }

    // Format the unique ID as 0000-000-0000
    const formattedId = uniqueIdPart.padStart(12, '0').replace(/(\w{4})(\w{3})(\w{4})/, '$1-$2-$3');
    
    return `${truncatedPrefix}-${formattedId}`;
}

function appendAIMessage(message, aiusername = BubbleUserAI, rebootButtonHTML = "") {
    const scrollablePanel = document.querySelector('.scrollable-panel');
    const aiResponseDiv = document.createElement('div');
	const topBar = document.createElement('div');

    aiResponseDiv.className = 'response-container ai-response';
	
    // Get the current time
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const timeString = `${hours}:${minutes} ${ampm}`;
	
	let oldAIMessageResponse = "";
	oldAIResponse = oldAIMessageResponse;
	oldAIMessageResponse = message;
	message.replace("username", "{username}");
	
	console.log("last message sent from ai bubble: " + oldAIResponse);
	//updateConversationHistory();		

    aiResponseDiv.innerHTML = `
        <div id="AIPanel" class="panel">
            <img src="https://iili.io/d4GU8hB.gif" alt="AI Picture">
            <div class="aiusername">${aiusername}</div>
            <div class="message-content"><span id="typewriter"></span></span></div>
            <div class="timestamp">${timeString}</div>
        </div>`;
	const messageContent = aiResponseDiv.querySelector(".message-content");	
		
    const trimmedMessage = message.trim();
    const typewriterElement = aiResponseDiv.querySelector("#typewriter");

    scrollablePanel.appendChild(aiResponseDiv);

    // Code block regexwhat was the last thing you said to me
	const codeBlockRegex = /```(ascii|ChatResponse|c\+\+|aspx|r|c|sql|swift|kotlin|c#|csharp|html|javascript|cpp|python|js|java|css|php|ruby|go|bash|json|xaml|xml|gsc|cfg)\n([\s\S]*?)```/gi;

    const segments = [];
    let lastIndex = 0;
    
    trimmedMessage.replace(codeBlockRegex, (match, lang, code, index) => {
        if (index > lastIndex) {
            segments.push({ type: "text", content: trimmedMessage.slice(lastIndex, index) });
        }
        segments.push({ type: "code", content: code, lang }); // No escaping here
        lastIndex = index + match.length;
    });
    
    if (lastIndex < trimmedMessage.length) {
        segments.push({ type: "text", content: trimmedMessage.slice(lastIndex) });
    }

    let segmentIndex = 0;

    // Directly render rebootButtonHTML if it's provided
    if (rebootButtonHTML) {
        typewriterElement.innerHTML = rebootButtonHTML;
        return; // Exit early
    }

	const syntaxPatterns = [
		{ type: 'string', delimiters: ['"', '"'], color: 'darkorange' }, // Strings in double quotes
		{ type: 'commentSingle', start: '//', color: 'darkgreen' }, // Single-line comments
		{ type: 'commentMulti', start: '/*', end: '*/', color: 'darkgreen' }, // Multi-line comments
		{ type: 'commentHtml', start: '<!--', end: '-->', color: 'darkgreen' }, // HTML comments
		{ type: 'literals', words: ['true', 'false', 'null', 'undefined'], color: 'purple' }, // Boolean literals
		{ type: 'numbers', isNumber: true, color: 'darkred' }, // Numbers
		{ type: 'keywords', words: ['function', 'if', 'else', 'return', 'const', 'let', 'var', 'class', 'new', 'using', 'private', 'public', 'namespace', 'void', 'this'], color: 'rgb(0, 127, 255)' }, // Keywords		
		{ type: 'braces', characters: ['{', '}'], color: 'rgb(173,117,0)' } // Curly braces
	];
	
	// Function to escape HTML characters except for single and double quotes
	function escapeHtmlExceptQuotes(text) {
		const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
		return text.replace(/[&<>"]/g, char => map[char]);
	}
	
	// Apply syntax highlighting with regex matching
	function applySyntaxHighlighting(codeText) {
		// Escape HTML characters except for single quotes and double quotes
		codeText = escapeHtmlExceptQuotes(codeText);
	
		// Apply syntax highlighting to each pattern
		syntaxPatterns.forEach(pattern => {
			let regex;
	
			if (pattern.type === 'string') {
				// Match strings wrapped in double or single quotes (adjusted regex)
				regex = /(["'])(.*?)\1/g; // Matches both "string" and 'string'
				codeText = codeText.replace(regex, (match, quote, p1) => {
					return `<span style="color: ${pattern.color}">${quote}${p1}${quote}</span>`;
				});
			} else if (pattern.type === 'commentSingle') {
				// Match single-line comments starting with `//`
				regex = /\/\/.*/g;
				codeText = codeText.replace(regex, (match) => {
					return `<span style="color: ${pattern.color}">${match}</span>`;
				});
			} else if (pattern.type === 'commentMulti') {
				// Match multi-line comments wrapped with `/* ... */`
				regex = /\/\*[^]*?\*\//g;
				codeText = codeText.replace(regex, (match) => {
					return `<span style="color: ${pattern.color}">${match}</span>`;
				});
			} else if (pattern.type === 'commentHtml') {
				// Match HTML-style comments wrapped with `<!-- ... -->`
				regex = /<!--[\s\S]*?-->/g;
				codeText = codeText.replace(regex, (match) => {
					return `<span style="color: ${pattern.color}">${match}</span>`;
				});
			} else if (pattern.type === 'literals') {
				// Match literal values (true, false, etc.)
				pattern.words.forEach(word => {
					regex = new RegExp(`\\b${word}\\b`, 'g');
					codeText = codeText.replace(regex, (match) => {
						return `<span style="color: ${pattern.color}">${match}</span>`;
					});
				});
			} else if (pattern.type === 'numbers') {
				// Match numbers (avoiding matching escaped characters like &#39;)
				regex = /\b\d+(\.\d+)?\b/g;
				codeText = codeText.replace(regex, (match) => {
					return `<span style="color: ${pattern.color}">${match}</span>`;
				});
			}
			else if (pattern.type === 'keywords') {
				// Match keywords (e.g., `function`, `if`, etc.)
				pattern.words.forEach(word => {
					regex = new RegExp(`\\b${word}\\b`, 'g');
					codeText = codeText.replace(regex, (match) => {
						return `<span style="color: ${pattern.color}">${match}</span>`;
					});
				});
			}
			else if (pattern.type === 'braces') {
            // Match curly braces `{` and `}`
            pattern.characters.forEach(char => {
                regex = new RegExp(`\\${char}`, 'g'); // Escape the brace for regex matching
                codeText = codeText.replace(regex, (match) => {
                    return `<span style="color: ${pattern.color}">${match}</span>`;
                });
            });
			}
		});
	
		return codeText;
	}
	
	function appendNextSegment() {
		if (segmentIndex >= segments.length) return;
	
		const currentSegment = segments[segmentIndex];
	
		if (currentSegment.type === "text") {
			const textSpan = document.createElement("span");
			typewriterElement.appendChild(textSpan);
			let charIndex = 0;
	
			// Sanitize content: replace <button> tags outside code blocks with something else (like <`button>)
			let sanitizedContent = currentSegment.content.replace(/(?<!<code[^>]*>)<button/g, '<`button').replace(/(?<!<code[^>]*>)<input/g, '<`input').replace(/(?<!<code[^>]*>)<title/g, '<`title');
	
			function typeText() {
				if (charIndex < sanitizedContent.length) {
					textSpan.textContent += sanitizedContent[charIndex];
					charIndex++;
					setTimeout(typeText, 10);
				} else {
					segmentIndex++;
					appendNextSegment();
				}
			}
	
			typeText();
		} else if (currentSegment.type === "code") {
			// Create the code panel
			const codePanel = document.createElement('div');
			const uniqueIdCodePanel = generateUniqueId('codePanel');
			codePanel.className = 'code-panel';
			codePanel.id = uniqueIdCodePanel;
	
			// Create the navbar-style top bar for the code block
			const topBar = document.createElement('div'); // Ensure topBar is created here
			const uniqueIdTopBar = generateUniqueId('codeNav');
			topBar.className = 'code-navbar';
			topBar.id = uniqueIdTopBar;
	
			// Language label
			const langLabel = document.createElement('span');
			const uniqueIdCodeLang = generateUniqueId('code-lang');
			langLabel.className = 'code-lang';
			langLabel.textContent = currentSegment.lang.toUpperCase();
			langLabel.id = uniqueIdCodeLang;
	
			// Copy button
			const copyButton = document.createElement('button');
			copyButton.className = 'copy-btn';
	
			const uniqueIdCopyButton = generateUniqueId('copy-btn');
			copyButton.className = 'copy-btn';
			copyButton.id = uniqueIdCopyButton;
			copyButton.textContent = "Copy";
			copyButton.onclick = () => {
				navigator.clipboard.writeText(currentSegment.content);
				copyButton.textContent = "Copied!";
				setTimeout(() => copyButton.textContent = "Copy", 2000);
			};
	
			// Append language label and copy button to navbar
			topBar.appendChild(langLabel);
			topBar.appendChild(copyButton);
	
			// Create the <pre> and <code> elements for the code block
			const pre = document.createElement('pre');
			const code = document.createElement('code');
			code.className = `language-${currentSegment.lang}`;
	
			// Remove the language identifier from the code content
			let sanitizedCodeContent = currentSegment.content;
	
			// Set the code content
			code.innerHTML = sanitizedCodeContent;
	
			// Append elements
			pre.appendChild(code);
			codePanel.appendChild(topBar); // Add the unique top bar (navbar) for this code block
			codePanel.appendChild(pre);
			typewriterElement.appendChild(codePanel);
	
			// Process code with syntax highlighting
			let charIndex = 0;
			function typeCode() {
				if (charIndex <= sanitizedCodeContent.length) {
					// Only apply syntax highlighting up to the current character
					const partialCode = sanitizedCodeContent.slice(0, charIndex);
					code.innerHTML = applySyntaxHighlighting(partialCode);
					charIndex++;
					setTimeout(typeCode, 10);
				} else {
					segmentIndex++;
					appendNextSegment();
				}
			}
			typeCode();
		}
	}

    // Proceed with the typing effect for regular messages
    appendNextSegment();

	let isHtmlRendered = false;
	
	// Check for the presence of HTML code blocks
	if (trimmedMessage.includes("```html") || trimmedMessage.includes("```HTML")) {
		const renderButton = document.createElement("button");
		renderButton.className = "render-html-button";
		renderButton.style = "margin-top: 10px; margin-bottom: 10px; margin-left: 5px;color: white;border-radius: 25px; background: rgba(0,0,255,0.9); box-shadow: 0px 4px 10px rgba(0,0,0,1); border: none;padding: 5px; font-size: x-small;";
		renderButton.textContent = "Render HTML";
	
		// Capture content inside <div class="code-panel">...</div>
		const codePanelRegex = /<div class="code-panel">([\s\S]*?)<\/div>/g;
		
		// First, isolate code panels to avoid replacing their inner content
		let htmlContent = trimmedMessage.replace(codePanelRegex, (match, contentInsideCodePanel) => {
			return `<div class="code-panel"><pre><code class="${lang}">${contentInsideCodePanel}</code></pre></div>`;
		});
		
		// Now, replace <button> tags starting with <button and replace them with `<`button`
		htmlContent = htmlContent
			.replace(/`<button(?![^<]*<\/div>)/g, "`<`button")  // Replace <button> tags outside code panels
			.replace(/`<input(?![^<]*<\/div>)/g, '`<`input').replace(/`<title(?![^<]*<\/div>)/g, '`<`title');  // Replace <input> tags outside code panels
		
		// Finally, replace content inside code blocks with injectHTML function for HTML code
		htmlContent = htmlContent.replace(codePanelRegex, (match, contentInsideCodePanel) => {
			return `<div class="code-panel"><pre><code class="${lang}">${contentInsideCodePanel.trim()}</code></pre></div>`;
		});

		const plainTextContent = trimmedMessage.replace(codeBlockRegex, (match, lang, code) => {
			// Apply syntax highlighting to all code blocks
			const highlightedCode = applySyntaxHighlighting(code.trim());
		
			// Generate unique IDs for each element within the code block
			const uniqueId = generateUniqueId('copy-btn'); // Use generateUniqueId function for consistency
			const uniqueCodePanelId = `code-panel-${uniqueId}`;
			const uniqueNavbarId = `navbar-${uniqueId}`;
			const uniqueLangId = `lang-${uniqueId}`;
			const uniqueCodeBlockId = `code-${uniqueId}`;
			const uniqueCopyButtonClass = `copy-btn-${uniqueId}`; // Unique class for the copy button
		
			// Create the HTML structure with the language tag and copy button
			const langTag = lang ? `<span class="code-lang" id="${uniqueLangId}">${lang}</span>` : '';
			
			// Return the correct structure with unique IDs for all elements
			return `<div class="code-panel" id="${uniqueCodePanelId}"><div class="code-navbar" id="${uniqueNavbarId}">${langTag}<button class="copy-btn" id="${uniqueId}">Copy</button></div><pre><code id="${uniqueCodeBlockId}">${highlightedCode}</code></pre></div><p>`;
		})
		// Use a more specific replacement to avoid affecting buttons in the navbar
		.replace(/<button(?![^<]*class="copy-btn")[^>]*>/g, '<`button')  // Avoid replacing buttons inside navbar
		.replace(/(?<!<code[^>]*>)<input/g, '<`input')   // Replace <input> outside code panels
		.replace(/(?<!<code[^>]*>)<title/g, '<`title'); // Replace <title> outside code panels
		
		// Global function for copying code
		function copyCode(buttonId) {
			const codePanel = document.querySelector(`#code-panel-${buttonId}`);
			const codeBlock = codePanel.querySelector("pre code");
			if (codeBlock) {
				navigator.clipboard.writeText(codeBlock.textContent.trim())
					.then(() => {
						const button = codePanel.querySelector(`#copy-btn-${buttonId}`);
						button.textContent = "Copied!";
						setTimeout(() => button.textContent = "Copy", 2000);
					})
					.catch(err => console.error("Failed to copy:", err));
			}
		}
		
		// Adding event listeners dynamically for "Copy" buttons
		document.body.addEventListener('click', (event) => {
			if (event.target.classList.contains('copy-btn')) {
				// Retrieve the unique ID from the clicked button
				const buttonId = event.target.id;
				copyCode(buttonId);
			}
		});

		// Toggle between rendered HTML and plain text
		renderButton.addEventListener("click", () => {
			if (isHtmlRendered) {
				// Display the plain text with syntax highlighting (non-rendered)		
				typewriterElement.innerHTML = plainTextContent;
				renderButton.textContent = "Render HTML";	
			} else {
				// Display the entire content with only HTML code panels rendered
				typewriterElement.innerHTML = htmlContent;
				renderButton.textContent = "Show Plain Text";
			}
			isHtmlRendered = !isHtmlRendered;
		});
	
		// Append only the render button
		messageContent.append(document.createElement("br"), renderButton);			
		//const AICodePanel = aiResponseDiv.querySelector(".code-navbar");
		//AICodePanel.appendChild(copyasdaButton); 
	}
	
}
