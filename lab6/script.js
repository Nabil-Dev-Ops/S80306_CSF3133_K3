/* ==========================================
   Lab Exercise 6 - Quiz Application Logic
   ========================================== */

// ---------- Questions Array ----------
// Each object stores the question, the possible options and the correct answer.
const questions = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language",
                  "Hyperlink and Text Management Language", "Home Tool Markup Language"],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "Which HTML tag is used to link an external JavaScript file?",
        options: ["<script>", "<link>", "<js>", "<javascript>"],
        answer: "<script>"
    },
    {
        question: "Which CSS property is used to change the text color of an element?",
        options: ["color", "font-color", "text-color", "foreground"],
        answer: "color"
    },
    {
        question: "Which JavaScript method finds an HTML element by its id?",
        options: ["document.getElementById()", "document.querySelectorAll()",
                  "document.getElementsByName()", "document.findId()"],
        answer: "document.getElementById()"
    },
    {
        question: "What value range does Math.random() return?",
        options: ["0 (inclusive) up to 1 (exclusive)", "1 to 10", "0 to 100", "-1 to 1"],
        answer: "0 (inclusive) up to 1 (exclusive)"
    },
    {
        question: "Which event is triggered when a user right-clicks on a page?",
        options: ["contextmenu", "rightclick", "mousedown2", "onmenu"],
        answer: "contextmenu"
    },
    {
        question: "Which method stops the browser's default action for an event?",
        options: ["event.preventDefault()", "event.stop()", "event.cancel()", "event.block()"],
        answer: "event.preventDefault()"
    },
    {
        question: "Which HTML element is used for the footer of a page?",
        options: ["<footer>", "<bottom>", "<foot>", "<section-end>"],
        answer: "<footer>"
    },
    {
        question: "Which function converts a string into an integer in JavaScript?",
        options: ["parseInt()", "toInteger()", "Number.int()", "intValue()"],
        answer: "parseInt()"
    },
    {
        question: "Where is client-side validation performed?",
        options: ["In the web browser", "On the web server", "In the database", "In the router"],
        answer: "In the web browser"
    },
    {
        question: "Which CSS property controls the space inside an element's border?",
        options: ["padding", "margin", "spacing", "border-gap"],
        answer: "padding"
    },
    {
        question: "Which keyword declares a variable whose value cannot be reassigned?",
        options: ["const", "let", "var", "static"],
        answer: "const"
    }
];

// ---------- Settings & state ----------
const TIME_LIMIT = 15;           // seconds per question
const TOTAL_QUESTIONS = 10;      // number of questions in each quiz

let quizQuestions = [];          // shuffled questions for this round
let currentIndex = 0;
let score = 0;
let timeLeft = TIME_LIMIT;
let timerId = null;
let selectedOption = null;
let answered = false;

// ---------- DOM elements ----------
const startScreen     = document.getElementById("start-screen");
const quizScreen      = document.getElementById("quiz-screen");
const startBtn        = document.getElementById("start-btn");
const restartBtn      = document.getElementById("restart-btn");
const actionBtn       = document.getElementById("action-btn");
const questionCounter = document.getElementById("question-counter");
const questionText    = document.getElementById("question-text");
const optionsBox      = document.getElementById("options");
const feedbackBox     = document.getElementById("feedback");
const timerBox        = document.getElementById("timer");
const timeLeftText    = document.getElementById("time-left");
const timerProgress   = document.getElementById("timer-progress");
const scoreText       = document.getElementById("score");
const totalText       = document.getElementById("total");
const resultBox       = document.getElementById("result");
const finalScore      = document.getElementById("final-score");
const finalPercent    = document.getElementById("final-percent");
const resultMessage   = document.getElementById("result-message");

// Show settings on the start screen
document.getElementById("rule-count").textContent = Math.min(TOTAL_QUESTIONS, questions.length);
document.getElementById("rule-time").textContent = TIME_LIMIT;
totalText.textContent = Math.min(TOTAL_QUESTIONS, questions.length);

