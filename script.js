// ===== Virtual Dog Park — script.js =====
// Round 3: Growing up, saving the dog, and starting over
//
// WHERE IS THE DOG SAVED?
// -----------------------
// The adopted dog is stored in the browser's own "localStorage". Every web
// page gets a small storage box like this from the browser. It is NOT a file
// in this project folder: nothing is written into index.html, script.js, or
// anywhere on the disk. The browser keeps the data on the visitor's own
// computer, for this page only, and it is still there after a refresh,
// after closing the tab, or after turning the computer off.
//
// We use one key — "virtualDogParkPetV1" — and the value is a JSON string:
//
//   {"name":"Biscuit","breed":"Beagle","day":2,"happiness":55}
//
// Because it lives in the browser, the dog disappears for good if the visitor
// clears the browser's site data, uses "Start Over", or opens the page in a
// different browser / on a different computer. Only ONE dog is stored at a
// time: saving again simply overwrites that one key.

// --- Storage settings ---
// The storage key is a name we chose. Keep it in one constant so a typo
// cannot save the dog in one place and read it back from another.
var STORAGE_KEY = "virtualDogParkPetV1";

// Happiness can never go below 0 or above 100.
var MIN_HAPPINESS = 0;
var MAX_HAPPINESS = 100;

// How much one day of growing up costs in happiness.
var HAPPINESS_PER_DAY = 5;

// How much Feed and Play add.
var HAPPINESS_PER_CARE = 10;

// Which picture belongs to which breed.
var BREED_IMAGES = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

// --- Dog state ---
// "dog" holds the current pet, or null if no dog has been adopted yet.
// We only keep name, breed, day and happiness. The stage is not stored,
// because it can always be worked out from the day (see stageForDay).
var dog = null;

// --- Grab the HTML elements we need ---
var adoptBtn     = document.getElementById("adopt-btn");
var feedBtn      = document.getElementById("feed-btn");
var playBtn      = document.getElementById("play-btn");
var nextDayBtn   = document.getElementById("next-day-btn");
var startOverBtn = document.getElementById("start-over-btn");
var nameInput    = document.getElementById("dog-name");
var breedSelect  = document.getElementById("dog-breed");
var errorP       = document.getElementById("name-error");
var formDiv      = document.getElementById("adoption-form");
var displayDiv   = document.getElementById("dog-display");

var portraitImg    = document.getElementById("display-portrait");
var happinessSpan  = document.getElementById("display-happiness");
var stageSpan      = document.getElementById("display-stage");
var growthFill     = document.getElementById("growth-fill");
var growthTrack    = document.getElementById("growth-track");
var growthPercentP = document.getElementById("growth-percent");
var growthCaptionP = document.getElementById("growth-caption");

// =====================================================
// Growth rules — the three stages
// =====================================================
// Day 1            -> "Puppy"
// Days 2 and 3     -> "Young Dog"
// Day 4 and later  -> "Adult Dog"
function stageForDay(day) {
  if (day <= 1) {
    return "Puppy";
  }
  if (day <= 3) {
    return "Young Dog";
  }
  return "Adult Dog";
}

// The growth bar fills up a little on every day, and reaches 100% the
// moment the dog becomes an Adult Dog on Day 4.
function growthPercentForDay(day) {
  if (day <= 1) {
    return 25;
  }
  if (day <= 2) {
    return 50;
  }
  if (day <= 3) {
    return 75;
  }
  return 100;
}

// A plain-English sentence about what happens next, so the stage is never
// communicated only by colour or by the size of the picture.
function growthCaptionForDay(day) {
  if (day <= 1) {
    return "Puppy stage — the Young Dog stage starts on Day 2.";
  }
  if (day <= 2) {
    return "Young Dog stage — 2 more days until the Adult Dog stage.";
  }
  if (day <= 3) {
    return "Young Dog stage — 1 more day until the Adult Dog stage.";
  }
  return "Adult Dog stage — fully grown.";
}

