const workouts = [
    {
        id: "chest",
        name: "Chest Day",
        beginner: [
            { name: "Push-Ups", scheme: "3 × 10–12" },
            { name: "Incline Push-Ups", scheme: "3 × 8–10" },
            { name: "Dumbbell Bench Press", scheme: "3 × 10" },
            { name: "Chest Fly (Machine or Dumbbell)", scheme: "3 × 12" }
        ],
        advanced: [
            { name: "Barbell Bench Press", scheme: "4 × 8" },
            { name: "Incline Dumbbell Press", scheme: "4 × 10" },
            { name: "Cable Chest Fly", scheme: "3 × 12" },
            { name: "Decline Push-Ups", scheme: "3 × 15" },
            { name: "Chest Dips", scheme: "3 × 8–10" }
        ]
    },
    {
        id: "back",
        name: "Back Day",
        beginner: [
            { name: "Lat Pulldown", scheme: "3 × 12" },
            { name: "Seated Cable Row", scheme: "3 × 12" },
            { name: "Assisted Pull-Ups", scheme: "3 × 8" },
            { name: "Dumbbell Deadlift", scheme: "3 × 10" }
        ],
        advanced: [
            { name: "Pull-Ups", scheme: "4 × 8–10" },
            { name: "Barbell Deadlift", scheme: "4 × 6–8" },
            { name: "T-Bar Row", scheme: "3 × 10" },
            { name: "Single Arm Dumbbell Row", scheme: "3 × 12" },
            { name: "Face Pulls", scheme: "3 × 15" }
        ]
    },
    {
        id: "biceps",
        name: "Biceps Day",
        beginner: [
            { name: "Dumbbell Bicep Curl", scheme: "3 × 12" },
            { name: "Hammer Curl", scheme: "3 × 12" },
            { name: "Cable Curl", scheme: "3 × 12" },
            { name: "Concentration Curl", scheme: "2 × 12" }
        ],
        advanced: [
            { name: "Barbell Curl", scheme: "4 × 8–10" },
            { name: "Incline Dumbbell Curl", scheme: "3 × 10" },
            { name: "Preacher Curl", scheme: "3 × 10" },
            { name: "Hammer Curl (Heavy)", scheme: "3 × 8" },
            { name: "Cable Drop Set Curls", scheme: "2 sets" }
        ]
    },
    {
        id: "triceps",
        name: "Triceps Day",
        beginner: [
            { name: "Tricep Pushdown", scheme: "3 × 12" },
            { name: "Bench Dips", scheme: "3 × 10" },
            { name: "Overhead Dumbbell Extension", scheme: "3 × 12" },
            { name: "Close Grip Push-Ups", scheme: "2 × 12" }
        ],
        advanced: [
            { name: "Close Grip Bench Press", scheme: "4 × 8" },
            { name: "Skull Crushers", scheme: "3 × 10" },
            { name: "Rope Pushdown", scheme: "3 × 12" },
            { name: "Overhead Cable Extension", scheme: "3 × 12" },
            { name: "Weighted Dips", scheme: "3 × 8" }
        ]
    },
    {
        id: "shoulders",
        name: "Shoulders (Delts)",
        beginner: [
            { name: "Dumbbell Shoulder Press", scheme: "3 × 10" },
            { name: "Lateral Raises", scheme: "3 × 12" },
            { name: "Front Raises", scheme: "3 × 12" },
            { name: "Shrugs", scheme: "3 × 15" }
        ],
        advanced: [
            { name: "Barbell Overhead Press", scheme: "4 × 8" },
            { name: "Arnold Press", scheme: "3 × 10" },
            { name: "Lateral Raise (Drop Set)", scheme: "3 sets" },
            { name: "Rear Delt Fly", scheme: "3 × 12" },
            { name: "Upright Row", scheme: "3 × 10" }
        ]
    },
    {
        id: "legs",
        name: "Legs Day",
        beginner: [
            { name: "Bodyweight Squats", scheme: "3 × 15" },
            { name: "Leg Press", scheme: "3 × 12" },
            { name: "Walking Lunges", scheme: "3 × 10 (each leg)" },
            { name: "Leg Curl", scheme: "3 × 12" },
            { name: "Calf Raises", scheme: "3 × 20" }
        ],
        advanced: [
            { name: "Barbell Squats", scheme: "4 × 8" },
            { name: "Romanian Deadlift", scheme: "4 × 8" },
            { name: "Bulgarian Split Squats", scheme: "3 × 10" },
            { name: "Leg Extension", scheme: "3 × 12" },
            { name: "Standing Calf Raise (Heavy)", scheme: "4 × 15" }
        ]
    },
    {
        id: "abs",
        name: "Abs Day",
        beginner: [
            { name: "Crunches", scheme: "3 × 15" },
            { name: "Leg Raises", scheme: "3 × 12" },
            { name: "Plank", scheme: "3 × 30 sec" },
            { name: "Mountain Climbers", scheme: "3 × 20" }
        ],
        advanced: [
            { name: "Hanging Leg Raises", scheme: "4 × 12" },
            { name: "Cable Crunch", scheme: "3 × 15" },
            { name: "Russian Twists (Weighted)", scheme: "3 × 20" },
            { name: "Plank", scheme: "3 × 1 min" },
            { name: "Ab Rollout", scheme: "3 × 12" }
        ]
    }
];

window.addEventListener("load", function(){
    loadLibrary();
});

function getPlans(){
    return JSON.parse(localStorage.getItem("plans")) || [];
}

function savePlans(plans){
    localStorage.setItem("plans", JSON.stringify(plans));
}

function loadLibrary(){

    let container = document.getElementById("libraryGrid");

    workouts.forEach(workout => {

        container.innerHTML += `
            <div class="library-card" data-workout="${workout.id}">
                <h3>${workout.name}</h3>
                <p class="card-subtitle">Choose a level to add a ready-made plan.</p>
                <div class="library-actions">
                    <button onclick="addToPlanner('${workout.id}','beginner')">
                        Beginner Plan
                    </button>
                    <button onclick="addToPlanner('${workout.id}','advanced')">
                        Advanced Plan
                    </button>
                </div>
                <div class="exercise-list"></div>
            </div>
        `;

    });
}

function addToPlanner(id, levelKey){

    let plans = getPlans();

    const workout = workouts.find(w => w.id === id);
    if(!workout){
        alert("Workout not found");
        return;
    }

    let level;
    let exercises;

    if(levelKey === "beginner"){
        level = "Beginner";
        exercises = workout.beginner;
    }else if(levelKey === "advanced"){
        level = "Advanced";
        exercises = workout.advanced;
    }else{
        alert("Unknown level selected");
        return;
    }

    plans.push({
        name: `${workout.name} (${level})`,
        level: level,
        exercises: exercises
    });

    savePlans(plans);

    const card = document.querySelector(`.library-card[data-workout="${id}"]`);
    if(card){
        const listContainer = card.querySelector(".exercise-list");
        if(listContainer){
            const items = exercises.map(e => `<li>${e.name} – ${e.scheme}</li>`).join("");
            listContainer.innerHTML = `
                <h4>${level} Plan</h4>
                <ul>${items}</ul>
            `;
        }
    }

    alert("Plan added to Planner");

}
