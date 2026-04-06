// LOAD PLANS + set up picker on PAGE LOAD
window.addEventListener("load", async function(){
    await loadPlans();
    setupPlanPicker();
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

    addBtn.addEventListener("click", async function(){
        const workoutId = workoutSelect.value;
        const levelKey = levelSelect.value;

        if(!workoutId){
            alert("Choose a workout type first.");
            return;
        }

        if(typeof addToPlanner === "function"){
            await addToPlanner(workoutId, levelKey);
            await loadPlans();
            picker.classList.add("hidden");
        }
    });
}

async function loadPlans(){

    let plans = await getPlans();
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
                <button onclick="startPlan(${index})">Start</button>
                <button onclick="deletePlan(${index})">Delete</button>
            </div>
        `;

    });
}

async function startPlan(index){
    const plans = await getPlans();
    const plan = plans[index];
    if(!plan){
        alert("Plan not found");
        return;
    }

    try {
        await fetch('/api/plans/active', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(plan)
        });
    } catch(e){}
    window.location.href = "session.html";
}

async function deletePlan(index){

    let plans = await getPlans();

    plans.splice(index, 1);

    await savePlans(plans);

    await loadPlans();
}
