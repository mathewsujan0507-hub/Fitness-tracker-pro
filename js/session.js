let intervalId = null;
let activePlan = null;
let currentExerciseIndex = 0;
let currentSetIndex = 1;
let phase = "idle"; // idle | work | rest | finished
let countdown = 0;
let totalElapsed = 0;
let currentExerciseDuration = 0; // base time for this set
let currentRestType = null; // "set" | "exercise"
let extraRestOffered = false; // used for extra time after a set
let isPaused = false;

const REST_CONFIG = {
    beginner: { perSet: 50, perExercise: 75 },
    advanced: { perSet: 90, perExercise: 120 }
};

const EXERCISE_DURATIONS = {
    beginner: {
        "Push-Ups": 40,
        "Incline Push-Ups": 40,
        "Dumbbell Bench Press": 45,
        "Chest Fly (Machine or Dumbbell)": 50,
        "Lat Pulldown": 45,
        "Seated Cable Row": 45,
        "Assisted Pull-Ups": 35,
        "Dumbbell Deadlift": 45,
        "Dumbbell Bicep Curl": 45,
        "Hammer Curl": 45,
        "Cable Curl": 50,
        "Concentration Curl": 40,
        "Tricep Pushdown": 45,
        "Bench Dips": 40,
        "Overhead Dumbbell Extension": 45,
        "Close Grip Push-Ups": 40,
        "Dumbbell Shoulder Press": 45,
        "Lateral Raises": 50,
        "Front Raises": 45,
        "Shrugs": 40,
        "Bodyweight Squats": 50,
        "Leg Press": 50,
        "Walking Lunges": 50,
        "Leg Curl": 45,
        "Calf Raises": 45,
        "Crunches": 35,
        "Leg Raises": 40,
        "Plank": 30,
        "Mountain Climbers": 40
    },
    advanced: {
        "Barbell Bench Press": 35,
        "Incline Dumbbell Press": 40,
        "Cable Chest Fly": 50,
        "Decline Push-Ups": 45,
        "Chest Dips": 40,
        "Pull-Ups": 35,
        "Barbell Deadlift": 30,
        "T-Bar Row": 40,
        "Single Arm Dumbbell Row": 45,
        "Face Pulls": 45,
        "Barbell Curl": 35,
        "Incline Dumbbell Curl": 45,
        "Preacher Curl": 45,
        "Hammer Curl (Heavy)": 35,
        "Cable Drop Set Curls": 60,
        "Close Grip Bench Press": 35,
        "Skull Crushers": 45,
        "Rope Pushdown": 45,
        "Overhead Cable Extension": 45,
        "Weighted Dips": 35,
        "Barbell Overhead Press": 35,
        "Arnold Press": 45,
        "Lateral Raise (Drop Set)": 60,
        "Rear Delt Fly": 50,
        "Upright Row": 40,
        "Barbell Squats": 35,
        "Romanian Deadlift": 40,
        "Bulgarian Split Squats": 45,
        "Leg Extension": 45,
        "Standing Calf Raise": 45,
        "Hanging Leg Raises": 40,
        "Cable Crunch": 45,
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
    currentRestType = currentSetIndex < totalSets ? "set" : "exercise";

    if(!extraRestOffered){
        // first time finishing this set: offer extra time
        extraRestOffered = true;
        showExtraRestPrompt();
        return;
    }

    // extra time already handled (or skipped), move into rest
    extraRestOffered = false;
    startRest(currentRestType === "exercise");
}

function onRestComplete(){
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
            // extra time is half of current exercise base time
            phase = "work";
            countdown = Math.round(currentExerciseDuration / 2);
            hideExtraRestPrompt();
            startInterval();
        });
    }

    if(noBtn){
        noBtn.addEventListener("click", function(){
            // skip extra time and proceed to rest
            hideExtraRestPrompt();
            const wasExtraOffered = extraRestOffered;
            if(wasExtraOffered){
                extraRestOffered = true;
                onExerciseSetComplete();
            }
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
    if(intervalId !== null){
        // already running
        return;
    }

    if(phase === "idle" || phase === "finished"){
        // fresh start
        totalElapsed = 0;
        currentExerciseIndex = 0;
        currentSetIndex = 1;
        phase = "work";
        startExerciseSet();
    }else{
        // resume from pause
        isPaused = false;
        startInterval();
    }
}

function pauseWorkout(){
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
        isPaused = true;
    }
}

function stopWorkout(){
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
    finishPlan();
}

function finishPlan(){
    if(intervalId !== null){
        clearInterval(intervalId);
        intervalId = null;
    }
    phase = "finished";
    updateUI();

    if(totalElapsed > 0){
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
