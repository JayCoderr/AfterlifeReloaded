function escapeHtml(html) {
    const text = document.createTextNode(html);
    const div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML;
}

// Retrieve user-related data from sessionStorage with fallback values
const aiCurrentName = sessionStorage.getItem('aiusername') || 'DefaultName';
const aiCurrentProfilPic = sessionStorage.getItem('aiProfileImage') || 'default-profile-pic.jpg';

function appendAIMessage(message, aiusername = "${aiCurrentName}", rebootButtonHTML = "") {
    const scrollablePanel = document.querySelector('.scrollable-panel');
    const aiResponseDiv = document.createElement('div');
    aiResponseDiv.className = 'response-container ai-response';

    // Get the current time
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const timeString = `${hours}:${minutes} ${ampm}`;

    aiResponseDiv.innerHTML = `
    <div class="panel">
        <img src="${aiCurrentProfilPic}" alt="AI Picture">
        <div class="aiusername">${aiCurrentName}</div>
        <div class="message-content"><span id="typewriter"></span></div>
        <div class="timestamp">${timeString}</div>
    </div>`;
    
    scrollablePanel.appendChild(aiResponseDiv);
    scrollablePanel.scrollTop = scrollablePanel.scrollHeight;

    const typewriterElement = aiResponseDiv.querySelector("#typewriter");
    const trimmedMessage = message.trim();

    // Code block regex
	const codeBlockRegex = /```(c++|c|aspx|r|sql|swift|kotlin|c#|csharp|html|javascript|cpp|python|js|java|css|php|ruby|go|bash|json|xaml|xml|gsc|cfg)\s*([\s\S]*?)```/gi;

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
		{ type: 'commentSingle', start: '//', color: 'green' }, // Single-line comments
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
					scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
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
			codePanel.className = 'code-panel';
			const pre = document.createElement('pre');
			const code = document.createElement('code');
			code.className = `language-${currentSegment.lang}`;
			pre.appendChild(code);
			codePanel.appendChild(pre);
			typewriterElement.appendChild(codePanel);
		
			// Sanitize content: remove <button> tags from the code content
			let sanitizedCodeContent = currentSegment.content; // This cancels <button> tags in the code
		
			// Process code with syntax highlighting
			let charIndex = 0;
			function typeCode() {
				if (charIndex <= sanitizedCodeContent.length) {
					// Only apply syntax highlighting up to the current character
					const partialCode = sanitizedCodeContent.slice(0, charIndex);
					code.innerHTML = applySyntaxHighlighting(partialCode);
					charIndex++;
					scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
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
	if (trimmedMessage.toLowerCase().includes("```html")) {
		const renderButton = document.createElement("button");
		renderButton.className = "render-html-button";
		renderButton.style = "margin-top: 10px; margin-bottom: 10px; margin-left: 5px; border-radius: 25px; background: rgba(0,0,255,0.9); box-shadow: 0px 4px 10px rgba(0,0,0,1); border: none; font-size: 12px;color: white;";
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

		// Generate plain text content with syntax highlighting
		const plainTextContent = trimmedMessage.replace(codeBlockRegex, (match, lang, code) => {
			// Apply syntax highlighting to all code blocks
			const highlightedCode = `${applySyntaxHighlighting(code.trim())}`;
			return `<div class="code-panel">${highlightedCode}</div><p>`;
		})
		.replace(/(?<!<code[^>]*>)<button/g, '<`button') // Replace <button> outside code panels
		.replace(/(?<!<code[^>]*>)<input/g, '<`input')   // Replace <input> outside code panels
		.replace(/(?<!<code[^>]*>)<title/g, '<`title')
		.replace(/(?<!<code[^>]*>)<iframe/g, '<`iframe');
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
		aiResponseDiv.querySelector(".message-content").appendChild(renderButton);
	}
}
