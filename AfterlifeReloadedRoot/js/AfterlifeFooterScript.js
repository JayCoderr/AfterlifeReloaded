fetch('AfterlifeReloadedRoot/text/footer.txt') // Path to your text file
.then(response => response.text())
.then(data => {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    // Grab the <p> element from the parsed HTML
    const footerTextP = tempDiv.querySelector('.footer-text p');
    
    // Now you can manipulate or log it
    console.log(footerTextP.innerHTML); // Logs the inner HTML of the <p> element
})
.catch(error => {
    console.error('Error fetching the footer:', error);
});