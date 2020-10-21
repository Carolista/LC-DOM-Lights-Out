/*** LIGHTS OUT ***/

/*
    My own little take on the classic game of lights out, just to experiment with the DOM
*/

// Event listener for page load
window.addEventListener("load", function() {
    console.log('Page loaded.');
    init();
});

// DOM code for page elements
function init() {

    let lightColor = "#bada55" // badass!
    let base = "#222222";

    // get some objects from page
    let lights = document.getElementsByClassName("light");
    let congrats = document.getElementById("congrats");
    let newGame = document.getElementById("new-game");

    // initialize some stuff
    setLights();

    // Gather group of lights (3-5) that form plus shape on grid, based around center light
    function groupLights(light) {
        let group = [light]; // start with light that was clicked
        let rowIndex = Number(light.id[5]);
        let lightIndex = Number(light.id[7]);
        if (rowIndex > 0) {
            group.push(document.getElementById("light" + (rowIndex - 1) + "-" + lightIndex)); // add light above
        } 
        if (rowIndex < 4) {
            group.push(document.getElementById("light" + (rowIndex + 1) + "-" + lightIndex)); // add light below
        }
        if (lightIndex > 0) {
            group.push(document.getElementById("light" + rowIndex + "-" + (lightIndex - 1))); // add light to left
        } 
        if (lightIndex < 4) {
            group.push(document.getElementById("light" + rowIndex + "-" + (lightIndex + 1))); // add light to right
        }
        return group; // objects relating to specific div elements on page
    }

    // Toggles group of lights based on single light in center of plus sign formation
    function toggleLights(light) {
        let groupAffected = groupLights(light);
        for (let i=0; i < groupAffected.length; i++) {
            if (rgbToHex(groupAffected[i].style.backgroundColor) === base) {
                groupAffected[i].style.backgroundColor = lightColor;
                groupAffected[i].style.boxShadow = "0px 0px 20px 2px " + lightColor;
                groupAffected[i].style.border = "2px solid " + lightColor;
            } else {
                groupAffected[i].style.backgroundColor = base;
                groupAffected[i].style.boxShadow = "none";
                groupAffected[i].style.border = "2px solid " + "#333";
            }
        } 
    }

    // Starts new game with random arrangement
    function setLights() {
        for (let i=0; i < lights.length; i++) {
            let selection = randomize(2);
            if (selection === 0) {
                toggleLights(lights[i]);
            }
        }
    }

    // Check to see if all lights are out (win!)
    function checkLights() {
        for (let i=0; i < lights.length; i++) {
            if (rgbToHex(lights[i].style.backgroundColor) === lightColor) {
                return false;
            }
        }
        return true; // if all lights were dark
    }

    // use event delegation to listen for any click events
    document.addEventListener("click", function(event) {

        // when user clicks on light
        if (event.target.matches(".light")) {
            toggleLights(event.target);
            if (checkLights()) {
                congrats.innerHTML = "YOU WIN!!!";
                congrats.style.fontWeight = "700";
                newGame.innerHTML = "New game?";
            }        
        }

        // when user clicks on "New Game?"
        if (event.target.id === "new-game") {
            setLights();
            congrats.innerHTML = "Good luck!";
            congrats.style.fontWeight = "400";
            newGame.innerHTML = "";
        }

    });

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    function rgbToHex(rgb) {
        // parse rgb as string of code to get individual numbers
        let paren1 = rgb.indexOf("(");
        let comma1 = rgb.indexOf(",");
        let r = Number(rgb.slice(paren1+1,comma1));
        rgb = rgb.slice(comma1+1);
        let comma2 = rgb.indexOf(",");
        let paren2 = rgb.indexOf(")");
        let g = Number(rgb.slice(0,comma2));
        let b = Number(rgb.slice(comma2+1,paren2));
        // convert and concatenate to hex code string
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function randomize(max) {
        return Math.floor(Math.random()*max);
    }

}
