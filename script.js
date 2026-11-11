// ===== Virtual Dog Park — script.js =====
// Round 2: Virtual Dog Adoption and Care
//
// This script lets a visitor adopt a virtual dog, then feed or play
// with it to raise happiness. The encyclopedia above is static HTML
// and does not need any JavaScript.

// --- Dog state ---
// "dog" holds the current pet, or null if no dog has been adopted yet.
var dog = null;

// --- Grab the HTML elements we need ---
var adoptBtn  = document.getElementById("adopt-btn");
var feedBtn   = document.getElementById("feed-btn");
var playBtn   = document.getElementById("play-btn");
var nameInput = document.getElementById("dog-name");
var breedSelect = document.getElementById("dog-breed");
var errorP    = document.getElementById("name-error");
var formDiv   = document.getElementById("adoption-form");
var displayDiv = document.getElementById("dog-display");

// =====================================================
// adoptDog() — runs when the Adopt button is clicked
// =====================================================
// 1. Read the name the visitor typed and trim spaces from the
//    ends. Spaces INSIDE the name are kept.
// 2. If the trimmed name is empty, show a helpful message and stop.
// 3. Otherwise, create a new dog object that starts on Day 1,
//    at the Puppy stage, with happiness 50.
// 4. Switch from the form view to the dog-display view.
function adoptDog() {
  var name = nameInput.value.trim();

  if (name === "") {
    errorP.textContent = "Please enter a name for your dog.";
    return;
  }

  // Clear any previous error message
  errorP.textContent = "";

  // Create the new dog
  dog = {
    name: name,
    breed: breedSelect.value,
    day: 1,
    stage: "Puppy",
    happiness: 50
  };

  // Hide the form and show the dog info
  formDiv.style.display = "none";
  displayDiv.style.display = "block";

  updateDisplay();
}

// =====================================================
// updateDisplay() — writes the dog's info onto the page
// =====================================================
// We use textContent (not innerHTML) so that any special
// characters in the dog's name show up as plain text and
// cannot be run as code. This is a basic safety habit.
function updateDisplay() {
  document.getElementById("display-name").textContent = dog.name;
  document.getElementById("display-breed").textContent = dog.breed;
  document.getElementById("display-day").textContent = dog.day;
  document.getElementById("display-stage").textContent = dog.stage;
  document.getElementById("display-happiness").textContent = dog.happiness;
}

// =====================================================
// feedDog() — increases happiness by 10 (max 100)
// =====================================================
function feedDog() {
  dog.happiness = dog.happiness + 10;
  if (dog.happiness > 100) {
    dog.happiness = 100;
  }
  updateDisplay();
}

// =====================================================
// playDog() — increases happiness by 10 (max 100)
// =====================================================
function playDog() {
  dog.happiness = dog.happiness + 10;
  if (dog.happiness > 100) {
    dog.happiness = 100;
  }
  updateDisplay();
}

// --- Connect buttons to their functions ---
adoptBtn.addEventListener("click", adoptDog);
feedBtn.addEventListener("click", feedDog);
playBtn.addEventListener("click", playDog);

console.log("Virtual Dog Park loaded successfully!");
