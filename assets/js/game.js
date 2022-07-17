//  level selector
let selectedLevel = "easy";
let cards;
let moves = 1;
let score = 0;

const easyLevel = document.getElementById("easy-level-container");
const mediumLevel = document.getElementById("medium-level-container");
const hardLevel = document.getElementById("hard-level-container");

let easy = easyLevel.id; // get the id of level containers
let medium = mediumLevel.id;
let hard = hardLevel.id;

easy = easy.substring(0, easy.length - 16);
medium = medium.substring(0, medium.length - 16);
hard = hard.substring(0, hard.length - 16);

let scoreArea = document.getElementById("score");

// Button elements
let levelSelectors = document.getElementsByClassName("level-selector");
let resetButton = document.getElementById("reset");

// Modal elements
let winModal = document.getElementById("winModal");
let gameoverModal = document.getElementById("gameoverModal");
let closeButtons = document.querySelectorAll("[data-button='close']")
let replayBtn = document.getElementById("replayBtn");
let replayForm = document.getElementById("form");

let countdown;
let timeLeft = 0;

// Button click event listeners
for (let button of levelSelectors) {
    button.addEventListener("click", (e) => {
        selectedLevel = e.target.getAttribute("data-difficulty");
        selectLevel(selectedLevel);
        startCountdown(selectedLevel);
    })
}
resetButton.addEventListener("click", () => {
    resetGame();
    startCountdown(selectedLevel);
});

//timer function
function startCountdown(difficulty) {
    selectedLevel = difficulty;
    timeLeft = selectedLevel === "easy" ? 300000 : selectedLevel === "medium" ? 180000 : 60000;
    if (countdown != null) {
        stopCountdown();
    }
    countdown = setInterval(() => {
        let minute = '0' + Math.floor(timeLeft / 60000);
        let seconds = Math.floor(timeLeft % 60000).toString();
        let sec = seconds.length === 5 ? seconds.slice(0, 2) : seconds.length === 4 ? ("0" + seconds).slice(0, 2) : "00";

        document.getElementById("timer").innerText = `${minute}:${sec}`;

        if (timeLeft <= 0) {
            gameoverModal.style.display = "flex";
            stopCountdown();
        } else {
            timeLeft -= 10;
        }
    }, 10);
}

function stopCountdown() {
    clearInterval(countdown);
    countdown = null;
    let resetTimer = selectedLevel === "easy" ? "05:00" : selectedLevel === "medium" ? "03:00" : "01:00";
    document.getElementById("timer").innerText = resetTimer;
}

//add random colors to cards
let basicEmojiArray = [
    'assets/images/angry-emoji.png',
    'assets/images/angry-emoji.png',
    'assets/images/cool-emoji.png',
    'assets/images/cool-emoji.png',
    'assets/images/cowboy-emoji.png',
    'assets/images/cowboy-emoji.png',
    'assets/images/cursing-emoji.png',
    'assets/images/cursing-emoji.png',
    'assets/images/devil-emoji.png',
    'assets/images/devil-emoji.png',
    'assets/images/emotional-emoji.png',
    'assets/images/emotional-emoji.png',
    'assets/images/exploding-emoji.png',
    'assets/images/exploding-emoji.png',
    'assets/images/fire-emoji.png',
    'assets/images/fire-emoji.png'
];

let emojiArray;

function sortColors() {
    emojiArray = basicEmojiArray;
    if (selectedLevel == "easy") {
        emojiArray = basicEmojiArray;
        cards = document.getElementsByClassName("card-easy");
    } else if (selectedLevel == "medium") {
        emojiArray.push('assets/images/grinning-emoji.png', 'assets/images/grinning-emoji.png', 'assets/images/lol-emoji.png', 'assets/images/lol-emoji.png');
        cards = document.getElementsByClassName("card-medium");
    } else if (selectedLevel == "hard") {
        emojiArray.push('assets/images/grinning-emoji.png', 'assets/images/grinning-emoji.png', 'assets/images/lol-emoji.png', 'assets/images/lol-emoji.png', 'assets/images/loving-hearts.png', 'assets/images/loving-hearts.png', 'assets/images/party-emoji.png', 'assets/images/party-emoji.png');
        cards = document.getElementsByClassName("card-hard");
    }

    emojiArray.sort(() => 0.5 - Math.random()); // Randomise colors

    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", flipCard);
    }

    setTimeout(function () {
        for (let i = 0; i < emojiArray.length; i++) {
            let img = document.createElement('img');
            img.setAttribute('id', `${emojiArray[i].slice(14, -4)}`);
            img.className = 'emoji hide';
            img.src = emojiArray[i]; // Add colors to cards in a random order
            cards[i].appendChild(img);
        }
    }, 500);
}

function resetCards() {
    for (let card of cards) {
        card.classList.add("card-back");
        card.classList.remove("card-front");
        if (card.firstChild) {
            card.firstChild.remove();
        }
    }
}

