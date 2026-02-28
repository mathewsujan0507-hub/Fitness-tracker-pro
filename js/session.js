let intervalId = null;
let activePlan = null;
let currentExerciseIndex = 0;
let currentSetIndex = 1;
let phase = "idle"; // idle | work | rest | finished
let countdown = 0;
let totalElapsed = 0;
let currentExerciseDuration = 0;
let currentRestType = null; // "set" | "exercise"
let extraRestOffered = false;

const REST_CONFIG = {
    beginner: { perSet: 50, perExercise: 75 },
    advanced: { perSet: 90, perExercise: 120 }
};

const EXERCISE_DURATIONS = {
    beginner: {
        "Push-Ups": 30,
        "Incline Push-Ups": 30,
        "Dumbbell Bench Press": 40,
        "Chest Fly (Machine or Dumbbell)": 40,
        "Lat Pulldown": 40,
        "Seated Cable Row": 40,
        "Assisted Pull-Ups": 30,
        "Dumbbell Deadlift": 40,
        "Dumbbell Bicep Curl": 35,
        "Hammer Curl": 35,
        "Cable Curl": 40,
        "Concentration Curl": 35,
        "Tricep Pushdown": 40,
        "Bench Dips": 30,
        "Overhead Dumbbell Extension": 40,
        "Close Grip Push-Ups": 30,
        "Dumbbell Shoulder Press": 40,
        "Lateral Raises": 35,
        "Front Raises": 35,
        "Shrugs": 40,
        "Bodyweight Squats": 40,
        "Leg Press": 45,
        "Walking Lunges": 40,
        "Leg Curl": 40,
        "Calf Raises": 45,
        "Crunches": 30,
        "Leg Raises": 30,
        "Plank": 30,
        "Mountain Climbers": 30
    },
    advanced: {
        "Barbell Bench Press": 45,
        "Incline Dumbbell Press": 45,
        "Cable Chest Fly": 40,
        "Decline Push-Ups": 40,
        "Chest Dips": 40,
        "Pull-Ups": 40,
        "Barbell Deadlift": 45,
        "T-Bar Row": 40,
        "Single Arm Dumbbell Row": 40,
        "Face Pulls": 40,
        "Barbell Curl": 40,
        "Incline Dumbbell Curl": 40,
        "Preacher Curl": 40,
        "Hammer Curl (Heavy)": 35,
        "Cable Drop Set Curls": 60,
        "Close Grip Bench Press": 45,
        "Skull Crushers": 40,
        "Rope Pushdown": 40,
        "Overhead Cable Extension": 40,
        "Weighted Dips": 40,
        "Barbell Overhead Press": 45,
        "Arnold Press": 40,
        "Lateral Raise (Drop Set)": 60,
        "Rear Delt Fly": 40,
        "Upright Row": 40,
        "Barbell Squats": 45,
        "Romanian Deadlift": 45,
        "Bulgarian Split Squats": 40,
        "Leg Extension": 40,
        "Standing Calf Raise": 45,
        "Hanging Leg Raises": 40,
        "Cable Crunch": 40,
        "Russian Twists (Weighted)": 40,
        "Ab Rollout": 40,
        "Plank Advanced": 60
    }
};

function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
}

function getSetsFromScheme(scheme){
    if(!scheme) return 3;
    const match = scheme.match(/(\d+)/);
    if(!match) return 3;
    const n = parseInt(match[1], 10);
    return isNaN(n) ? 3 : n;
}

function getLevelKey(){
    if(!activePlan || !activePlan.level) return "beginner";
    const key = activePlan.level.toLowerCase();
    return key === "advanced" ? "advanced" : "beginner";
}

function getExerciseDuration(name){
    const levelKey = getLevelKey();
    const byLevel = EXERCISE_DURATIONS[levelKey] || {};
    return byLevel[name] || 40;
}

function updateUI(){
    const planNameEl = document.getElementById("sessionPlanName");
    const phaseEl = document.getElementById("sessionPhase");
    const exNameEl = document.getElementById("sessionExerciseName");
    const descEl = document.getElementById("sessionExerciseDescription");
    const timerEl = document.getElementById("timer");
    const metaEl = document.getElementById("sessionMeta");

    if(planNameEl){
        planNameEl.innerText = activePlan ? activePlan.name : "No plan selected";
    }

    if(!activePlan){
        if(phaseEl) phaseEl.innerText = "Idle";
        if(timerEl) timerEl.innerText = formatTime(0);
        if(exNameEl) exNameEl.innerText = "";
        if(descEl) descEl.innerText = "";
        if(metaEl) metaEl.innerText = "Go to Planner and press Start on a plan.";
        return;
    }

    const exercises = activePlan.exercises || [];
    const ex = exercises[currentExerciseIndex];

    if(phaseEl){
        if(phase === "work"){
            phaseEl.innerText = "Exercise";
        }else if(phase === "rest"){
            phaseEl.innerText = "Rest";
        }else if(phase === "finished"){
            phaseEl.innerText = "Finished";
        }else{
            phaseEl.innerText = "Ready";
        }
    }

    if(ex){
        if(exNameEl) exNameEl.innerText = ex.name || "";
        if(descEl) descEl.innerText = ex.description || "";
        const totalSets = getSetsFromScheme(ex.scheme);
        if(metaEl){
            metaEl.innerText = `Set ${currentSetIndex} of ${totalSets}`;
        }
    }else{
        if(exNameEl) exNameEl.innerText = "";
        if(descEl) descEl.innerText = "";
        if(metaEl) metaEl.innerText = "";
    }

    if(timerEl){
        timerEl.innerText = formatTime(countdown);
    }
}

