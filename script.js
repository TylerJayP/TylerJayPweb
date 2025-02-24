document.addEventListener("DOMContentLoaded", function() {
    const textToType = "Tyler Jay Perkins";
    const characters = textToType.split('');

    function runTypingEffect() {
        var typed = new Typed("#jsTyped", {
            strings: [characters.join('')],
            typeSpeed: 100,
            loop: false
        });

        var typedMobile = new Typed("#jsMobileTyped", {
            strings: [characters.join('')],
            typeSpeed: 100,
            loop: false
        });
    }

    function runLoader() {
        var mewLoaderWrapper = document.getElementById("mewLoaderWrapper");
        mewLoaderWrapper.style.opacity = "0";

        setTimeout(function() {
            mewLoaderWrapper.style.display = "none";
            runTypingEffect(); // Start typing after loader finishes
            startFadeIns(); // Start fade-ins after loader
        }, 500);
    }

    function checkFirstSession() {
        var isFirstSession = localStorage.getItem("firstSession");
        var mewLoaderWrapper = document.getElementById("mewLoaderWrapper");

        if (isFirstSession === null) {
            // First-time visitor: Show loader and run typing after
            localStorage.setItem("firstSession", "false");

            setTimeout(function() {
                runLoader();
            }, 4000); // Delay for loader animation
        } else {
            // Not first-time visitor: Skip loader and directly run typing and fade-ins
            mewLoaderWrapper.style.display = "none";
            runTypingEffect();
            startFadeIns(); // Immediate fade-ins
        }
    }

    function startFadeIns() {
        // Fade-in for other elements
        setTimeout(function () {
            var navBarDelay = document.getElementById('navLinks');
            navBarDelay.style.opacity = 0;
            navBarDelay.style.display = 'flex';
            fadeIn(navBarDelay, 3000);
        }, 0);

        setTimeout(function () {
            var aboutMeDelay = document.getElementById('aboutMe');
            aboutMeDelay.style.opacity = 0;
            aboutMeDelay.style.display = 'flex';
            fadeIn(aboutMeDelay, 2500);
        }, 0);

        setTimeout(function () {
            var aboutMeDelay = document.getElementById('aboutMeMobile');
            aboutMeDelay.style.opacity = 0;
            aboutMeDelay.style.display = 'block';
            fadeIn(aboutMeDelay, 2500);
        }, 0);

        setTimeout(function () {
            var darkModeButton = document.querySelector('.changeModeButton');
            darkModeButton.style.opacity = 0;
            darkModeButton.style.display = 'block';
            fadeIn(darkModeButton, 2000);
        }, 0); // Delay so it fades in after other elements

        // setTimeout(function () {
        //     var registerUserDelay = document.getElementById('registerLog');
        //     registerUserDelay.style.opacity = 0;
        //     registerUserDelay.style.display = 'flex';
        //     fadeIn(registerUserDelay, 2000);
        // }, 0);
    }

    checkFirstSession();
    setInitialColorScheme();
});

function toggleDarkMode() {
    var element = document.body;
    element.classList.toggle("darkMode");

    // Save dark mode preference
    var isDarkMode = element.classList.contains("darkMode");
    localStorage.setItem("darkMode", isDarkMode);
}

function setInitialColorScheme() {
    var isDarkMode = localStorage.getItem("darkMode");
    if (isDarkMode === "true") {
        document.body.classList.add('darkMode');
    } else {
        document.body.classList.remove('darkMode');
    }
}

function fadeIn(element, duration) {
    var initialOpacity = 0;
    var targetOpacity = 1;
    var startTime = null;

    function fade(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var opacity = initialOpacity + (progress / duration) * (targetOpacity - initialOpacity);

        // Cap opacity at 1
        if (opacity > targetOpacity) opacity = targetOpacity;

        element.style.opacity = opacity;

        if (progress < duration) {
            window.requestAnimationFrame(fade);
        }
    }

    window.requestAnimationFrame(fade);
}

function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('active');

    var icon = document.querySelector('.icon');
    icon.classList.toggle('active');
}

const textarea = document.getElementById('comments');
textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
});

// Modal close behavior
var modal = document.getElementById('id01');
const myForm = document.getElementById('validateForm');

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        window.location.reload();
    }
};

function closeModal() {
    var modal = document.getElementById('id01');
    modal.style.display = 'none';
    window.location.reload();
}
