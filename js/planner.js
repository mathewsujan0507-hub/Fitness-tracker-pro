// LOAD PLANS ON PAGE LOAD
window.addEventListener("load", function(){
    loadPlans();
});

function getPlans(){
    return JSON.parse(localStorage.getItem("plans")) || [];
}

function savePlans(plans){
    localStorage.setItem("plans", JSON.stringify(plans));
}

function addPlan(){

    let planName = document.getElementById("planName").value;

    if(planName === ""){
        alert("Enter Plan Name");
        return;
    }

    let plans = getPlans();

    plans.push({
        name: planName
    });

    savePlans(plans);

    document.getElementById("planName").value = "";

    loadPlans();
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
