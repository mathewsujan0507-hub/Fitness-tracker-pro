// LOAD SAVED DATA
window.addEventListener("load", async function(){

    // Fetch Metrics
    let metrics = { water: 0, steps: 0, total_workouts: 0, total_time: 0 };
    try {
        const res = await fetch('/api/metrics');
        if(res.ok) {
            metrics = await res.json();
        }
    } catch(e) {}

    const water = metrics.water || 0;
    const steps = metrics.steps || 0;

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

    const totalWorkouts = metrics.total_workouts || 0;
    const totalTimeSeconds = metrics.total_time || 0;
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
        let history = [];
        try {
            const hRes = await fetch('/api/history');
            if(hRes.ok) {
                history = await hRes.json();
            }
        } catch(e) {}

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
async function saveWater(){
    let water = document.getElementById("waterInput").value;
    try {
        await fetch('/api/metrics', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ water: parseInt(water) || 0 })
        });
    } catch(e) {}

    const waterDisplay = document.getElementById("waterDisplay");
    if (waterDisplay) {
        waterDisplay.innerText = "Today Water: " + water;
    }
}

// SAVE STEPS
async function saveSteps(){
    let steps = document.getElementById("stepsInput").value;
    try {
        await fetch('/api/metrics', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ steps: parseInt(steps) || 0 })
        });
    } catch(e) {}

    const stepsDisplay = document.getElementById("stepsDisplay");
    if (stepsDisplay) {
        stepsDisplay.innerText = "Today Steps: " + steps;
    }
}
