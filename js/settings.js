function saveSpotify(){

 let link = document.getElementById("spotifyLink").value;
 localStorage.setItem("spotify", link);
 alert("Saved!");

}

function resetData(){

 if(confirm("Delete all data?")){
  localStorage.clear();
  alert("Data Reset");
 }

}
