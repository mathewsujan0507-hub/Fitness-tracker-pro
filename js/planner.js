// LOAD PLANS + set up picker on PAGE LOAD
window.addEventListener("load", function(){
    loadPlans();
    setupPlanPicker();
});

function getPlans(){
    return JSON.parse(localStorage.getItem("plans")) || [];
}

function savePlans(plans){
    localStorage.setItem("plans", JSON.stringify(plans));
}

function setupPlanPicker(){
    const openBtn = document.getElementById("openPlanSelector");
    const picker = document.getElementById("plannerPicker");
    const workoutSelect = document.getElementById("plannerWorkoutSelect");
    const levelSelect = document.getElementById("plannerLevelSelect");
    const addBtn = document.getElementById("addSelectedPlan");

    if(!openBtn || !picker || !workoutSelect || !levelSelect || !addBtn) return;

    // Populate workout options from library workouts
    workoutSelect.innerHTML = "";
    if(Array.isArray(workouts)){
        workouts.forEach(w => {
            const opt = document.createElement("option");
            opt.value = w.id;
            opt.textContent = w.name;
            workoutSelect.appendChild(opt);
        });
    }

    openBtn.addEventListener("click", function(){
        picker.classList.toggle("hidden");
    });

    addBtn.addEventListener("click", function(){
        const workoutId = workoutSelect.value;
        const levelKey = levelSelect.value;

        if(!workoutId){
            alert("Choose a workout type first.");
            return;
        }

        if(typeof addToPlanner === "function"){
            addToPlanner(workoutId, levelKey);
            loadPlans();
            picker.classList.add("hidden");
        }
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
