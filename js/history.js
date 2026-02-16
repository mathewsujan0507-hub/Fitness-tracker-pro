window.onload = function(){
    loadHistory();
}

function loadHistory(){

    let history =
    JSON.parse(localStorage.getItem("history")) || [];

    let container =
    document.getElementById("historyList");

    container.innerHTML = "";

    history.forEach(item => {

        container.innerHTML += `
            <div class="plan-card">
                <h3>${item.date}</h3>
                <p>Time: ${item.time} sec</p>
            </div>
        `;

    });

}

function clearHistory(){

    localStorage.removeItem("history");
    loadHistory();

}
