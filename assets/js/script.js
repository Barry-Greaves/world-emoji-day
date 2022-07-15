// Wait for the DOM to finish loading before taking values from the inputs
// Get the button elements and add event listeners to them
document.addEventListener("DOMContentLoaded", function () {

    let buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
      button.addEventListener("click", function () {
        if (this.getAttribute("data-type") === "submit") {
          console.log("submit");
        } 
      });
    }
  });
  
  function SaveResults() {
    const result = {
          "name": "Simon",
          "time": 1.20,
          "score": 56
      }
  };


async function leaderboard() {
    // load JSON File
    const response = await fetch("data/leaderboard.json");
    const leaderboard = await response.json();

    leaderboard.sort(function(a, b) {
        return b.score - a.score;
    });
    console.log(leaderboard);
    buildTable(leaderboard)

}

leaderboard();

buildTable(leaderboard)

function buildTable(leaderboard){
  var table = document.getElementById('myTable')

  for (var i=0; i < leaderboard.length; i++){
    var row = `<tr>
                    <td>${leaderboard[i].name}</td> 
                    <td>${leaderboard[i].time}</td> 
                    <td>${leaderboard[i].score}</td> 
              </tr>`
              table.innerHTML += row
  }
}





