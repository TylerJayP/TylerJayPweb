document.addEventListener("DOMContentLoaded", function() {
    const textToType = "Tyler Jay Perkins";
    const loadingTextToType = "Loading";
    const characters = textToType.split('');

    // Fade out the newLoaderWrapper after 3 seconds (3000 milliseconds)
    setTimeout(function() {
        var mewLoaderWrapper = document.getElementById("mewLoaderWrapper");
        mewLoaderWrapper.style.opacity = "0";
        setTimeout(function() {
            mewLoaderWrapper.style.display = "none";
            var typed = new Typed("#jsTyped", {
                strings: [characters.join('')],
                typeSpeed: 100,
                loop: false
                });

        }, 500); // Wait for the transition to complete before hiding the element

     // Wait for the transition to complete before hiding the element
    }, 2000); // 3000 milliseconds = 3 seconds

    var loadingBar = document.getElementById("loadingBar");

    // Simulate loading process
    var progress = 0;
    var interval = setInterval(function() {
        progress += 1; // Increment progress
        loadingBar.style.width = progress + "%"; // Update width of loading bar
    }); // Adjust the interval duration as needed for desired speed

});



    const loadingTextToType = "Loading";


    // Fade out the newLoaderWrapper after 3 seconds (3000 milliseconds)
    setTimeout(function() {
        var mewLoaderWrapper = document.getElementById("mewLoaderWrapper");
        mewLoaderWrapper.style.opacity = "0";
        setTimeout(function() {
            mewLoaderWrapper.style.display = "none";
            var typedLoading = new Typed("#jsTypedLoading", {
                strings: ["Loading"],
                typeSpeed: 100,
                loop: false
                });

        }, 500); // Wait for the transition to complete before hiding the element

     // Wait for the transition to complete before hiding the element
    }, 2000); // 3000 milliseconds = 3 seconds

    var loadingBar = document.getElementById("loadingBar");

    // Simulate loading process
    var progress = 0;
    var interval = setInterval(function() {
        progress += 1; // Increment progress
        loadingBar.style.width = progress + "%"; // Update width of loading bar
    }); // Adjust the interval duration as needed for desired speed




function toggleDarkMode(color){
    var element = document.body;
    element.classList.toggle("darkMode");
    element.style.background = color;
}


