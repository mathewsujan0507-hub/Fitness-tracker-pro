window.addEventListener("load", async function(){
    await loadCharts();
});

async function loadCharts(){

    let history = [];
    try {
        const res = await fetch('/api/history');
        if(res.ok) history = await res.json();
    }catch(e){}

    let totals = calculateTotals(history);
    let daily = calculateDaily(history);

    createTotalChart(totals);
    createDailyChart(daily);

}

function calculateTotals(history){

    let totalWorkouts = history.length;
    let totalTimeSeconds = history.reduce((a,b)=> a + b.time ,0);
    let totalTimeMinutes = Math.round(totalTimeSeconds / 60);

    return { totalWorkouts, totalTimeSeconds, totalTimeMinutes };
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
            labels:["Workouts","Time (min)"],
            datasets:[{
                label:"Totals",
                data:[data.totalWorkouts, data.totalTimeMinutes],
                backgroundColor:["#00ffcc","#1db954"]
            }]
        },
        options:{
            plugins:{
                legend:{ display:false }
            },
            scales:{
                x:{ grid:{ display:false } },
                y:{ beginAtZero:true }
            }
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
                fill:true,
                borderColor:"#00ffcc",
                backgroundColor:"rgba(0,255,204,0.15)",
                tension:0.3
            }]
        },
        options:{
            plugins:{
                legend:{ display:false }
            },
            scales:{
                x:{ grid:{ display:false } },
                y:{ beginAtZero:true, ticks:{ stepSize:1 } }
            }
        }
    });

}
