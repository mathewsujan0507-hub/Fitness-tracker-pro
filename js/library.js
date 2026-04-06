const workouts = [
    {
        id: "chest",
        name: "Chest Day",
        beginner: [
            {
                name: "Push-Ups",
                scheme: "3 × 10–12",
                description: "Keep hands slightly wider than shoulders and body straight from head to heels. Lower chest toward floor, then push back up without arching your back."
            },
            {
                name: "Incline Push-Ups",
                scheme: "3 × 8–10",
                description: "Place hands on a bench or elevated surface, keeping your body straight. Lower chest to the bench and push up while keeping core tight."
            },
            {
                name: "Dumbbell Bench Press",
                scheme: "3 × 10",
                description: "Lie on a bench holding dumbbells at chest level. Press upward until arms are straight, then lower slowly under control."
            },
            {
                name: "Chest Fly (Machine or Dumbbell)",
                scheme: "3 × 12",
                description: "Keep a slight bend in the elbows and open arms wide. Bring weights together in front of the chest by squeezing the chest muscles."
            }
        ],
        advanced: [
            {
                name: "Barbell Bench Press",
                scheme: "4 × 8",
                description: "Grip the bar slightly wider than shoulders and lower it to mid-chest. Press upward explosively while keeping feet planted."
            },
            {
                name: "Incline Dumbbell Press",
                scheme: "4 × 10",
                description: "Lie on an incline bench with dumbbells at chest level. Press upward and lower under control to target the upper chest."
            },
            {
                name: "Cable Chest Fly",
                scheme: "3 × 12",
                description: "Stand between cables with a slight forward lean. Bring handles together in front of the chest, squeezing at the center."
            },
            {
                name: "Decline Push-Ups",
                scheme: "3 × 15",
                description: "Place feet elevated on a bench and hands on the floor. Lower chest toward the floor and push back up steadily."
            },
            {
                name: "Chest Dips",
                scheme: "3 × 8–10",
                description: "Hold dip bars and lean slightly forward. Lower body until elbows bend about 90°, then push back up."
            }
        ]
    },
    {
        id: "back",
        name: "Back Day",
        beginner: [
            {
                name: "Lat Pulldown",
                scheme: "3 × 12",
                description: "Grip the bar wide and pull it down to upper chest level. Slowly return to the start while controlling the movement."
            },
            {
                name: "Seated Cable Row",
                scheme: "3 × 12",
                description: "Sit upright and pull the handle toward your abdomen. Squeeze shoulder blades together, then extend arms slowly."
            },
            {
                name: "Assisted Pull-Ups",
                scheme: "3 × 8",
                description: "Use an assisted machine and grip the bar slightly wider than shoulders. Pull chin above the bar and lower down with control."
            },
            {
                name: "Dumbbell Deadlift",
                scheme: "3 × 10",
                description: "Hold dumbbells in front and hinge at the hips. Lower weights along your legs, then stand up squeezing the glutes."
            }
        ],
        advanced: [
            {
                name: "Pull-Ups",
                scheme: "4 × 8–10",
                description: "Hang from the bar and pull your body upward until chin passes the bar. Lower slowly until arms are fully extended."
            },
            {
                name: "Barbell Deadlift",
                scheme: "4 × 6–8",
                description: "Keep the bar close to shins and hinge at hips with a flat back. Drive through heels to stand tall, squeezing glutes."
            },
            {
                name: "T-Bar Row",
                scheme: "3 × 10",
                description: "Hold the T-bar handle and bend slightly forward. Pull weight toward the chest and lower under control."
            },
            {
                name: "Single Arm Dumbbell Row",
                scheme: "3 × 12",
                description: "Place one knee on a bench and pull the dumbbell toward your waist. Lower slowly while keeping your back straight."
            },
            {
                name: "Face Pulls",
                scheme: "3 × 15",
                description: "Pull the rope attachment toward your face at eye level. Squeeze rear shoulders and return slowly."
            }
        ]
    },
    {
        id: "biceps",
        name: "Biceps Day",
        beginner: [
            {
                name: "Dumbbell Bicep Curl",
                scheme: "3 × 12",
                description: "Keep elbows close to your body and curl dumbbells upward. Lower slowly without swinging."
            },
            {
                name: "Hammer Curl",
                scheme: "3 × 12",
                description: "Hold dumbbells with palms facing inward. Curl upward while keeping wrists neutral."
            },
            {
                name: "Cable Curl",
                scheme: "3 × 12",
                description: "Hold the cable bar and curl toward your shoulders. Control the weight while lowering back down."
            },
            {
                name: "Concentration Curl",
                scheme: "2 × 12",
                description: "Sit and rest elbow on inner thigh. Curl the weight upward slowly and squeeze at the top."
            }
        ],
        advanced: [
            {
                name: "Barbell Curl",
                scheme: "4 × 8–10",
                description: "Grip the bar shoulder-width and curl upward. Lower slowly without using momentum."
            },
            {
                name: "Incline Dumbbell Curl",
                scheme: "3 × 10",
                description: "Sit on an incline bench and let arms hang down. Curl upward, fully stretching at the bottom."
            },
            {
                name: "Preacher Curl",
                scheme: "3 × 10",
                description: "Rest arms on the preacher bench pad. Curl upward and lower slowly for a full stretch."
            },
            {
                name: "Hammer Curl (Heavy)",
                scheme: "3 × 8",
                description: "Use heavier dumbbells in the hammer grip. Curl upward with strict form and control the lowering."
            },
            {
                name: "Cable Drop Set Curls",
                scheme: "2 sets",
                description: "Perform curls to fatigue, then reduce weight and continue without rest to intensify the set."
            }
        ]
    },
    {
        id: "triceps",
        name: "Triceps Day",
        beginner: [
            {
                name: "Tricep Pushdown",
                scheme: "3 × 12",
                description: "Grip the cable rope and push downward fully extending arms. Slowly return to the starting position."
            },
            {
                name: "Bench Dips",
                scheme: "3 × 10",
                description: "Place hands on a bench and lower your body downward. Push up until arms straighten."
            },
            {
                name: "Overhead Dumbbell Extension",
                scheme: "3 × 12",
                description: "Hold a dumbbell overhead with both hands. Lower behind the head and extend arms upward."
            },
            {
                name: "Close Grip Push-Ups",
                scheme: "2 × 12",
                description: "Keep hands close together under the chest. Lower body and push up focusing on triceps."
            }
        ],
        advanced: [
            {
                name: "Close Grip Bench Press",
                scheme: "4 × 8",
                description: "Grip the bar slightly narrower than shoulders. Lower to the chest and press back up."
            },
            {
                name: "Skull Crushers",
                scheme: "3 × 10",
                description: "Lie on a bench and lower the bar toward your forehead. Extend arms upward without moving elbows."
            },
            {
                name: "Rope Pushdown",
                scheme: "3 × 12",
                description: "Push the rope downward and spread the ends at the bottom. Return slowly to the starting position."
            },
            {
                name: "Overhead Cable Extension",
                scheme: "3 × 12",
                description: "Face away from the cable and extend arms overhead. Slowly bend elbows to return."
            },
            {
                name: "Weighted Dips",
                scheme: "3 × 8",
                description: "Attach a weight belt and hold dip bars. Lower body and push up under control."
            }
        ]
    },
    {
        id: "shoulders",
        name: "Shoulders (Delts)",
        beginner: [
            {
                name: "Dumbbell Shoulder Press",
                scheme: "3 × 10",
                description: "Hold dumbbells at shoulder height. Press overhead and lower slowly."
            },
            {
                name: "Lateral Raises",
                scheme: "3 × 12",
                description: "Hold dumbbells at your sides. Raise arms sideways to shoulder height and lower under control."
            },
            {
                name: "Front Raises",
                scheme: "3 × 12",
                description: "Lift dumbbells straight in front of you to shoulder height. Lower slowly without swinging."
            },
            {
                name: "Shrugs",
                scheme: "3 × 15",
                description: "Hold dumbbells and lift shoulders upward toward ears. Lower slowly after squeezing traps."
            }
        ],
        advanced: [
            {
                name: "Barbell Overhead Press",
                scheme: "4 × 8",
                description: "Press the barbell from shoulder height overhead. Lower back under control."
            },
            {
                name: "Arnold Press",
                scheme: "3 × 10",
                description: "Start with palms facing you at shoulder level. Rotate palms outward as you press overhead."
            },
            {
                name: "Lateral Raise (Drop Set)",
                scheme: "3 sets",
                description: "Perform lateral raises to fatigue, then drop the weight and continue without rest."
            },
            {
                name: "Rear Delt Fly",
                scheme: "3 × 12",
                description: "Bend slightly forward holding dumbbells. Raise arms outward, squeezing rear shoulders."
            },
            {
                name: "Upright Row",
                scheme: "3 × 10",
                description: "Hold a barbell and pull upward to chest level, keeping elbows higher than wrists."
            }
        ]
    },
    {
        id: "legs",
        name: "Legs Day",
        beginner: [
            {
                name: "Bodyweight Squats",
                scheme: "3 × 15",
                description: "Stand shoulder-width apart and lower hips back. Push through heels to stand up."
            },
            {
                name: "Leg Press",
                scheme: "3 × 12",
                description: "Place feet on the platform shoulder-width apart. Lower the sled and press back upward."
            },
            {
                name: "Walking Lunges",
                scheme: "3 × 10 (each leg)",
                description: "Step forward and lower the back knee toward the ground. Push forward into the next step."
            },
            {
                name: "Leg Curl",
                scheme: "3 × 12",
                description: "Sit or lie on the machine and curl the weight toward you. Lower slowly to stretch hamstrings."
            },
            {
                name: "Calf Raises",
                scheme: "3 × 20",
                description: "Stand on toes and lift heels upward. Lower slowly for a full stretch."
            }
        ],
        advanced: [
            {
                name: "Barbell Squats",
                scheme: "4 × 8",
                description: "Place the bar on upper back and squat down. Drive through heels to stand tall."
            },
            {
                name: "Romanian Deadlift",
                scheme: "4 × 8",
                description: "Hold the bar and hinge at the hips, lowering slowly. Keep back straight and stand back up."
            },
            {
                name: "Bulgarian Split Squats",
                scheme: "3 × 10",
                description: "Place the rear foot on a bench. Lower the front leg into a lunge and push upward."
            },
            {
                name: "Leg Extension",
                scheme: "3 × 12",
                description: "Sit on the machine and extend legs straight. Lower slowly under control."
            },
            {
                name: "Standing Calf Raise",
                scheme: "4 × 15",
                description: "Lift heels upward while standing. Pause briefly at the top before lowering."
            }
        ]
    },
    {
        id: "abs",
        name: "Abs Day",
        beginner: [
            {
                name: "Crunches",
                scheme: "3 × 15",
                description: "Lie on your back and lift shoulders off the floor. Lower slowly without pulling the neck."
            },
            {
                name: "Leg Raises",
                scheme: "3 × 12",
                description: "Lie flat and lift legs upward. Lower slowly without arching the back."
            },
            {
                name: "Plank",
                scheme: "3 × 30 sec",
                description: "Hold forearms on the ground with body straight. Keep core tight and avoid sagging hips."
            },
            {
                name: "Mountain Climbers",
                scheme: "3 × 20",
                description: "Start in push-up position. Drive knees toward the chest alternately at a steady pace."
            }
        ],
        advanced: [
            {
                name: "Hanging Leg Raises",
                scheme: "4 × 12",
                description: "Hang from a bar and lift legs upward. Lower slowly under control."
            },
            {
                name: "Cable Crunch",
                scheme: "3 × 15",
                description: "Kneel and pull the cable downward using abs. Return slowly to the stretch position."
            },
            {
                name: "Russian Twists (Weighted)",
                scheme: "3 × 20",
                description: "Sit slightly reclined and rotate the torso side to side while holding a weight."
            },
            {
                name: "Plank",
                scheme: "3 × 1 min",
                description: "Hold the plank position longer, focusing on keeping the body straight and core braced."
            },
            {
                name: "Ab Rollout",
                scheme: "3 × 12",
                description: "Use an ab wheel and roll forward slowly. Pull back using core strength without arching the lower back."
            }
        ]
    }
];

