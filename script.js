import { en10kArr } from './en_10k.js'

const calculateButton = document.getElementById('calculateButton');  // Get a reference to the "Get words" button
calculateButton.addEventListener('click', calculate);  // Attach the event listener for the "Get words" button

const clearButton = document.getElementById('clearButton');  // Get a reference to the "Clear Output" button
clearButton.addEventListener('click', clearOutput);  // Attach the event listener for the "Clear Output" button

const copyButton = document.getElementById('copyButton');  // Get a reference to the "Copy Text" button
copyButton.addEventListener('click', copyText);  // Attach the event listener for the "Copy Text" button

function get_ln() {
  const error = new Error();
  const stackLines = error.stack.split('\n');
  // Extract the third line, which contains the information about the calling function and line number
  const callingFunctionLine = stackLines[2].trim();
  // Extract the line number from the calling function information
  const lineNumber = callingFunctionLine.match(/:(\d+):/)[1];
  return `Line ${lineNumber}`;
}

// script.js
class WeightedLetter {
  constructor() {
    this.letter = "";
    this.counter = 0;
    this.weight = 0.0;
  }

  setLetter(letter) {
    this.letter = letter;
  }

  getLetter() {
    return this.letter;
  }

  incrementCounter() {
    this.counter += 1;
  }

  getCounterValue() {
    return this.counter;
  }

  calculateWeight(aggregatedCounters) {
    if (aggregatedCounters !== 0) {
      this.weight = 1.001 - (this.counter / aggregatedCounters);
    } else {
      this.weight = 1;
    }
  }

  getWeight() {
    return this.weight;
  }
}

class UserInputProcessor {
  constructor() {
    this.userInput = "";
    this.lettersArray = [];
    this.status = "success";
  }

  setUserInput(userInput) {
    // Remove non-English letters, convert uppercase to lowercase, remove redundancies, and sort alphabetically
    this.userInput = [...new Set(userInput.replace(/[^a-zA-Z]/g, '').toLowerCase())].sort().join('');

    // Update the value in the input box
    document.getElementById("inputBox").value = this.userInput;

    // Reset status before checking input validity
    this.status = "success";
    this.checkInputValidity();
  }

  getLettersArray() {
    return this.lettersArray;
  }

  getStatus() {
    return this.status;
  }

  checkInputValidity() {
    // Check if there is at least one English letter
    if (this.userInput.length === 0) {
      this.status = "failure";
    } else {
      // Translate the user input to an array of characters
      this.lettersArray = this.userInput.split('');

      // All checks passed, set status to success
      this.status = "success";
    }
  }

}

class MainAlgorithm {
  constructor() {
    this.lettersList = [];
    this.weightedLettersList = [];
    this.inputWordsList = [];
    this.outputWordsList = [];
  }

  setLettersList(lettersList) {
    console.log(this.constructor.name, ": setLettersList :", lettersList);
    this.lettersList = lettersList;

    // Create instances of WeightedLetter for each letter
    this.weightedLettersList = lettersList.map(letter => {
      const currCountedLetter = new WeightedLetter();
      currCountedLetter.setLetter(letter);
      return currCountedLetter;
    });
  }

  setWordsList(wordsList) {
    console.log(this.constructor.name, ": setWordsList", wordsList.slice(0, 4).concat(["..."]));
    this.inputWordsList = wordsList.slice();
  }

  getOutputWordList() {
    return this.outputWordsList;
  }

  run() {
    this.assertArraysNotEmpty();
    let counter = 0;
    while (this.outputWordsList.length < 200) {
      counter += 1;
      this.addNewWordToOutputList();
      console.log(get_ln(), this.constructor.name, "Iteration = ", counter);
    }
    console.log(get_ln(), this.constructor.name, this.outputWordsList);
  }

  assertArraysNotEmpty() {
    if (!this.lettersList.length || !this.inputWordsList.length) {
      console.log(get_ln(), this.constructor.name, ": Some array is empty");
      // You might want to handle this differently depending on your use case
      // For now, I'm logging a message and stopping the script
      throw new Error("Some array is empty");
    }
  }