// ---------- shuffleQuestions() ----------
// Randomly shuffles an array (Fisher-Yates algorithm) so each quiz is different.
function shuffleQuestions(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ---------- startTimer() ----------
// Sets a countdown timer for answering each question.
function startTimer() {
    clearInterval(timerId);
    timeLeft = TIME_LIMIT;
    updateTimerDisplay();

    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timeUp();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timeLeftText.textContent = timeLeft;
    timerProgress.style.width = (timeLeft / TIME_LIMIT) * 100 + "%";

    const lowTime = timeLeft <= 5;
    timerBox.classList.toggle("warning", lowTime);
    timerProgress.classList.toggle("warning", lowTime);
}

// Called when the timer reaches 0 before the user submits an answer
function timeUp() {
    answered = true;
    const correct = quizQuestions[currentIndex].answer;
    lockOptions(correct, null);
    showFeedback("info", "⏰ Time's up!", `The correct answer is: ${correct}`);
    setActionButton();
}

// ---------- displayQuestion() ----------
// Displays the current question and its answer options.
function displayQuestion() {
    const current = quizQuestions[currentIndex];
    selectedOption = null;
    answered = false;

    questionCounter.textContent = `Question ${currentIndex + 1} of ${quizQuestions.length}`;
    questionText.textContent = current.question;

    feedbackBox.className = "feedback hidden";
    feedbackBox.innerHTML = "";

    actionBtn.textContent = "Submit Answer";
    actionBtn.disabled = true;

    optionsBox.innerHTML = "";
    const letters = ["A", "B", "C", "D", "E"];

    // Options are shuffled too, so the correct answer is not always in the same position
    shuffleQuestions(current.options).forEach((optionText, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option";
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", "false");
        btn.dataset.value = optionText;

        const letter = document.createElement("span");
        letter.className = "option-letter";
        letter.textContent = letters[i];

        const label = document.createElement("span");
        label.textContent = optionText;   // textContent so tags like <script> are shown as text

        btn.append(letter, label);
        btn.addEventListener("click", () => selectOption(btn));
        optionsBox.appendChild(btn);
    });
}

// Highlight the option chosen by the user
function selectOption(btn) {
    if (answered) return;

    optionsBox.querySelectorAll(".option").forEach(opt => {
        opt.classList.remove("selected");
        opt.setAttribute("aria-checked", "false");
    });

    btn.classList.add("selected");
    btn.setAttribute("aria-checked", "true");
    selectedOption = btn.dataset.value;
    actionBtn.disabled = false;
}

// ---------- checkAnswer() ----------
// Checks whether the selected answer is correct and updates the score.
function checkAnswer() {
    if (selectedOption === null || answered) return;

    clearInterval(timerId);
    answered = true;

    const correct = quizQuestions[currentIndex].answer;

    if (selectedOption === correct) {
        score++;
        scoreText.textContent = score;
        showFeedback("correct", "✔ Correct! Well done.", "");
    } else {
        showFeedback("incorrect", "✘ Incorrect.", `The correct answer is: ${correct}`);
    }

    lockOptions(correct, selectedOption);
    setActionButton();
}

// Disable all options and colour the correct / wrong answers
function lockOptions(correct, chosen) {
    optionsBox.querySelectorAll(".option").forEach(opt => {
        opt.disabled = true;
        opt.classList.remove("selected");
        if (opt.dataset.value === correct) {
            opt.classList.add("correct");
        } else if (opt.dataset.value === chosen) {
            opt.classList.add("incorrect");
        }
    });
}

function showFeedback(type, title, detail) {
    feedbackBox.className = `feedback ${type}`;
    feedbackBox.innerHTML = "";
    feedbackBox.append(title);
    if (detail) {
        const small = document.createElement("small");
        small.textContent = detail;
        feedbackBox.appendChild(small);
    }
}

// Change the button to "Next Question" or "Finish Quiz"
function setActionButton() {
    const isLast = currentIndex === quizQuestions.length - 1;
    actionBtn.textContent = isLast ? "Finish Quiz" : "Next Question →";
    actionBtn.disabled = false;
    actionBtn.focus();
}

// ---------- nextQuestion() ----------
// Moves to the next question, resetting the timer and updating the score.
function nextQuestion() {
    currentIndex++;
    scoreText.textContent = score;

    if (currentIndex < quizQuestions.length) {
        displayQuestion();
        startTimer();
    } else {
        showResults();
    }
}

// Show the final score in the footer
function showResults() {
    clearInterval(timerId);
    quizScreen.classList.add("hidden");

    const total = quizQuestions.length;
    const percent = Math.round((score / total) * 100);

    finalScore.textContent = `${score}/${total}`;
    finalPercent.textContent = `${percent}%`;

    if (percent >= 80) {
        resultMessage.textContent = "Excellent! You really know your web design. 🎉";
    } else if (percent >= 50) {
        resultMessage.textContent = "Good job! A little more practice and you'll master it. 👍";
    } else {
        resultMessage.textContent = "Keep trying! Review the lab notes and try again. 💪";
    }

    resultBox.classList.remove("hidden");
    resultBox.scrollIntoView({ behavior: "smooth" });
}

// ---------- startQuiz() ----------
// Starts the quiz: shuffles the questions, displays the first question and starts the timer.
function startQuiz() {
    quizQuestions = shuffleQuestions(questions).slice(0, TOTAL_QUESTIONS);
    currentIndex = 0;
    score = 0;
    scoreText.textContent = score;
    totalText.textContent = quizQuestions.length;

    startScreen.classList.add("hidden");
    resultBox.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    displayQuestion();
    startTimer();
}

// ---------- Event listeners ----------
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", () => {
    startQuiz();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// One button is used to submit the answer and to move to the next question
actionBtn.addEventListener("click", () => {
    if (!answered) {
        checkAnswer();
    } else {
        nextQuestion();
    }
});

// Keyboard shortcuts: 1-4 to choose an option
document.addEventListener("keydown", (e) => {
    if (quizScreen.classList.contains("hidden") || answered) return;
    const index = parseInt(e.key, 10) - 1;
    const opts = optionsBox.querySelectorAll(".option");
    if (index >= 0 && index < opts.length) {
        selectOption(opts[index]);
    }
});
