// =====================================================================
// Additional Lab Exercise 6 - Problem B: Student Grade Calculator
// Name: Muhammad Nabil Bin Taha (S80306)
//
// PART 1 - LIST OF ERRORS FOUND AND FIXED
// (line numbers refer to the ORIGINAL given code)
//
// Error 1  (grade.html, Line 9) : onsubmit="checkMark()" has no "return", so the form
//           is always submitted and the page reloads. Fixed: onsubmit="return checkMark()".
// Error 2  (grade.html, Line 17): onclick calls showtable() but the function is named
//           showTable(). JavaScript is case-sensitive. Fixed: onclick="showTable()".
// Error 3  (grade.html, Line 19): <script src="grades.js"> points to a file that does
//           not exist. Fixed: src="grade.js".
// Error 4  (grade.js, Line 5)   : if (name = "") uses the assignment operator "=", so an
//           empty name is accepted. Fixed: comparison operator if (name === "").
// Error 5  (grade.js, Line 9)   : isNan() is not defined. Fixed: isNaN() (capital N).
// Error 6  (grade.js, Line 14)  : (mark < 0 && mark > 100) can never be true, so 150 is
//           accepted. Fixed: logical OR (mark < 0 || mark > 100).
// Error 7  (grade.js, Line 28)  : document.getElementByID is not a function.
//           Fixed: document.getElementById (lowercase "d").
// Error 8  (grade.js, Line 30)  : style.colour is not a CSS property in JavaScript.
//           Fixed: style.color.
// Error 9  (grade.js, Line 31)  : return true lets the form submit, so the page reloads
//           and the result disappears immediately. Fixed: return false.
// Error 10 (grade.js, Line 38)  : the loop starts at i = 1, so grade "A" (index 0) is
//           missing from the table. Fixed: let i = 0.
// Error 11 (grade.js, Line 42)  : innerHtml is not a valid property, so the table is
//           never displayed. Fixed: innerHTML.
// =====================================================================


// ---------- checkMark() ----------
// Validates the name and mark, works out the grade and displays it.
// Always returns false so the form is not submitted (page does not reload).
function checkMark() {
    let name = document.forms["gradeForm"]["name"].value.trim();
    let mark = document.forms["gradeForm"]["mark"].value.trim();

    const result = document.getElementById("result");
    const checkedTime = document.getElementById("checkedTime");

    // Validation 1: name must not be empty           (FIX: === instead of =)
    if (name === "") {
        alert("Name must be filled out.");
        return false;
    }

    // EXTEND (Part 2, No. 5): mark must not be empty
    if (mark === "") {
        alert("Mark field cannot be empty.");
        return false;
    }

    // Validation 2: mark must be a number             (FIX: isNaN instead of isNan)
    if (isNaN(mark)) {
        alert("Please enter a valid numeric value.");
        return false;
    }

    mark = parseInt(mark);

    // Validation 3: mark must be between 0 and 100    (FIX: || instead of &&)
    if (mark < 0 || mark > 100) {
        alert("Mark must be between 0 and 100.");
        return false;
    }

    // Work out the grade
    let grade;
    if (mark >= 80) {
        grade = "A";
    } else if (mark >= 65) {
        grade = "B";
    } else if (mark >= 50) {
        grade = "C";
    } else {
        grade = "F";
    }

    // Display the result                            (FIX: getElementById)
    result.innerHTML = name + " got grade " + grade;

    // EXTEND (Part 2, No. 6): colour depends on the grade (FIX: style.color)
    // green for A and B, orange for C, red for F
    if (grade === "A" || grade === "B") {
        result.style.color = "green";
    } else if (grade === "C") {
        result.style.color = "orange";
    } else {
        result.style.color = "red";
    }

    // EXTEND (Part 2, No. 8): show the date and time the grade was checked
    checkedTime.innerHTML = "Checked on: " + Date();

    // FIX: return false so the form does not submit and the result stays on the page
    return false;
}


// ---------- showTable() ----------
// Builds the grade table from two arrays using a for loop.
function showTable() {
    let grades = ["A", "B", "C", "F"];
    let ranges = ["80-100", "65-79", "50-64", "0-49"];

    // EXTEND: header row so the table can be styled with a header background
    let tableHTML = "<table><tr><th>Grade</th><th>Mark Range</th></tr>";

    // FIX: loop starts at 0 so all four grades (A, B, C, F) are shown
    for (let i = 0; i < grades.length; i++) {
        tableHTML += "<tr><td>" + grades[i] + "</td><td>" + ranges[i] + "</td></tr>";
    }
    tableHTML += "</table>";

    // FIX: innerHTML (capital HTML)
    document.getElementById("tableContainer").innerHTML = tableHTML;
}


// ---------- randomMark() ----------
// EXTEND (Part 2, No. 7): puts a random whole number from 0 to 100
// into the mark field. Math.random() * 101 gives 0 - 100.999...,
// Math.floor() rounds it down to a whole number 0 - 100.
function randomMark() {
    const random = Math.floor(Math.random() * 101);
    document.getElementById("mark").value = random;
}
