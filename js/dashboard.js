// LOAD SAVED DATA
window.onload = function(){

    document.getElementById("waterResult").innerText =
    "Today Water: " + (localStorage.getItem("water") || 0);

    document.getElementById("stepsResult").innerText =
    "Today Steps: " + (localStorage.getItem("steps") || 0);

}

// SAVE WATER
function saveWater(){
    let water = document.getElementById("waterInput").value;
    localStorage.setItem("water", water);
    document.getElementById("waterResult").innerText =
    "Today Water: " + water;
}

// SAVE STEPS
function saveSteps(){
    let steps = document.getElementById("stepsInput").value;
    localStorage.setItem("steps", steps);
    document.getElementById("stepsResult").innerText =
    "Today Steps: " + steps;
}
