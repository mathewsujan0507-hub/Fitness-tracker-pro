let selectedWorkoutId = null;

// LOAD PLANS + set up modal on PAGE LOAD
window.addEventListener("load", function(){
    loadPlans();
    setupPlanModal();
});

function getPlans(){
    return JSON.parse(localStorage.getItem("plans")) || [];
}

function savePlans(plans){
    localStorage.setItem("plans", JSON.stringify(plans));
}

function setupPlanModal(){
    const openBtn = document.getElementById("openPlanSelector");
    const overlay = document.getElementById("planOverlay");
    const workoutList = document.getElementById("modalWorkoutList");
    const stepWorkouts = document.getElementById("modalStepWorkouts");
    const stepLevels = document.getElementById("modalStepLevels");
    const selectedTitle = document.getElementById("selectedWorkoutTitle");
    const beginnerBtn = document.getElementById("modalBeginnerButton");
    const advancedBtn = document.getElementById("modalAdvancedButton");
    const closeBtn = document.getElementById("closePlanModal");
    const backBtn = document.getElementById("modalBackToWorkouts");

    if(!openBtn || !overlay || !workoutList) return;

    function openModal(){
        overlay.classList.remove("hidden");
        stepWorkouts.classList.remove("hidden");
        stepLevels.classList.add("hidden");
        workoutList.innerHTML = "";

        if(Array.isArray(workouts)){
            workouts.forEach(w => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = w.name;
                btn.addEventListener("click", function(){
                    selectedWorkoutId = w.id;
                    selectedTitle.textContent = w.name;
                    stepWorkouts.classList.add("hidden");
                    stepLevels.classList.remove("hidden");
                });
                workoutList.appendChild(btn);
            });
        }
    }

    function closeModal(){
        overlay.classList.add("hidden");
        selectedWorkoutId = null;
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function(e){
        if(e.target === overlay){
            closeModal();
        }
    });
    backBtn.addEventListener("click", function(){
        stepLevels.classList.add("hidden");
        stepWorkouts.classList.remove("hidden");
    });

    function addSelectedPlan(levelKey){
        if(!selectedWorkoutId) return;
        // use library.js helper to actually add the plan
        if(typeof addToPlanner === "function"){
            addToPlanner(selectedWorkoutId, levelKey);
            loadPlans();
            closeModal();
        }
    }

    beginnerBtn.addEventListener("click", function(){
        addSelectedPlan("beginner");
    });
    advancedBtn.addEventListener("click", function(){
        addSelectedPlan("advanced");
    });
}

function loadPlans(){

    let plans = getPlans();
    let container = document.getElementById("plansList");

    container.innerHTML = "";

    plans.forEach((plan, index) => {

        let exercisesHtml = "";
        if(Array.isArray(plan.exercises) && plan.exercises.length){
            const items = plan.exercises
                .map(e => `<li>${e.name} – ${e.scheme}</li>`)
                .join("");
            exercisesHtml = `
                <ul class="plan-exercises">
                    ${items}
                </ul>
            `;
        }

        container.innerHTML += `
            <div class="plan-card">
                <h3>${plan.name}</h3>
                ${exercisesHtml}
                <button onclick="deletePlan(${index})">Delete</button>
            </div>
        `;

    });
}

function deletePlan(index){

    let plans = getPlans();

    plans.splice(index, 1);

    savePlans(plans);

    loadPlans();
}