  findNewBestWordToAddToList() {
    console.log(get_ln(), this.constructor.name, "Finding best word");
    let highestScoreWordLength = 0;
    let highestScore = 0;
    let currWordLength = 0;
    let currScore = 0;
    let wordToReturn = "";
    for (const word of this.inputWordsList) {
      currScore = this.getWordScore(word);
      currWordLength = word.length;
      if (currScore > highestScore || (currScore === highestScore && currWordLength < highestScoreWordLength)) {
        highestScore = currScore;
        wordToReturn = word;
      }
    }
    return wordToReturn;
  }

  getOutputWordList() {
    return this.outputWordsList;
  }

  addNewWordToOutputList() {
    this.calculateLettersWeight();
    const newWord = this.findNewBestWordToAddToList();
    this.incrementLetterCounters(newWord);
    this.outputWordsList.push(newWord);
    this.removeWordFromInputList(newWord);
  }

  calculateLettersWeight() {
    let totalCount = 0;
    for (const letter of this.weightedLettersList) {
      totalCount += letter.getCounterValue();
    }
    console.log(get_ln(), this.constructor.name, ": calculateLettersWeight : totalCount = ", totalCount);
    for (const letter of this.weightedLettersList) {
      letter.calculateWeight(totalCount);
    }
  }

  incrementLetterCounters(newWord) {
    for (const char of newWord) {
      for (const letter of this.weightedLettersList) {
        if (char === letter.getLetter()) {
          letter.incrementCounter();
        }
      }
    }
  }

  getWordScore(word) {
    let wordScore = 0;
    for (const char of word) {
      for (const letter of this.weightedLettersList) {
        if (char === letter.getLetter()) {
          wordScore += letter.getWeight();
        }
      }
    }
    // console.log(get_ln(), this.constructor.name, ": getWordScore : word = ", word, "score = ", wordScore);
    return wordScore;
  }

  removeWordFromInputList(newWord) {
    console.log(get_ln(), this.constructor.name, "Removing word '", newWord, "' from inputWordsList");
    const index = this.inputWordsList.indexOf(newWord);
    if (index !== -1) {
      this.inputWordsList.splice(index, 1);
    }
  }
}

        // document.addEventListener('DOMContentLoaded', function () {
        //     const calculateButton = document.getElementById('calculateButton');
        //     calculateButton.addEventListener('click', calculate);

        //     function calculate() {
        //         // Get the value from the input box
        //         var inputValue = document.getElementById("inputBox").value;
        //         // Perform the calculation (you can modify this part based on your needs)
        //         var result = performCalculation(inputValue);
        //         // Set the value to the output box
        //         document.getElementById("output").value = result;
        //     }
        // });

// Function to perform the calculation
function calculate() {
  // Get the value from the input box
  var inputValue = document.getElementById("inputBox").value;
  // Perform the calculation (you can modify this part based on your needs)
  var result = performCalculation(inputValue);
  // Set the value to the output box
  document.getElementById("output").value = result;

}

// Function to copy text from the output box
function copyText() {
  var outputBox = document.getElementById("output");

  // Select the text in the output box
  outputBox.select();
  outputBox.setSelectionRange(0, 99999); /* For mobile devices */

  // Copy the selected text to the clipboard
  document.execCommand("copy");

  // Deselect the text
  outputBox.setSelectionRange(0, 0);
}

// Function to perform the actual calculation (modify this based on your needs)
function performCalculation(inputValue) {
  let userInputProcessor = new UserInputProcessor();
  userInputProcessor.setUserInput(inputValue);
  userInputProcessor.checkInputValidity();
  updateStatus(userInputProcessor.getStatus());
  let mainAlgorithm = new MainAlgorithm();
  mainAlgorithm.setLettersList(userInputProcessor.getLettersArray())
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
    statusElement.textContent = "Word retrieval Failed: Insert at least one English letter";
    statusElement.style.color = "red";
  }
}

function clearOutput() {
  document.getElementById("output").value = "";
  document.getElementById("status").textContent = "";
}