function selectLevel(level) {
    selectedLevel = level; // Whichever button they click, get that id

    if (selectedLevel == "easy") {
        easyLevel.classList.remove("hide"); // Set the amount of cards depending on which level was chosen
        mediumLevel.classList.add("hide");
        hardLevel.classList.add("hide");
    } else if (selectedLevel == "medium") {
        easyLevel.classList.add("hide");
        mediumLevel.classList.remove("hide");
        hardLevel.classList.add("hide");
    } else if (selectedLevel == "hard") {
        easyLevel.classList.add("hide");
        mediumLevel.classList.add("hide");
        hardLevel.classList.remove("hide");
    }
    resetGame();
}

sortColors();

let cardOne;
let cardTwo;
let cardOneEmoji;
let cardTwoEmoji;
let busy = false;

function checkWin() {
    if (selectedLevel == "easy" && score == 8) {
        winModal.style.display = "flex";
    } else if (selectedLevel == "medium" && score == 10) {
        winModal.style.display = "flex";
    } else if (selectedLevel == "hard" && score == 12) {
        winModal.style.display = "flex";
    }
    pushScore();
}

function flipCard() {
    if (!busy) {
        busy = true;
        this.classList.remove("card-back"); // On click, flip the card
        this.firstChild.classList.remove('hide');
        if (moves % 2 != 0) {
            if (selectedLevel === "easy" && moves === 1) {
                startCountdown(selectedLevel);
            }
            cardOne = this.id;
            cardOneEmoji = document.getElementById(cardOne).firstChild.id;
            moves++;
            pushMoves();
            busy = false;
        } else {
            cardTwo = this.id;
            cardTwoEmoji = document.getElementById(cardTwo).firstChild.id;
            if (cardOne != cardTwo) {
                moves++;
                pushMoves();
            }
            setTimeout(function () {
                if (cardOneEmoji == cardTwoEmoji && cardOne != cardTwo) {
                    document.getElementById(cardOne).style.backgroundImage = "transparent";
                    document.getElementById(cardTwo).style.backgroundImage = "transparent";
                    score++;
                    checkWin();
                } else {
                    document.getElementById(cardOne).classList.add("card-back");
                    document.getElementById(cardTwo).classList.add("card-back");
                    document.getElementById(cardOne).firstChild.classList.add('hide');
                    document.getElementById(cardTwo).firstChild.classList.add('hide');
                }
                busy = false;
            }, 1000);
        }
    }
    pushScore();
}

function pushScore() {
    if (selectedLevel == "easy") {
        scoreArea.innerText = `${score} / 8`;
    } else if (selectedLevel == "medium") {
        scoreArea.innerText = `${score} / 10`;
    } else if (selectedLevel == "hard") {
        scoreArea.innerText = `${score} / 12`;
    }
}

function pushMoves() {
    document.getElementById("movescounter").innerHTML = `moves: ${moves - 1}`;
}

function resetGame() {
    moves = 1;
    score = 0;
    resetCards();
    sortColors();
    pushScore();
    pushMoves();
}

function getPlayerName() {
    let playerName = document.getElementById('username').value;
    return playerName;
}

function getScore() {
    let defaultPoint = selectedLevel === 'easy' ? 8 : selectedLevel === 'medium' ? 10 : 12;
    let timeLeft = document.getElementById('timer').innerText;
    let minuteToSec = timeLeft.substring(0, 2) * 60;
    let second = timeLeft.substring(3, 5);
    let timeLeftInSec = minuteToSec + second;
    let totalScore = defaultPoint;

    if (moves <= 31) {
        totalScore *= 5;
    } else if (moves <= 51) {
        totalScore *= 4;
    } else if (moves <= 71) {
        totalScore *= 3;
    } else {
        totalScore *= 2;
    }

    if (selectedLevel === 'easy') {
        if (timeLeftInSec >= 240) {
            totalScore *= 5;
        } else if (timeLeftInSec >= 180) {
            totalScore *= 4;
        } else if (timeLeftInSec >= 120) {
            totalScore *= 3;
        } else if (timeLeftInSec >= 60) {
            totalScore *= 2;
        }
    } else if (selectedLevel === 'medium') {
        if (timeLeftInSec >= 144) {
            totalScore *= 5;
        } else if (timeLeftInSec >= 108) {
            totalScore *= 4;
        } else if (timeLeftInSec >= 72) {
            totalScore *= 3;
        } else if (timeLeftInSec >= 36) {
            totalScore *= 2;
        }
    } else {
        if (timeLeftInSec >= 48) {
            totalScore *= 5;
        } else if (timeLeftInSec >= 36) {
            totalScore *= 4;
        } else if (timeLeftInSec >= 24) {
            totalScore *= 3;
        } else if (timeLeftInSec >= 12) {
            totalScore *= 2;
        }
    }
    return totalScore;
}

function storeResult() {
    let playerName = getPlayerName();
    let score = getScore();
    let result = {
        playerName,
        selectedLevel,
        score
    };
    return result;
}

for (let closeBtn of closeButtons) {
    closeBtn.addEventListener("click", () => {
        winModal.style.display = "none";
        gameoverModal.style.display = "none";
        resetGame();
    })
}

replayBtn.addEventListener("click", () => {
    storeResult();
    gameoverModal.style.display = "none";
    startCountdown(selectedLevel);
    resetGame();
})

replayForm.addEventListener("submit", (e) => {
    e.preventDefault();
    storeResult();
    winModal.style.display = "none";
    startCountdown(selectedLevel);
    resetGame();
});