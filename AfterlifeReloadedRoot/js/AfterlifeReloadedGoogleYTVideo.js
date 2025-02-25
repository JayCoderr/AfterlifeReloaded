function getVideoName() {
    const searchInput = document.getElementById('search').value.trim();
    if (searchInput) {
        sessionStorage.setItem('videoName', searchInput); // Save new searches
        return searchInput;
    }

    const videoName = sessionStorage.getItem('videoName');
    console.log("Retrieved video name from sessionStorage:", videoName);
    return videoName || ''; // Return empty string if no stored name
}

async function searchVideos() {
    const query = getVideoName(); // Get query from input or sessionStorage

    if (!query) {
        console.error("No video name provided.");
        return;
    }

    const response = await fetch(`https://www.afterlifereloaded.com/AfterlifeReloadedRoot/php/search.php?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.error) {
        resultsDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        return;
    }

    data.items.forEach((item, index) => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const description = item.snippet.description;
        const autoplayParam = index === 0 ? 'autoplay=1' : 'autoplay=0';

        const videoHtml = `
            <div class="video-container">
                <h3>${title}</h3>
                <iframe width="560" height="315"
                    src="https://www.youtube.com/embed/${videoId}?${autoplayParam}"
                    title="${title}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
                <p>${description}</p>
            </div>
        `;
        resultsDiv.innerHTML += videoHtml;
    });
}

document.addEventListener("DOMContentLoaded", searchVideos);