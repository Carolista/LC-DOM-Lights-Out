/**** LIGHTS OUT ****/

/*
    My own little take on the classic game of Lights Out, just to experiment with the DOM
*/

// Event listener for page load
window.addEventListener("load", function() {
    console.log('Page loaded.');
    init();
});

// DOM code for page elements
function init() {

    let lightColors = ["#d4f764", "#fda16b", "#ffe56f", "#fc77a3", "#cb77fc", "#7784fc", "#77fcf1", "#77fc9f"];
    let base = "#222222";
    let numCurrentMoves = 0;
    let numBestMoves = 999999999999999999; /* God help the person who breaks this */
    let gameOver = false;
    let congratsOptions = ["Simply Amazing!", "Outstanding!", "Stellar performance!", "Great job!", "Good work!", "Hey, you won!", "You did it!", "Woohoo!", "Hey, who turned the lights out?"];

    // get some objects from page
    let lightGrid = document.getElementById("light-grid");
    let lights = document.getElementsByClassName("light");
    let congrats = document.getElementById("congrats");
    let currentMoves = document.getElementById("current-moves");
    let bestMoves = document.getElementById("best-moves");
    let overlay = document.getElementById("overlay");
    let gameBoard = document.getElementById("game-board");

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
        let lightColor;
        for (let i=0; i < groupAffected.length; i++) {
            let currentColor = rgbToHex(groupAffected[i].style.backgroundColor);
            if (currentColor === base) {
                lightColor = lightColors[randomize(lightColors.length)] // new random color for each light
                groupAffected[i].style.backgroundColor = lightColor;
                groupAffected[i].style.border = "2px solid " + lightColor;
                // groupAffected[i].style.boxShadow = "0px 0px 15px 0px " + lightColor;
                // groupAffected[i].style.animation = "pulse " + randomize(4, 2, 1) + "s infinite"; // offset light pulsing
            } else {
                groupAffected[i].style.backgroundColor = base;
                groupAffected[i].style.border = "2px solid " + "#333";
                // groupAffected[i].style.boxShadow = "none";
                // groupAffected[i].style.animation = "none";
            }
        } 
    }

    // Create random arrangment for new game
    function setLights() {
        // Set all lights back to base color - must do adjacents before lighting some up randomly
        for (let i=0; i < lights.length; i++) {
            lights[i].style.backgroundColor = base; 
            lights[i].style.borderColor = "#333";
        }
        // Select some at random to generate toggles
        for (let j=0; j < lights.length; j++) {
            let selection = randomize(2);
            if (selection === 0) {
                toggleLights(lights[j]);
            }
        }
        // prevent the rare possibility of starting with all lights off
        if (checkLights()) {
            setLights(); // recursive
        }
    }

    // Check to see if all lights are out (win!)
    function checkLights() {
        for (let i=0; i < lights.length; i++) {
            if (lightColors.includes(rgbToHex(lights[i].style.backgroundColor))) {
                return false;
            }
        }
        return true; // if all lights were dark
    }

    // Choose congrats message based on number of moves
    function getCongrats(moves) {
        if (moves >= 90) {
            return congratsOptions[8];
        } else if (moves < 21) {
            return congratsOptions[0];
        } else {
            return congratsOptions[Math.ceil(moves/10)-2];
        }
    }

    // Use event delegation to listen for any click events
    document.addEventListener("click", function(event) {

        // When user clicks on a light
        if (event.target.matches(".light") && !gameOver) {
            toggleLights(event.target);
            numCurrentMoves += 1;
            if (checkLights()) {
                gameOver = true;
                lightGrid.style.cursor = "default";
                congrats.innerHTML = getCongrats(numCurrentMoves);
                currentMoves.innerHTML = "Round completed in <strong>" + numCurrentMoves + "</strong> moves.";
                overlay.style.visibility = "visible";
                gameBoard.style.visibility = "hidden";
                if (numCurrentMoves < numBestMoves) {
                    numBestMoves = numCurrentMoves;
                    bestMoves.innerHTML = "Personal best: " + numBestMoves + " moves";
                }
            }        
        }

        // When user clicks on "New Game?"
        if (event.target.id === "new-game") {
            setLights();
            gameOver = false;
            gameBoard.style.visibility = "visible";
            overlay.style.visibility = "hidden";
            lightGrid.style.cursor = "pointer";
            numCurrentMoves = 0;
        }

    });


    /** Miscellaneous Helper Functions **/

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

    function randomize(max = 100, min = 0, dec = 0) {
        let factor = 10 ** dec;
        return Math.floor(factor * Math.random() * (max - min)) / factor + min;
    }

}

