// LOAD SAVED DATA
window.addEventListener("load", function(){

    // Water / steps trackers
    const water = localStorage.getItem("water") || 0;
    const steps = localStorage.getItem("steps") || 0;

    const waterDisplay = document.getElementById("waterDisplay");
    const stepsDisplay = document.getElementById("stepsDisplay");

    if (waterDisplay) {
        waterDisplay.innerText = "Today Water: " + water;
    }
    if (stepsDisplay) {
        stepsDisplay.innerText = "Today Steps: " + steps;
    }

    // Dashboard summary cards
    const totalWorkoutsEl = document.getElementById("totalWorkouts");
    const totalTimeEl = document.getElementById("totalTime");
    const caloriesEl = document.getElementById("calories");
    const streakEl = document.getElementById("streak");

    const totalWorkouts = parseInt(localStorage.getItem("totalWorkouts") || 0);
    const totalTimeSeconds = parseInt(localStorage.getItem("totalTime") || 0);
    const totalMinutes = Math.round(totalTimeSeconds / 60);

    if (totalWorkoutsEl) {
        totalWorkoutsEl.innerText = totalWorkouts;
    }
    if (totalTimeEl) {
        totalTimeEl.innerText = totalMinutes + " min";
    }

    // Simple calories estimate: 5 kcal per workout minute
    if (caloriesEl) {
        const calories = totalMinutes * 5;
        caloriesEl.innerText = calories;
    }

    // Weekly streak based on last 7 days with any workout
    if (streakEl) {
        const history = JSON.parse(localStorage.getItem("history") || "[]");
        const now = new Date();
        const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

        const daysWithWorkout = new Set();
        history.forEach(item => {
            const d = new Date(item.date);
            if (d >= sevenDaysAgo && d <= now) {
                const key = d.toDateString();
                daysWithWorkout.add(key);
            }
        });

        streakEl.innerText = daysWithWorkout.size;
    }

});

// SAVE WATER
function saveWater(){
    let water = document.getElementById("waterInput").value;
    localStorage.setItem("water", water);
    const waterDisplay = document.getElementById("waterDisplay");
    if (waterDisplay) {
        waterDisplay.innerText = "Today Water: " + water;
    }
}

// SAVE STEPS
function saveSteps(){
    let steps = document.getElementById("stepsInput").value;
    localStorage.setItem("steps", steps);
    const stepsDisplay = document.getElementById("stepsDisplay");
    if (stepsDisplay) {
        stepsDisplay.innerText = "Today Steps: " + steps;
    }
}
