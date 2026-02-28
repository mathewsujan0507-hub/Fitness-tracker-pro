let timer = 0;
let interval = null;

function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
}

function startWorkout(){

    if(interval !== null) return;

    interval = setInterval(()=>{
        timer++;
        document.getElementById("timer").innerText = formatTime(timer);
    },1000);

}

function stopWorkout(){

    clearInterval(interval);
    interval = null;

    saveWorkoutData();

}

function saveWorkoutData(){

    let totalWorkouts =
    parseInt(localStorage.getItem("totalWorkouts") || 0);

    let totalTime =
    parseInt(localStorage.getItem("totalTime") || 0);

    totalWorkouts += 1;
    totalTime += timer;

    localStorage.setItem("totalWorkouts", totalWorkouts);
    localStorage.setItem("totalTime", totalTime);

    saveHistory(timer);

    alert("Workout Saved!");

    timer = 0;
    document.getElementById("timer").innerText = formatTime(0);

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
