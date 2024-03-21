import { get_ln } from "./get_ln.js";

class BaseUserInputProcessor {
  constructor() {
    this.inputLetters = "";
    this.editedUserInput = [];
    this.status = "success";
    this.wordCountUpperLimit;
  }

  setUserInput(inputLetters, wordCountUpperLimit) {
    this.wordCountUpperLimit = parseInt(wordCountUpperLimit.replace(/\D+/g, ''), 10);
    // Remove trailing zeros
    this.wordCountUpperLimit = this.wordCountUpperLimit.toString().replace(/^0+/, '');
    // If the result is 0 or empty, change to 200
    if (isNaN(this.wordCountUpperLimit) || this.wordCountUpperLimit === '') {
      this.wordCountUpperLimit = 200;
    }
    if (this.wordCountUpperLimit > 9000) {
      this.wordCountUpperLimit = 9000;
    }
    document.getElementById("wordCountUpperLimit").value = this.wordCountUpperLimit;
  }

  getWordCountUpperLimit() {
    return this.wordCountUpperLimit;
  }

  getUserLetters() {
    return this.editedUserInput;
  }

  getStatus() {
    return this.status;
  }

  checkInputValidity() {
  }

}

class TrivialUserInputProcessor extends BaseUserInputProcessor {
  setUserInput(inputLetters, wordCountUpperLimit) {
    this.editedUserInput = inputLetters;
  }
}

class NgramUserInputProcessor extends BaseUserInputProcessor {

  setUserInput(inputLetters, wordCountUpperLimit) {
    super.setUserInput(inputLetters, wordCountUpperLimit);
    // Remove non-English letters, convert uppercase to lowercase
    // this.inputLetters = [...new Set(inputLetters.replace(/[^a-zA-Z]/g, '').toLowerCase())].join('');
    this.inputLetters = inputLetters.replace(/[^a-zA-Z]/g, '').toLowerCase();

    // Update the value in the input box
    document.getElementById("inputBox").value = this.inputLetters;

    // Reset status before checking input validity
    this.status = "success";
    this.checkInputValidity();
  }

  checkInputValidity() {
    // Check if there is at least one English letter
    if (this.inputLetters.length < 2) {
      this.status = "failure";
    } else {
      // Translate the user input to an array of characters
      this.editedUserInput = this.inputLetters.split('');

      // All checks passed, set status to success
      this.status = "success";
    }
  }

}

class LettersUserInputProcessor extends BaseUserInputProcessor {

  setUserInput(inputLetters, wordCountUpperLimit) {
    super.setUserInput(inputLetters, wordCountUpperLimit);
    // Remove non-English letters, convert uppercase to lowercase, remove redundancies, and sort alphabetically
    this.inputLetters = [...new Set(inputLetters.replace(/[^a-zA-Z]/g, '').toLowerCase())].sort().join('');

    // Update the value in the input box
    document.getElementById("inputBox").value = this.inputLetters;

    // Reset status before checking input validity
    this.status = "success";
    this.checkInputValidity();
  }

  checkInputValidity() {
    // Check if there is at least one English letter
    if (this.inputLetters.length === 0) {
      this.status = "failure";
    } else {
      // Translate the user input to an array of characters
      this.editedUserInput = this.inputLetters.split('');

      // All checks passed, set status to success
      this.status = "success";
    }
  }

}

export { NgramUserInputProcessor, LettersUserInputProcessor, TrivialUserInputProcessor}