const form = document.getElementById('form');
let difficulty;
let playerName;

// Game settings submit button event listener
form.addEventListener('submit', (e) => {
    e.preventDefault();
    getDifficulty();
    getPlayerName();
});

// Getting difficulty level
function getDifficulty() {
    const formData = new FormData(form);

    for (let [, value] of formData) {
        difficulty = value;
    }
    console.log(difficulty)
    return difficulty;
}

// Getting player name
function getPlayerName() {
    playerName = document.getElementById('username').value;
    console.log(playerName)
    return playerName;
}