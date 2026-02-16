const workouts = [
    {name:"Beginner Full Body"},
    {name:"Push Day"},
    {name:"Pull Day"},
    {name:"Leg Day"},
    {name:"Cardio Blast"},
    {name:"Abs Workout"}
];

window.onload = function(){
    loadLibrary();
}

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
            <div class="library-card">
                <h3>${workout.name}</h3>
                <button onclick="addToPlanner('${workout.name}')">
                    Add To Planner
                </button>
            </div>
        `;

    });
}

function addToPlanner(name){

    let plans = getPlans();

    plans.push({name:name});

    savePlans(plans);

    alert("Added to Planner");

}
