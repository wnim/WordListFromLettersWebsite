import { get_ln } from "./get_ln.js";

class BaseUserInputProcessor {
  constructor() {
    this.userInput = "";
    this.editedUserInput = [];
    this.status = "success";
  }

  setUserInput(userInput) {
  }

  getUserInput() {
    return this.editedUserInput;
  }

  getStatus() {
    return this.status;
  }

  checkInputValidity() {
  }

}

class NgramUserInputProcessor extends BaseUserInputProcessor {
  setUserInput(userInput) {
    // Remove non-English letters, convert uppercase to lowercase
    // this.userInput = [...new Set(userInput.replace(/[^a-zA-Z]/g, '').toLowerCase())].join('');
    this.userInput = userInput.replace(/[^a-zA-Z]/g, '').toLowerCase();

    // Update the value in the input box
    document.getElementById("inputBox").value = this.userInput;

    // Reset status before checking input validity
    this.status = "success";
    this.checkInputValidity();
  }

  checkInputValidity() {
    // Check if there is at least one English letter
    if (this.userInput.length < 2) {
      this.status = "failure";
    } else {
      // Translate the user input to an array of characters
      this.editedUserInput = this.userInput.split('');

      // All checks passed, set status to success
      this.status = "success";
    }
  }

}

class LettersUserInputProcessor extends BaseUserInputProcessor {

  setUserInput(userInput) {
    // Remove non-English letters, convert uppercase to lowercase, remove redundancies, and sort alphabetically
    this.userInput = [...new Set(userInput.replace(/[^a-zA-Z]/g, '').toLowerCase())].sort().join('');

    // Update the value in the input box
    document.getElementById("inputBox").value = this.userInput;

    // Reset status before checking input validity
    this.status = "success";
    this.checkInputValidity();
  }

  checkInputValidity() {
    // Check if there is at least one English letter
    if (this.userInput.length === 0) {
      this.status = "failure";
    } else {
      // Translate the user input to an array of characters
      this.editedUserInput = this.userInput.split('');

      // All checks passed, set status to success
      this.status = "success";
    }
  }

}

export {NgramUserInputProcessor, LettersUserInputProcessor}