// =====================================================
// Small helpers
// =====================================================
// Keep a number inside a range, e.g. happiness between 0 and 100.
function clamp(value, lowest, highest) {
  if (value < lowest) {
    return lowest;
  }
  if (value > highest) {
    return highest;
  }
  return value;
}

// A quick check that a value from storage is a real number and not,
// say, the text "abc".
function isNumber(value) {
  return typeof value === "number" && isFinite(value);
}

// Show the adoption form and hide the dog.
function showFormView() {
  formDiv.style.display = "block";
  displayDiv.style.display = "none";
}

// Show the dog and hide the adoption form.
function showDogView() {
  formDiv.style.display = "none";
  displayDiv.style.display = "block";
}

// =====================================================
// Saving and loading the dog with localStorage
// =====================================================

// saveDog() — write the current dog into localStorage.
// We call this right after adoption and after every Feed, Play and
// Next Day click, so a refresh never loses progress.
function saveDog() {
  if (dog === null) {
    return;
  }

  // Only these four fields are saved.
  var savedDog = {
    name: dog.name,
    breed: dog.breed,
    day: dog.day,
    happiness: dog.happiness
  };

  // localStorage can only store text, so we turn the object into a
  // JSON string with JSON.stringify.
  var savedText = JSON.stringify(savedDog);

  try {
    localStorage.setItem(STORAGE_KEY, savedText);
  } catch (error) {
    // A few browser settings block storage (for example some private
    // modes). The game still works, it just cannot remember the dog.
    console.log("Could not save the dog:", error);
  }
}

// loadSavedDog() — read the dog back, or return null if there is none.
// We check every field, because the stored text could be old or broken.
function loadSavedDog() {
  var savedText = null;

  try {
    savedText = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.log("Could not read saved dog:", error);
    return null;
  }

  if (savedText === null) {
    return null;
  }

  // Turn the text back into an object. If the text is not valid JSON,
  // JSON.parse throws an error, so we catch it and treat it as "no dog".
  var saved;
  try {
    saved = JSON.parse(savedText);
  } catch (error) {
    console.log("Saved dog was not readable:", error);
    return null;
  }

  if (saved === null || typeof saved !== "object") {
    return null;
  }

  // Validate the fields before trusting them.
  if (typeof saved.name !== "string" || saved.name.trim() === "") {
    return null;
  }
  if (typeof saved.breed !== "string" || !BREED_IMAGES.hasOwnProperty(saved.breed)) {
    return null;
  }
  if (!isNumber(saved.day) || saved.day < 1) {
    return null;
  }
  if (!isNumber(saved.happiness)) {
    return null;
  }

  // Rebuild a clean dog object with safe values.
  return {
    name: saved.name,
    breed: saved.breed,
    day: Math.floor(saved.day),
    happiness: clamp(Math.round(saved.happiness), MIN_HAPPINESS, MAX_HAPPINESS)
  };
}

// clearSavedDog() — forget the saved dog completely.
function clearSavedDog() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.log("Could not clear the saved dog:", error);
  }
}

// =====================================================
// adoptDog() — runs when the Adopt button is clicked
// =====================================================
// 1. Read the name the visitor typed and trim spaces from the
//    ends. Spaces INSIDE the name are kept.
// 2. If the trimmed name is empty, show a helpful message and stop.
// 3. Otherwise, create a new dog object that starts on Day 1,
//    at the Puppy stage, with happiness 50.
// 4. Save it, then switch from the form view to the dog-display view.
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
    happiness: 50
  };

  // Remember the new dog straight away
  saveDog();

  showDogView();
  updateDisplay();
}

