window.onload = async function(){
    await loadHistory();
}

async function loadHistory(){

    let history = [];
    try {
        const res = await fetch('/api/history');
        if(res.ok) history = await res.json();
    }catch(e){}

    let container =
    document.getElementById("historyList");

    if(container) container.innerHTML = "";

    history.forEach(item => {

        container.innerHTML += `
            <div class="plan-card">
                <h3>${item.date}</h3>
                <p>Time: ${item.time} sec</p>
            </div>
        `;

    });

}

async function clearHistory(){

    try {
        await fetch('/api/history', { method: 'DELETE' });
    }catch(e){}
    
    await loadHistory();

}
