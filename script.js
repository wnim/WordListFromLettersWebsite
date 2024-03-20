//todo: Create input class factory, algorithm factory, and the algorithm for ngrams
import { get_ln } from './get_ln.js'
import { en10kArr } from './en_10k.js'
import { LettersUserInputProcessor, NgramUserInputProcessor } from './UserInputProcessor.js'
import { LettersMainAlgorithm, NgramMainAlgorithm } from './MainAlgorithm.js'

let dropdown = document.getElementById('dropdown').value;

const calculateButton = document.getElementById('calculateButton');  // Get a reference to the "Get words" button
calculateButton.addEventListener('click', calculate);  // Attach the event listener for the "Get words" button

const clearButton = document.getElementById('clearButton');  // Get a reference to the "Clear Output" button
clearButton.addEventListener('click', clearOutput);  // Attach the event listener for the "Clear Output" button

const clearButton2 = document.getElementById('clearButton2');  // Get a reference to the "Clear Output" button
clearButton2.addEventListener('click', clearOutput2);  // Attach the event listener for the "Clear Output" button

const copyButton = document.getElementById('copyButton');  // Get a reference to the "Copy Text" button
copyButton.addEventListener('click', copyText);  // Attach the event listener for the "Copy Text" button

const copyButton2 = document.getElementById('copyButton2');  // Get a reference to the "Copy Text" button
copyButton2.addEventListener('click', copyText2);  // Attach the event listener for the "Copy Text" button

const appendButton = document.getElementById('Append');
appendButton.addEventListener('click', appendTextToOutput2)

// Function to perform the calculation
function calculate() {
  let userInputProcessor;
  let mainAlgorithm;
  dropdown = document.getElementById('dropdown').value;
  console.log(dropdown)
  switch (dropdown) {
    case "letters":
      userInputProcessor = new LettersUserInputProcessor();
      mainAlgorithm = new LettersMainAlgorithm();
      break;
    case "ngram":
      userInputProcessor = new NgramUserInputProcessor();
      mainAlgorithm = new NgramMainAlgorithm();
      break;
    default:
      throw new Error("unknown type", dropdown);
  }

  // Get the value from the input box
  var inputValue = document.getElementById("inputBox").value;
  // Create output for the user
  var result = performCalculation(inputValue, userInputProcessor, mainAlgorithm);
  // Set the value to the output box
  document.getElementById("output").value = result;

}

// Function to perform the actual calculation (modify this based on your needs)
function performCalculation(inputValue, userInputProcessor, mainAlgorithm) {
  // let userInputProcessor = new LettersUserInputProcessor();
  userInputProcessor.setUserInput(inputValue);
  userInputProcessor.checkInputValidity();
  updateStatus(userInputProcessor.getStatus());
  // let mainAlgorithm = new LettersMainAlgorithm();
  mainAlgorithm.setLettersList(userInputProcessor.getUserInput())
  mainAlgorithm.setWordsList(en10kArr)
  mainAlgorithm.run()
  return mainAlgorithm.getOutputWordList().join(' ')
  // return inputValue;
}

// Function to update the status
function updateStatus(status) {
  var statusElement = document.getElementById("status");

  // Set the status message and color based on success or failure
  if (status === "success") {
    statusElement.textContent = "Word retrieval Successful";
    statusElement.style.color = "green";
  } else {
    statusElement.textContent = "Word retrieval Failed: Insert more letters";
    statusElement.style.color = "red";
  }
}

// Function to copy text from the output box - ChatGPT generated
function copyText() {
  var outputBox = document.getElementById("output");
  outputBox.select();
  outputBox.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
  outputBox.setSelectionRange(0, 0);
}

function clearOutput() {
  document.getElementById("output").value = "";
  document.getElementById("status").textContent = "";
}

function copyText2() {
  var outputBox = document.getElementById("output2");
  outputBox.select();
  outputBox.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
  outputBox.setSelectionRange(0, 0);
}

function clearOutput2() {
  document.getElementById("output2").value = "";
}

function appendTextToOutput2() {
  let currOutput = document.getElementById("output").value;
  let currOutput2 = document.getElementById("output2").value;
  document.getElementById("output2").value = currOutput2 + " " + currOutput;
}