// =====================================================
// updateDisplay() — writes the dog's info onto the page
// =====================================================
// We use textContent (not innerHTML) so that any special
// characters in the dog's name show up as plain text and
// cannot be run as code. This is a basic safety habit.
function updateDisplay() {
  if (dog === null) {
    return;
  }

  var stage = stageForDay(dog.day);
  var growth = growthPercentForDay(dog.day);

  document.getElementById("display-name").textContent = dog.name;
  document.getElementById("display-breed").textContent = dog.breed;
  document.getElementById("display-day").textContent = dog.day;

  // The stage is always written out as words, not just implied by colour.
  stageSpan.textContent = stage;
  happinessSpan.textContent = dog.happiness;

  // The picture matches the breed, and it gets bigger with each stage.
  portraitImg.src = BREED_IMAGES[dog.breed];
  portraitImg.alt = "Illustration of a " + dog.breed;
  portraitImg.className = "dog-portrait " + sizeClassForStage(stage);

  // Fill the growth bar and describe it in words.
  growthFill.style.width = growth + "%";
  growthPercentP.textContent = growth + "%";
  growthTrack.setAttribute("aria-valuenow", growth);
  growthTrack.setAttribute("aria-label", "Growth: " + growth + " percent");
  growthCaptionP.textContent = growthCaptionForDay(dog.day);
}

// Which size class the portrait should use for a given stage.
function sizeClassForStage(stage) {
  if (stage === "Puppy") {
    return "size-puppy";
  }
  if (stage === "Young Dog") {
    return "size-young";
  }
  return "size-adult";
}

// =====================================================
// feedDog() — increases happiness by 10 (max 100)
// =====================================================
function feedDog() {
  if (dog === null) {
    return;
  }

  dog.happiness = clamp(dog.happiness + HAPPINESS_PER_CARE, MIN_HAPPINESS, MAX_HAPPINESS);
  updateDisplay();
  saveDog();
}

// =====================================================
// playDog() — increases happiness by 10 (max 100)
// =====================================================
function playDog() {
  if (dog === null) {
    return;
  }

  dog.happiness = clamp(dog.happiness + HAPPINESS_PER_CARE, MIN_HAPPINESS, MAX_HAPPINESS);
  updateDisplay();
  saveDog();
}

// =====================================================
// nextDay() — move the dog forward one day
// =====================================================
// Day goes up by 1 and happiness goes down by 5, but never below 0.
// The stage is worked out from the new day, so the dog grows up on
// Day 2 (Young Dog) and Day 4 (Adult Dog).
function nextDay() {
  if (dog === null) {
    return;
  }

  dog.day = dog.day + 1;
  dog.happiness = clamp(dog.happiness - HAPPINESS_PER_DAY, MIN_HAPPINESS, MAX_HAPPINESS);

  updateDisplay();
  saveDog();
}

// =====================================================
// startOver() — delete the saved dog and go back to the form
// =====================================================
// We ask first with window.confirm. If the visitor clicks Cancel,
// nothing happens and the dog stays exactly as it was.
function startOver() {
  var sure = window.confirm(
    "Start over with a new dog?\n\n" +
    "This deletes the saved dog (name, breed, day and happiness) " +
    "from this browser, and it cannot be undone."
  );

  if (!sure) {
    // Cancel was clicked — keep the dog and do nothing else.
    return;
  }

  clearSavedDog();
  dog = null;

  // Clear the form so the visitor starts clean.
  nameInput.value = "";
  breedSelect.selectedIndex = 0;
  errorP.textContent = "";

  showFormView();
}

// --- Connect buttons to their functions ---
adoptBtn.addEventListener("click", adoptDog);
feedBtn.addEventListener("click", feedDog);
playBtn.addEventListener("click", playDog);
nextDayBtn.addEventListener("click", nextDay);
startOverBtn.addEventListener("click", startOver);

// =====================================================
// Start-up: bring the dog back after a refresh
// =====================================================
// This runs once when the page loads. If localStorage holds a saved dog,
// we show it again exactly where the visitor left off.
var savedDog = loadSavedDog();

if (savedDog !== null) {
  dog = savedDog;
  showDogView();
  updateDisplay();
} else {
  showFormView();
}

console.log("Virtual Dog Park loaded successfully!");
