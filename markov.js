/** Textual markov chain generator */


class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    this.chains = {};

    for (let i = 0; i < this.words.length; i++) {
      let word = this.words[i];
      let nextWord = this.words[i + 1] || null;

      if (!this.chains[word]) {
        this.chains[word] = [];
      }
      this.chains[word].push(nextWord);
    }
  }



  /** return random text from chains */

  makeText(numWords = 100) {
    // Pick a random word to start with
    let keys = Object.keys(this.chains);
    let key = this._choice(keys);
    let output = [];

    while (output.length < numWords && key !== null) {
      output.push(key);
      key = this._choice(this.chains[key]);
    }

    return output.join(" ");
  }

  /** pick a random choice from an array */

  _choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

// Example usage
let mm = new MarkovMachine("the cat in the hat");
console.log(mm.makeText());
