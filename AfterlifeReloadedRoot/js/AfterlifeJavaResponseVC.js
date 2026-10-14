function updateVisitorCount() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://afterlifebackend.byethost8.com/AfterlifeReloadedRoot/php/AfterlifeUpdateVC.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Update the visit counter in the footer with the response from the PHP file
            document.getElementById('visit-counter').innerText = xhr.responseText;
        }
    };
    xhr.send();
}

window.onload = updateVisitorCount;
