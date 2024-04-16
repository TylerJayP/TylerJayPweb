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
            var typed = new Typed("#jsMobileTyped", {
                    strings: [characters.join('')],
                    typeSpeed: 100,
                    loop: false
            });
        }, 500); // Wait for the transition to complete before hiding the element

     // Wait for the transition to complete before hiding the element
    }, 4000); // 3000 milliseconds = 3 seconds

});


    function toggleDarkMode() {
        var element = document.body;
        element.classList.toggle("darkMode");
        
        // Save the user's preference for dark mode in localStorage
        var isDarkMode = element.classList.contains("darkMode");
        localStorage.setItem("darkMode", isDarkMode);
    };
    
    // Check user's preference for dark mode from localStorage and set the page accordingly
    function setInitialColorScheme() {
        var isDarkMode = localStorage.getItem("darkMode");
        if (isDarkMode === "true") {
            document.body.classList.add('darkMode'); // Set the page to dark mode if the user prefers it
        } else {
            document.body.classList.remove('darkMode'); // Set the page to light mode if the user prefers it
        }
    };

    function setFirstSession() {
        var isFirstSession = localStorage.getItem("firstSession");
        if(isFirstSession === null){
            //user first time on site
            localStorage.setItem("firstSession", "false");
            document.getElementById('mewLoaderWrapper');
        }else if (isFirstSession === "true") {
            document.getElementById('mewLoaderWrapper').style.display = 'none';
        }
    };
    
    // Call the function to set the initial color scheme when the page loads
    setInitialColorScheme();
    setFirstSession();


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
};

setTimeout(function() {
    var navBarDelay = document.getElementById('navLinks');
    document.getElementById('navLinks').style.display = 'flex';
    fadeIn(navBarDelay, 4000); // Fade in over 3000 milliseconds (3 seconds)
}, 4000);

setTimeout(function() {
    var aboutMeDelay = document.getElementById('aboutMe');
    document.getElementById('aboutMe').style.display = 'flex';
    fadeIn(aboutMeDelay, 4000); // Fade in over 3000 milliseconds (3 seconds)
}, 3000);

setTimeout(function() {
    var registerUserDelay = document.getElementById('registerLog');
    document.getElementById('registerLog').style.display = 'flex';
    fadeIn(registerUserDelay, 4000); // Fade in over 3000 milliseconds (3 seconds)
}, 3000);


function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('active');

    var icon = document.querySelector('.icon');
    icon.classList.toggle('active');
  };


const textarea = document.getElementById('comments');
textarea.addEventListener('input', () => {
    textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the new height
});

// Get the modal
var modal = document.getElementById('id01');
const myForm = document.getElementById('validateForm');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {

  if (event.target == modal) {
    modal.style.display = "none";
    window.location.reload();
  }
};

function closeModal() {
    var modal = document.getElementById('id01');

    // Close the modal
    modal.style.display = 'none';

    // Reload the page
    window.location.reload();
}