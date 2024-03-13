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




    function toggleDarkMode() {
        var element = document.body;
        element.classList.toggle("darkMode");
        
        // Save the user's preference for dark mode in localStorage
        var isDarkMode = element.classList.contains("darkMode");
        localStorage.setItem("darkMode", isDarkMode);
    }
    
    // Check user's preference for dark mode from localStorage and set the page accordingly
    function setInitialColorScheme() {
        var isDarkMode = localStorage.getItem("darkMode");
        if (isDarkMode === "true") {
            document.body.classList.add('darkMode'); // Set the page to dark mode if the user prefers it
        } else {
            document.body.classList.remove('darkMode'); // Set the page to light mode if the user prefers it
        }
    }
    
    // Call the function to set the initial color scheme when the page loads
    setInitialColorScheme();



function fadeIn(element, duration) {
    var initialOpacity = 0;
    var targetOpacity = 1;
    var startTime = null;

    function fade(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var opacity = initialOpacity + (progress / duration) * (targetOpacity - initialOpacity);

        // Ensure opacity doesn't exceed the target value
        if (opacity > targetOpacity) opacity = targetOpacity;

        // Apply the opacity to the element
        element.style.opacity = opacity;

        if (progress < duration) {
            // Continue fading until duration is reached
            window.requestAnimationFrame(fade);
        }
    }

    // Start the animation
    window.requestAnimationFrame(fade);
}

setTimeout(function() {
    var navBarDelay = document.getElementById('navLinks');
    document.getElementById('navLinks').style.display = 'flex';
    fadeIn(navBarDelay, 2000); // Fade in over 3000 milliseconds (3 seconds)
}, 2000);