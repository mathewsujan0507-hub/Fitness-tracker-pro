console.log("FitTrack Pro Working");

// DARK MODE TOGGLE
const toggleBtn = document.getElementById("darkToggle");

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
}

if(toggleBtn){
    toggleBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme","dark");
        }else{
            localStorage.setItem("theme","light");
        }

    });
}
