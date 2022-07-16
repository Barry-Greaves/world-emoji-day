//  level selector
let selectedLevel = "easy";
const levelSelectors = document.getElementsByClassName("level-selector"); // Get all level buttons
let cards;
let j = 1;
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
            img.style.display = 'none';
            img.style.width = '6rem';
            img.src = emojiArray[i]; // Add colors to cards in a random order
            cards[i].appendChild(img);
        }
    }, 500);
}

function resetCards() {
    for (let k = 0; k < cards.length; k++) {
        cards[k].classList.add("card-back");
        cards[k].classList.remove("card-front");
    }
    for (let l = 0; l < cards.length; l++) {
        cards[l].firstChild.remove();
    }
}

function selectLevel() {
    selectedLevel = this.id; // Whichever button they click, get that id

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

for (let i = 0; i < levelSelectors.length; i++) {
    levelSelectors[i].addEventListener("click", selectLevel); // Add an onclick to select the level
}

sortColors();

let cardOne;
let cardTwo;
let cardOneEmoji;
let cardTwoEmoji;
let busy = false;
const winModal = document.getElementById("winModal");

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
        this.firstChild.style.display = 'block';
        if (j % 2 != 0) {
            cardOne = this.id;
            cardOneEmoji = document.getElementById(cardOne).firstChild.id;
            j++;
            pushMoves();
            busy = false;
        } else {
            cardTwo = this.id;
            cardTwoEmoji = document.getElementById(cardTwo).firstChild.id;
            if (cardOne != cardTwo) {
                j++;
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
                    document.getElementById(cardOne).firstChild.style.display = 'none';
                    document.getElementById(cardTwo).firstChild.style.display = 'none';
                }
                busy = false;
            }, 1000);
        }
    }
    pushScore();
}

let scoreArea = document.getElementById("score");

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
    document.getElementById("movescounter").innerHTML = `moves: ${j - 1}`;
}

let resetButton = document.getElementById("reset");

resetButton.addEventListener("click", resetGame);

function resetGame() {
    j = 1;
    score = 0;
    winModal.style.display = "none";
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
    let moves = j - 1;
    let totalScore = defaultPoint;

    if (moves <= 30) {
        totalScore *= 5;
    } else if (moves <= 50) {
        totalScore *= 4;
    } else if (moves <= 70) {
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

const closeButton = document.getElementById("close");
closeButton.addEventListener("click", function () {
    winModal.style.display = "none";
});

let replayForm = document.getElementById("form");

replayForm.addEventListener("submit", (e) => {
    e.preventDefault();
    storeResult();
    resetGame();
});