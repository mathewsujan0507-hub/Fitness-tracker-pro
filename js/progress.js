window.onload = function(){
    loadCharts();
}

function loadCharts(){

    let history =
    JSON.parse(localStorage.getItem("history")) || [];

    let totals = calculateTotals(history);
    let daily = calculateDaily(history);

    createTotalChart(totals);
    createDailyChart(daily);

}

function calculateTotals(history){

    let totalWorkouts = history.length;
    let totalTime = history.reduce((a,b)=> a + b.time ,0);

    return { totalWorkouts, totalTime };
}

function calculateDaily(history){

    let daily = {};

    history.forEach(h => {

        let day = new Date(h.date).toLocaleDateString();

        if(!daily[day]) daily[day] = 0;
        daily[day]++;

    });

    return daily;
}

function createTotalChart(data){

    new Chart(document.getElementById("totalChart"),{
        type:"bar",
        data:{
            labels:["Workouts","Time(sec)"],
            datasets:[{
                label:"Totals",
                data:[data.totalWorkouts, data.totalTime]
            }]
        }
    });

}

function createDailyChart(daily){

    new Chart(document.getElementById("dailyChart"),{
        type:"line",
        data:{
            labels:Object.keys(daily),
            datasets:[{
                label:"Workouts Per Day",
                data:Object.values(daily),
                fill:true
            }]
        }
    });

}
