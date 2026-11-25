// =====================================================
// Additional Lab Exercise 6 - Problem A
// Rock, Paper, Scissors Game - JavaScript
// Name: Muhammad Nabil Bin Taha (S80306)
// =====================================================

// ---------- Game variables ----------
let gameStarted = false;   // becomes true after a valid name is entered
let playerName = "";
let wins = 0;
let losses = 0;
let draws = 0;
let results = [];          // stores "Win", "Lose" or "Draw" for every round

// Turns "rock" into "Rock" for display
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// ---------- startGame() ----------
// Reads the name, validates it, shows a welcome message and the start time.
function startGame() {
    playerName = document.getElementById("playerName").value.trim();

    // Validation: the name must not be empty
    if (playerName === "") {
        alert("Please enter your name.");
        return;
    }

    // Allow the game to start
    gameStarted = true;

    // Show welcome message and start date/time
    document.getElementById("welcome").innerHTML = "Welcome, " + playerName + "!";
    document.getElementById("startTime").innerHTML = "Game started on: " + Date();

    // Prompt the player to choose
    const resultText = document.getElementById("result");
    resultText.innerHTML = "Choose Rock, Paper or Scissors!";
    resultText.style.color = "#4338ca";
}

// ---------- getComputerChoice() ----------
// Returns a random choice from the array using Math.random() and Math.floor().
function getComputerChoice() {
    const choices = ["rock", "paper", "scissors"];
    const index = Math.floor(Math.random() * 3);   // 0, 1 or 2
    return choices[index];
}

// ---------- playRound(playerChoice) ----------
// Plays one round: decides the winner, updates the images, result,
// scoreboard, results array and history table.
function playRound(playerChoice) {
    // The player must click Start Game first
    if (!gameStarted) {
        alert("Click Start Game first.");
        return;
    }

    const computerChoice = getComputerChoice();
    let result;

    // Decide the result with if...else
    // Rules: rock beats scissors, scissors beats paper, paper beats rock
    if (playerChoice === computerChoice) {
        result = "Draw";
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "scissors" && computerChoice === "paper") ||
        (playerChoice === "paper" && computerChoice === "rock")
    ) {
        result = "Win";
    } else {
        result = "Lose";
    }

    // Change the src of both images
    const playerImg = document.getElementById("playerImg");
    const computerImg = document.getElementById("computerImg");
    playerImg.src = playerChoice + ".png";
    playerImg.alt = "You chose " + playerChoice;
    computerImg.src = computerChoice + ".png";
    computerImg.alt = "Computer chose " + computerChoice;
    playerImg.classList.remove("idle");
    computerImg.classList.remove("idle");

    // Show the result and change its colour, then update the score
    const resultText = document.getElementById("result");
    if (result === "Win") {
        resultText.innerHTML = "You Win! " + capitalize(playerChoice) + " beats " + computerChoice + ".";
        resultText.style.color = "green";
        wins++;
    } else if (result === "Lose") {
        resultText.innerHTML = "You Lose! " + capitalize(computerChoice) + " beats " + playerChoice + ".";
        resultText.style.color = "red";
        losses++;
    } else {
        resultText.innerHTML = "It's a Draw! You both chose " + playerChoice + ".";
        resultText.style.color = "grey";
        draws++;
    }

    // Update the scoreboard
    updateScoreboard();

    // Store the result in the array
    results.push(result);

    // Add a new row to the history table using innerHTML +=
    const round = results.length;
    document.getElementById("historyBody").innerHTML +=
        "<tr>" +
            "<td>" + round + "</td>" +
            "<td>" + capitalize(playerChoice) + "</td>" +
            "<td>" + capitalize(computerChoice) + "</td>" +
            "<td class='" + result.toLowerCase() + "'>" + result + "</td>" +
        "</tr>";

    // Clear any old summary because the numbers have changed
    document.getElementById("summary").innerHTML = "";
}

// Shows the current wins, losses and draws on the page
function updateScoreboard() {
    document.getElementById("wins").innerHTML = wins;
    document.getElementById("losses").innerHTML = losses;
    document.getElementById("draws").innerHTML = draws;
}

// ---------- showSummary() ----------
// Uses a for loop to count wins, then shows rounds played and win percentage.
function showSummary() {
    const summary = document.getElementById("summary");

    if (results.length === 0) {
        summary.innerHTML = "No rounds played yet.";
        return;
    }

    // Count the wins with a for loop
    let winCount = 0;
    for (let i = 0; i < results.length; i++) {
        if (results[i] === "Win") {
            winCount++;
        }
    }

    // Win percentage rounded with Math.round()
    const percentage = Math.round((winCount / results.length) * 100);
    const roundWord = results.length === 1 ? "round" : "rounds";

    summary.innerHTML = "You played " + results.length + " " + roundWord +
                        " and won " + percentage + "%";
}

// ---------- resetGame() ----------
// Sets the scores back to 0, empties the results array, clears the
// history rows, the result message and the summary.
function resetGame() {
    wins = 0;
    losses = 0;
    draws = 0;
    results = [];
    updateScoreboard();

    document.getElementById("historyBody").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("summary").innerHTML = "";

    // Put the images back to their faded starting state
    const playerImg = document.getElementById("playerImg");
    const computerImg = document.getElementById("computerImg");
    playerImg.src = "rock.png";
    computerImg.src = "rock.png";
    playerImg.alt = "Your choice";
    computerImg.alt = "Computer's choice";
    playerImg.classList.add("idle");
    computerImg.classList.add("idle");
}
