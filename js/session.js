let sessionInterval = null;

function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
}

function getCurrentSessionState(){
    const isActive = localStorage.getItem("currentSessionActive") === "true";
    const start = parseInt(localStorage.getItem("currentSessionStart") || "0", 10);
    return { isActive, start };
}

function getCurrentSessionElapsedSeconds(){
    const { isActive, start } = getCurrentSessionState();
    if(!isActive || !start) return 0;
    const now = Date.now();
    return Math.max(0, Math.floor((now - start) / 1000));
}

function updateTimerDisplay(){
    const timerEl = document.getElementById("timer");
    if(!timerEl) return;
    const elapsed = getCurrentSessionElapsedSeconds();
    timerEl.innerText = formatTime(elapsed);
}

function startTimerInterval(){
    if(sessionInterval !== null) return;
    sessionInterval = setInterval(updateTimerDisplay, 1000);
}

function clearTimerInterval(){
    if(sessionInterval === null) return;
    clearInterval(sessionInterval);
    sessionInterval = null;
}

window.addEventListener("load", function(){
    const { isActive } = getCurrentSessionState();
    if(isActive){
        updateTimerDisplay();
        startTimerInterval();
    }else{
        const timerEl = document.getElementById("timer");
        if(timerEl){
            timerEl.innerText = formatTime(0);
        }
    }
});

function startWorkout(){
    const { isActive } = getCurrentSessionState();
    if(isActive) return;

    const now = Date.now();
    localStorage.setItem("currentSessionActive", "true");
    localStorage.setItem("currentSessionStart", String(now));

    updateTimerDisplay();
    startTimerInterval();
}

function stopWorkout(){
    const { isActive } = getCurrentSessionState();
    if(!isActive) return;

    const elapsed = getCurrentSessionElapsedSeconds();

    clearTimerInterval();
    localStorage.removeItem("currentSessionActive");
    localStorage.removeItem("currentSessionStart");

    saveWorkoutData(elapsed);

    const timerEl = document.getElementById("timer");
    if(timerEl){
        timerEl.innerText = formatTime(0);
    }
}

function saveWorkoutData(durationSeconds){

    let totalWorkouts =
    parseInt(localStorage.getItem("totalWorkouts") || 0);

    let totalTime =
    parseInt(localStorage.getItem("totalTime") || 0);

    totalWorkouts += 1;
    totalTime += durationSeconds;

    localStorage.setItem("totalWorkouts", totalWorkouts);
    localStorage.setItem("totalTime", totalTime);

    saveHistory(durationSeconds);

    alert("Workout Saved!");

}

function saveHistory(time){

    let history =
    JSON.parse(localStorage.getItem("history")) || [];

    history.push({
        date: new Date().toLocaleString(),
        time: time
    });

    localStorage.setItem("history", JSON.stringify(history));

}
