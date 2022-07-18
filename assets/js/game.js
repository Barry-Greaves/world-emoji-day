// Game containers
const easyLevel = document.getElementById("easy-level-container");
const mediumLevel = document.getElementById("medium-level-container");
const hardLevel = document.getElementById("hard-level-container");

// Button elements
let levelSelectors = document.getElementsByClassName("level-selector");
let resetButton = document.getElementById("reset");

// Modal elements
let winModal = document.getElementById("winModal");
let gameoverModal = document.getElementById("gameoverModal");
let closeButtons = document.querySelectorAll("[data-button='close']")
let replayBtn = document.getElementById("replayBtn");
let replayForm = document.getElementById("form");

let selectedLevel = "easy";
let moves = 1;
let score = 0;
let countdown;
let timeLeft = 0;
let emojiArray;
let cards;
let cardOne;
let cardTwo;
let cardOneEmoji;
let cardTwoEmoji;
let busy = false;

//add random colors to cards
let easyEmojiArray = [
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

let mediumEmojiArray = [
    ...easyEmojiArray,
    'assets/images/grinning-emoji.png',
    'assets/images/grinning-emoji.png',
    'assets/images/lol-emoji.png',
    'assets/images/lol-emoji.png'
];

let hardEmojiArray = [
    ...mediumEmojiArray,
    'assets/images/loving-hearts.png',
    'assets/images/loving-hearts.png',
    'assets/images/party-emoji.png',
    'assets/images/party-emoji.png'
]

// Button click event listeners
for (let button of levelSelectors) {
    button.addEventListener("click", (e) => {
        let timerEl = document.getElementById("timer");
        selectedLevel = e.target.getAttribute("data-difficulty");
        selectLevel(selectedLevel);
        if (selectedLevel === "easy") {
            timerEl.innerText = "05:00";
        } else if (selectedLevel === "medium") {
            timerEl.innerText = "03:00";
        } else {
            timerEl.innerText = "01:00";
        }
    })
}

resetButton.addEventListener("click", () => {
    resetGame();
});

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
    resetGame();
})

replayForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveScore();
    winModal.style.display = "none";
    resetGame();
});

sortColors();

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

function sortColors() {
    if (selectedLevel == "easy") {
        emojiArray = easyEmojiArray;
        cards = document.getElementsByClassName("card-easy");
    } else if (selectedLevel == "medium") {
        emojiArray = mediumEmojiArray;
        cards = document.getElementsByClassName("card-medium");
    } else if (selectedLevel == "hard") {
        emojiArray = hardEmojiArray;
        cards = document.getElementsByClassName("card-hard");
    }

    emojiArray.sort(() => 0.5 - Math.random()); // Randomise emoji

    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", flipCard);
    }

    setTimeout(function () {
        for (let i = 0; i < emojiArray.length; i++) {
            let img = document.createElement('img');
            img.setAttribute('id', `${emojiArray[i].slice(14, -4)}`);
            img.className = 'emoji hide';
            img.src = emojiArray[i];
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
    selectedLevel = level;

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

function checkWin() {
    if (selectedLevel == "easy" && score == 8) {
        winModal.style.display = "flex";
        stopCountdown();
    } else if (selectedLevel == "medium" && score == 10) {
        winModal.style.display = "flex";
        stopCountdown();
    } else if (selectedLevel == "hard" && score == 12) {
        winModal.style.display = "flex";
        stopCountdown();
    }
    pushScore();
}

function flipCard() {
    if (!busy) {
        busy = true;
        this.classList.remove("card-back"); // On click, flip the card
        this.firstChild.classList.remove('hide');
        if (moves % 2 != 0) {
            if (moves === 1) {
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
    let scoreArea = document.getElementById("score");

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
    if (countdown != null) {
        stopCountdown();
    }
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
        "name": playerName,
        "difficulty": selectedLevel,
        "score": score
    };
    return result;
}

function saveScore() {
    let playerName = getPlayerName();
    let difficulty = selectedLevel;
    let score = getScore();
    console.log(playerName);
    console.log(difficulty);
    console.log(score);


    const url = `save_score.php?playerName=${playerName}&difficulty=${difficulty}&score=${score}`;
    setTimeout(function() {
      window.location.href = url; 
  },500);
 
}