const images = [
    'https://afterlifereloaded.com/AfterlifeReloadedRoot/Images/d4GU8hB.gif',
    'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2933620/extras/CODBO6_Animated.gif',
    'https://c.tenor.com/EUH6GsIoD2MAAAAC/tenor.gif',
    'https://wallpapers-clan.com/wp-content/uploads/2024/04/kakashi-hatake-falling-snow-anime-naruto-gif-preview-desktop-wallpaper.gif',
    'https://wallpapers-clan.com/wp-content/uploads/2024/03/dragon-ball-goku-sparks-gif-preview-desktop-wallpaper.gif',
    'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2933620/extras/CODBO6_Animated.gif',
    'https://iili.io/21mKBUu.gifhttps://iili.io/21mfcE7.gif',
    'https://i.pinimg.com/originals/59/0d/73/590d73050637dcb12e9af999f8d6437b.gif',
    'https://i.pinimg.com/originals/03/e4/0e/03e40eb6557849633839c62f9a809463.gif',
    'https://iili.io/21mo0en.gif',
    'https://iili.io/21mXfBR.gif',
    'https://iili.io/21meVZF.gif',
	'https://iili.io/21pf2AG.gif',
	'https://giffiles.alphacoders.com/214/214339.gif',
	'https://i.pinimg.com/originals/0a/78/59/0a7859459211275b4e8d3b212d4e9522.gif',
	'https://iili.io/21peoHQ.gif',
	'https://iili.io/21yKpr7.gif',
	'https://iili.io/21mKBUu.gif'
];

// Retrieve the background URL from sessionStorage
const userBackgroundImage = sessionStorage.getItem('userBackgroundImage');

// Set the background image to the session value if available, otherwise set a random background
if (userBackgroundImage) {
    document.body.style.backgroundImage = `url('${userBackgroundImage}')`;
} else {
    let lastImage = ''; // Variable to store the last selected image
    // Function to set a random background image
    function setRandomBackground() {
        let randomImage;
        do {
            const randomIndex = Math.floor(Math.random() * images.length);
            randomImage = images[randomIndex];
        } while (randomImage === lastImage); // Ensure the new image is different from the last one
        lastImage = randomImage; // Update lastImage with the new one
        document.body.style.backgroundImage = `url('${randomImage}')`; // Set the background image
    }

    // Set a random background image on page load
    setRandomBackground();
}