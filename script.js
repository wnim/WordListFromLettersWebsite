//todo: Create input class factory, algorithm factory, and the algorithm for ngrams
import { get_ln } from './get_ln.js'
import { en10kArr } from './en_10k.js'
import { LettersUserInputProcessor, NgramUserInputProcessor, TrivialUserInputProcessor } from './UserInputProcessor.js'
import { LettersMainAlgorithm, NgramMainAlgorithm, AvoidLettersMainAlgorithm, TrivialMainAlgorithm } from './MainAlgorithm.js'

let inputDropdownVal = document.getElementById('dropdown').value;
let replaceAppendDropdownVal = document.getElementById('dropdown2').value;

const calculateButton = document.getElementById('calculateButton');  // Get a reference to the "Get words" button
calculateButton.addEventListener('click', calculate);  // Attach the event listener for the "Get words" button

const inputBox = document.getElementById('inputBox');
const wordCountUpperLimitBox = document.getElementById('wordCountUpperLimit');

inputBox.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) { // Check if Enter key is pressed
    calculateButton.click(); // Trigger click event on the "Get words" button
  }
});

wordCountUpperLimitBox.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) { // Check if Enter key is pressed
    calculateButton.click();
  }
});

const clearButton = document.getElementById('clearButton');  // Get a reference to the "Clear Output" button
clearButton.addEventListener('click', clearOutput);  // Attach the event listener for the "Clear Output" button

const copyButton = document.getElementById('copyButton');  // Get a reference to the "Copy Text" button
copyButton.addEventListener('click', copyText);  // Attach the event listener for the "Copy Text" button

const dropdown = document.getElementById('dropdown');
const wordCountInput = document.getElementById('wordCountUpperLimit');

dropdown.addEventListener('change', function () {
  const selectedValue = dropdown.value;
  if (selectedValue === 'free') {
    // Disable the word count input box
    wordCountInput.disabled = true;
  } else {
    // Enable the word count input box
    wordCountInput.disabled = false;
  }
});

// Function to perform the calculation
function calculate() {
  let userInputProcessor;
  let mainAlgorithm;
  let outputString;

  inputDropdownVal = document.getElementById('dropdown').value;
  replaceAppendDropdownVal = document.getElementById('dropdown2').value;

  let isChecked = document.getElementById('myCheckbox').checked;

  console.log(inputDropdownVal)

  switch (inputDropdownVal) {
    case "letters":
      userInputProcessor = new LettersUserInputProcessor();
      mainAlgorithm = new LettersMainAlgorithm();
      break;
    case "ngram":
      userInputProcessor = new NgramUserInputProcessor();
      mainAlgorithm = new NgramMainAlgorithm();
      break;
    case "avoid":
      userInputProcessor = new LettersUserInputProcessor();
      mainAlgorithm = new AvoidLettersMainAlgorithm();
      break;
    case "free":
      userInputProcessor = new TrivialUserInputProcessor();
      mainAlgorithm = new TrivialMainAlgorithm();
      break;
    default:
      throw new Error("unknown type", inputDropdownVal);
  }

  // Get the value from the input box
  let inputLetters = document.getElementById("inputBox").value;
  let wordCountUpperLimit = document.getElementById("wordCountUpperLimit").value;
  // Create output for the user
  let result = performCalculation(inputLetters, userInputProcessor, mainAlgorithm, wordCountUpperLimit);

  // Set the value to the output box
  console.log(replaceAppendDropdownVal)
  switch (replaceAppendDropdownVal) {
    case "replace":
      outputString = result;
      break;
    case "append":
      let curr_val = document.getElementById("output").value;
      outputString = result + " " + curr_val;
      break;
    default:
      throw new Error("unknown type", replaceAppendDropdownVal);
  }

  if (isChecked) {
    outputString = outputString
      .split(/\s+/) // Split the string into an array of words
      .filter((word, index, array) => array.indexOf(word) === index) // Remove duplicates
      .join(' '); // Join the array b
  }

  document.getElementById("output").value = outputString;

  // Count the number of words in the outputString by trimming whitespace,
  // splitting by one or more whitespace characters, and filtering out empty strings
  dynamicTextContainer.textContent = "Word count is: " + outputString.trim().split(/\s+/).filter(Boolean).length;

}

// Function to perform the actual calculation (modify this based on your needs)
function performCalculation(inputLetters, userInputProcessor, mainAlgorithm, wordCountUpperLimit) {
  // let userInputProcessor = new LettersUserInputProcessor();
  userInputProcessor.setUserInput(inputLetters, wordCountUpperLimit);
  userInputProcessor.checkInputValidity();
  updateStatus(userInputProcessor.getStatus());
  // let mainAlgorithm = new LettersMainAlgorithm();
  mainAlgorithm.setLettersList(userInputProcessor.getUserLetters())
  mainAlgorithm.setWordCountLimit(userInputProcessor.getWordCountUpperLimit())
  mainAlgorithm.setWordsList(en10kArr)
  mainAlgorithm.run()
  return mainAlgorithm.getOutputWordList().join(' ')
  // return inputValue;
}

// Function to update the status
function updateStatus([status, message]) {
  let statusElement = document.getElementById("status");

  // Set the status message and color based on success or failure
  statusElement.textContent = message;
  if (status === "success") {
    statusElement.style.color = "green";
  } else {
    statusElement.style.color = "red";
  }
}

// Function to copy text from the output box - ChatGPT generated
function copyText() {
  let outputBox = document.getElementById("output");
  outputBox.select();
  outputBox.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
  outputBox.setSelectionRange(0, 0);
}

function clearOutput() {
  document.getElementById("output").value = "";
  document.getElementById("status").textContent = "";
  dynamicTextContainer.textContent = "Word count is: " + "0";
}