function tick(){
    if(countdown <= 0){
        clearInterval(intervalId);
        intervalId = null;
        if(phase === "work"){
            onExerciseSetComplete();
        }else if(phase === "rest"){
            onRestComplete();
        }
        return;
    }
    countdown--;
    totalElapsed++;
    updateUI();
}

function startInterval(){
    if(intervalId !== null) return;
    intervalId = setInterval(tick, 1000);
}

function startExerciseSet(){
    const exercises = activePlan.exercises || [];
    const ex = exercises[currentExerciseIndex];
    if(!ex){
        finishPlan();
        return;
    }

    phase = "work";
    currentExerciseDuration = getExerciseDuration(ex.name);
    countdown = currentExerciseDuration;
    extraRestOffered = false;
    hideExtraRestPrompt();
    updateUI();
    startInterval();
}

function startRest(isBetweenExercises){
    const levelKey = getLevelKey();
    const cfg = REST_CONFIG[levelKey] || REST_CONFIG.beginner;
    currentRestType = isBetweenExercises ? "exercise" : "set";
    const baseRest = isBetweenExercises ? cfg.perExercise : cfg.perSet;

    phase = "rest";
    countdown = baseRest;
    extraRestOffered = false;
    hideExtraRestPrompt();
    updateUI();
    startInterval();
}

function onExerciseSetComplete(){
    const exercises = activePlan.exercises || [];
    const ex = exercises[currentExerciseIndex];
    if(!ex){
        finishPlan();
        return;
    }
    const totalSets = getSetsFromScheme(ex.scheme);
    if(currentSetIndex < totalSets){
        startRest(false);
    }else{
        // finished all sets for this exercise
        startRest(true);
    }
}

function onRestComplete(){
    if(!extraRestOffered){
        // first time rest finished, offer extra time
        showExtraRestPrompt();
        extraRestOffered = true;
        return;
    }

    hideExtraRestPrompt();

    const exercises = activePlan.exercises || [];
    const ex = exercises[currentExerciseIndex];
    if(!ex){
        finishPlan();
        return;
    }
    const totalSets = getSetsFromScheme(ex.scheme);

    if(currentRestType === "set"){
        // go to next set
        currentSetIndex++;
        if(currentSetIndex > totalSets){
            // safety: move to next exercise
            goToNextExercise();
        }else{
            startExerciseSet();
        }
    }else if(currentRestType === "exercise"){
        // go to next exercise
        goToNextExercise();
    }
}

function goToNextExercise(){
    const exercises = activePlan.exercises || [];
    currentExerciseIndex++;
    if(currentExerciseIndex >= exercises.length){
        finishPlan();
        return;
    }
    currentSetIndex = 1;
    startExerciseSet();
}

function showExtraRestPrompt(){
    const controls = document.getElementById("extraRestControls");
    if(!controls) return;
    controls.classList.remove("hidden");
}

function hideExtraRestPrompt(){
    const controls = document.getElementById("extraRestControls");
    if(!controls) return;
    controls.classList.add("hidden");
}

window.addEventListener("load", function(){
    const planJson = localStorage.getItem("activePlan");
    if(planJson){
        try{
            activePlan = JSON.parse(planJson);
        }catch(e){
            activePlan = null;
        }
    }

    const yesBtn = document.getElementById("extraRestYes");
    const noBtn = document.getElementById("extraRestNo");

    if(yesBtn){
        yesBtn.addEventListener("click", function(){
            // extra rest is half of current exercise time
            phase = "rest";
            countdown = Math.round(currentExerciseDuration / 2);
            hideExtraRestPrompt();
            startInterval();
        });
    }

    if(noBtn){
        noBtn.addEventListener("click", function(){
            // proceed without extra rest
            onRestComplete();
        });
    }

    totalElapsed = 0;
    currentExerciseIndex = 0;
    currentSetIndex = 1;
    phase = "idle";
    countdown = 0;
    updateUI();
});

function startWorkout(){
    if(!activePlan){
        alert("No plan selected. Go to Planner and press Start on a plan.");
        return;
    }
    if(intervalId !== null && phase !== "finished"){
        // already running
        return;
    }

    totalElapsed = 0;
    currentExerciseIndex = 0;
    currentSetIndex = 1;
    phase = "work";
    startExerciseSet();
}

function stopWorkout(){
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
    finishPlan(true);
}

function finishPlan(manual){
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
    phase = "finished";
    updateUI();

    if(totalElapsed > 0 && !manual){
        saveWorkoutData(totalElapsed);
    }

    // clear active plan so next visit starts fresh
    localStorage.removeItem("activePlan");
    activePlan = null;
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
