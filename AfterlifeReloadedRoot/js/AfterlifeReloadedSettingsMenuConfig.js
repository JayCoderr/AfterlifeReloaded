function openHUD() {
	document.getElementById('hud').style.display = 'flex';
}

function closeHUD() {
	document.getElementById('hud').style.display = 'none';
}

function switchTab(event, tabId) {
	document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
	event.target.classList.add("active");
	document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
	document.getElementById(tabId).classList.add("active");
}
document.getElementById('set-ai-background').addEventListener('click', function () {
	const url = document.getElementById('ai-background-input').value;
	document.getElementById('ai-background-preview').src = url;
});

document.getElementById('set-ai-user-image').addEventListener('click', function () {
	const url = document.getElementById('ai-user-image-input').value;
	document.getElementById('ai-user-image-preview').src = url;
});

document.getElementById('set-ai-name').addEventListener('click', function () {
	const name = document.getElementById('ai-name-input').value;
	console.log("AI Name Set To:", name);
});

document.getElementById('other-settings').addEventListener('click', function () {
	console.log("Still updating and adding more options...");
});
// AI Variable Replacement Logic
document.getElementById('add-variable-replacement').addEventListener('click', function () {
	const opt1 = document.getElementById('variable-option1').value;
	const opt2 = document.getElementById('variable-option2').value;
	if (opt1 && opt2) {
		const listItem = document.createElement('li');
		listItem.innerHTML = `${opt1} → ${opt2} <button onclick="this.parentElement.remove()">Delete</button>`;
		document.getElementById('variable-replacement-list').appendChild(listItem);
	}
});

// Update Simulated Speed Value
document.getElementById('simulated-speed').addEventListener('input', function () {
	document.getElementById('speed-value').textContent = this.value;
});

// Set Token Amount Logic
document.getElementById('set-token-amount').addEventListener('click', function () {
	const tokenAmount = document.getElementById('token-amount').value;
	console.log("Token Amount Set To:", tokenAmount);
});

// Custom Rules Logic
document.getElementById('add-custom-rule').addEventListener('click', function () {
	const rule = document.getElementById('custom-rule-input').value;
	if (rule) {
		const listItem = document.createElement('li');
		listItem.innerHTML = `${rule} <button onclick="this.parentElement.remove()">Delete</button>`;
		document.getElementById('custom-rules-list').appendChild(listItem);
	}
});

// Edit Natural Language Logic
document.getElementById('edit-natural-lang').addEventListener('click', function () {
	console.log("Editing Natural Language...");
});
// Event Listeners for toggles
document.getElementById('notify-sound').addEventListener('change', function () {
	console.log("AI Notify Sound:", this.checked ? "Enabled" : "Disabled");
});

document.getElementById('ai-voice').addEventListener('change', function () {
	console.log("AI Voice:", this.checked ? "Enabled" : "Disabled");
});

document.getElementById('text-to-speech').addEventListener('change', function () {
	console.log("AI Text to Speech:", this.checked ? "Enabled" : "Disabled");
});

document.getElementById('speech-to-text').addEventListener('change', function () {
	console.log("AI Speech to Text:", this.checked ? "Enabled" : "Disabled");
});
function upgradeToVIP() {
    console.log("Redirecting to VIP upgrade page...");
}

function manageVIP() {
    console.log("Opening VIP management page...");
}

function manageAdmin() {
    console.log("Opening Admin Panel...");
}

function developerPanel() {
    console.log("Opening Developer Console...");
}