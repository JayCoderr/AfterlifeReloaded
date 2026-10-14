function updateVisitorCount() {
    var xhr = new XMLHttpRequest();
    var url = 'https://afterlifebackend.byethost8.com/AfterlifeReloadedRoot/php/cors-test.php?i=' + Date.now();

    xhr.open('GET', url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log('Visitor counter status:', xhr.status);
            console.log('Visitor counter response:', xhr.responseText);
            console.log('Visitor counter headers:', xhr.getAllResponseHeaders());

            if (xhr.status === 200) {
                var counter = document.getElementById('visit-counter');
                if (counter) {
                    counter.innerText = xhr.responseText;
                }
            }
        }
    };

    xhr.onerror = function () {
        console.error('Visitor counter request failed. Check CORS and the Network tab.');
    };

    xhr.send();
}

window.addEventListener('load', updateVisitorCount);
