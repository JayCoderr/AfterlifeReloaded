// Highlight function (changing background color and box-shadow)
function highlightToggleButton() {
const toggleButton = document.getElementById('toggleScroll');
const scrollablePanel = document.querySelector('.scrollable-panel');

	if (!toggleButton) return;

	toggleButton.addEventListener('click', () => 
	{
		scrollablePanel.scrollTop = scrollablePanel.scrollHeight;
		toggleButton.style.pointerEvents = 'none';
		toggleButton.style.backgroundColor = 'rgba(50,50,50,0)';
		toggleButton.style.boxShadow = 'none';
	});

	// Change background color and add box-shadow
	toggleButton.style.backgroundColor = 'rgba(50,50,50,0.9)';
	toggleButton.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 1)';
	toggleButton.style.pointerEvents = 'auto';
	toggleButton.style.border = 'none';
	toggleButton.style.outline = 'none';
	
	// Reset styles after 10 seconds
	setTimeout(() => {
		toggleButton.style.pointerEvents = 'none';
		toggleButton.style.backgroundColor = 'rgba(50,50,50,0)';
		toggleButton.style.boxShadow = 'none';
	}, 10000);
}