window.addEventListener("load", function(){
    loadLibrary();
});

async function getPlans(){
    try {
        const res = await fetch('/api/plans');
        if(res.ok) return await res.json();
    } catch(e){}
    return [];
}

async function savePlans(plans){
    try {
        await fetch('/api/plans', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(plans)
        });
    } catch(e){}
}

function loadLibrary(){

    let container = document.getElementById("libraryGrid");
    if(!container) return;

    workouts.forEach(workout => {

        container.innerHTML += `
            <div class="library-card" data-workout="${workout.id}">
                <h3>${workout.name}</h3>
                <p class="card-subtitle">Tap a level to preview the full routine.</p>
                <div class="library-actions">
                    <button onclick="selectPlanLevel('${workout.id}','beginner')">
                        Beginner Plan
                    </button>
                    <button onclick="selectPlanLevel('${workout.id}','advanced')">
                        Advanced Plan
                    </button>
                </div>
                <div class="exercise-list"></div>
            </div>
        `;

    });
}

function selectPlanLevel(id, levelKey){

    const workout = workouts.find(w => w.id === id);
    if(!workout) return;

    let levelLabel;
    let exercises;

    if(levelKey === "beginner"){
        levelLabel = "Beginner Plan";
        exercises = workout.beginner;
    }else if(levelKey === "advanced"){
        levelLabel = "Advanced Plan";
        exercises = workout.advanced;
    }else{
        return;
    }

    const card = document.querySelector(`.library-card[data-workout="${id}"]`);
    if(!card) return;

    const listContainer = card.querySelector(".exercise-list");
    if(!listContainer) return;

    const items = exercises.map(e => `
        <li>
            <strong>${e.name}</strong> – ${e.scheme}
            <div class="exercise-description">${e.description}</div>
        </li>
    `).join("");

    listContainer.innerHTML = `
        <h4>${levelLabel}</h4>
        <ul>${items}</ul>
        <button class="add-plan-button" onclick="addToPlanner('${id}','${levelKey}')">
            Add this plan to Planner
        </button>
    `;

}

async function addToPlanner(id, levelKey){

    let plans = await getPlans();

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

    const planExercises = exercises.map(e => ({
        name: e.name,
        scheme: e.scheme
    }));

    plans.push({
        name: `${workout.name} (${level})`,
        level: level,
        exercises: planExercises
    });

    await savePlans(plans);

    alert("Plan added to Planner");

}
