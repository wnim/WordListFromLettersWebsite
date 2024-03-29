import { get_ln } from './get_ln.js'

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

class BaseMainAlgorithm {
  constructor() {
    this.lettersList = [];
    this.inputWordsList = [];
    this.outputWordsList = [];
  }

  manipulateInput(lettersList) {
    console.log(this.constructor.name, "Why is this called?", lettersList);
  }

  setLettersList(lettersList) {
    console.log(this.constructor.name, ": setLettersList :", lettersList);
    this.lettersList = lettersList;
    this.manipulateInput(lettersList)
  }

  setWordCountLimit(WordCountLimit) {
    console.log(this.constructor.name, ": setWordCountLimit ", WordCountLimit);
    this.wordCountLimit = WordCountLimit;
  }

  setWordsList(wordsList) {
    console.log(this.constructor.name, ": setWordsList", wordsList.slice(0, 4).concat(["..."]));
    this.inputWordsList = wordsList.slice();
  }

  getOutputWordList() {
    return this.outputWordsList;
  }

  run() {
    throw new Error("Don't run on base class", dropdown);
  }

  assertArraysNotEmpty() {
    if (!this.lettersList.length || !this.inputWordsList.length) {
      console.log(get_ln(), this.constructor.name, ": Some array is empty");
      // You might want to handle this differently depending on your use case
      // For now, I'm logging a message and stopping the script
      throw new Error("Some array is empty");
    }
  }

}

class TrivialMainAlgorithm extends BaseMainAlgorithm {
  constructor() {
    super();
  }

  manipulateInput(lettersList) {
  }

  run() {
    // this.getOutputWordList = this.lettersList;
    this.outputWordsList = this.lettersList.split(/\s+/).filter(word => word.trim() !== '');
  }

}

class NgramMainAlgorithm extends BaseMainAlgorithm {

  constructor() {
    super()
    this.regex = ""
  }

  manipulateInput(lettersList) {
    this.regex = new RegExp(lettersList.join(''));
    console.log(get_ln(), this.constructor.name, "regex = ", this.regex)
  }

  run() {
    this.assertArraysNotEmpty();
    console.log(get_ln(), this.constructor.name, "wordCountLimit", this.wordCountLimit)
    // Filter words from inputWordsList based on regex
    const filteredWords = this.inputWordsList.filter(word => this.regex.test(word));
    // Slice the filtered words to wordCountLimit
    const slicedWords = filteredWords.slice(0, this.wordCountLimit);
    // Push sliced words to outputWordsList
    this.outputWordsList.push(...slicedWords);
    console.log(get_ln(), this.constructor.name, "sliceWords", slicedWords)
  }

}

class LettersMainAlgorithm extends BaseMainAlgorithm {

  constructor() {
    super()
    this.weightedLettersList = [];
  }

  manipulateInput(lettersList) {
    // Create instances of WeightedLetter for each letter
    this.weightedLettersList = lettersList.map(letter => {
      const currCountedLetter = new WeightedLetter();
      currCountedLetter.setLetter(letter);
      return currCountedLetter;
    });
  }

  run() {
    this.assertArraysNotEmpty();
    let counter = 0;
    while (this.outputWordsList.length < this.wordCountLimit) {
      counter += 1;
      this.addNewWordToOutputList();
      console.log(get_ln(), this.constructor.name, "Iteration = ", counter);
    }
    console.log(get_ln(), this.constructor.name, this.outputWordsList);
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

class AvoidLettersMainAlgorithm extends BaseMainAlgorithm {

  // Function to check if a word contains any of the letters
  containsAnyLetters(word, lettersList) {
    for (const letter of lettersList) {
      if (word.includes(letter)) {
        return true; // Return true if any letter is found in the word
      }
    }
    return false; // Return false if none of the letters are found
  }

  run() {
    console.log(this.constructor.name, ": run");
    for (const word of this.inputWordsList) {
      if (!this.containsAnyLetters(word, this.lettersList)) {
        this.outputWordsList.push(word);
        console.log(get_ln(), this.constructor.name, ": run: ", this.outputWordsList.length, " ", this.wordCountLimit);
        if (this.outputWordsList.length > this.wordCountLimit - 1) { //comparison didn't work, don't ask me why
          break; // Stop iterating if the word count limit is reached
        }
      }
    }
  }

}

export { NgramMainAlgorithm, LettersMainAlgorithm, AvoidLettersMainAlgorithm, TrivialMainAlgorithm }
