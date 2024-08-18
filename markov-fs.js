const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

/** Textual markov chain generator */

class MarkovMachine {
    constructor(text) {
        let words = text.split(/[ \r\n]+/);
        this.words = words.filter(c => c !== "");
        this.makeChains();
    }

    /** Set markov chains using bigrams:
     *
     *  for text of "the cat in the hat", chains will be
     *  {"the cat": ["in"], "cat in": ["the"], "in the": ["hat"], "the hat": ["is", null], ... }
     */
    makeChains() {
        this.chains = {};

        for (let i = 0; i < this.words.length - 1; i++) {
            let bigram = this.words[i] + " " + this.words[i + 1];
            let nextWord = this.words[i + 2] || null;

            if (!this.chains[bigram]) {
                this.chains[bigram] = [];
            }
            this.chains[bigram].push(nextWord);
        }
    }

    /** Return random text from chains */
    makeText(numWords = 100) {
        let keys = Object.keys(this.chains).filter(wordPair => /^[A-Z]/.test(wordPair));
        let key = this._choice(keys);
        let output = key.split(" ");

        while (output.length < numWords) {
            key = output.slice(-2).join(" ");
            let nextWord = this._choice(this.chains[key]);

            if (!nextWord || nextWord.endsWith('.')) break;
            output.push(nextWord);
        }

        return output.join(" ");
    }

    /** Generator function to yield text one word at a time */
    *generateText(numWords = 100) {
        let keys = Object.keys(this.chains).filter(wordPair => /^[A-Z]/.test(wordPair));
        let key = this._choice(keys);
        let output = key.split(" ");

        while (output.length < numWords) {
            key = output.slice(-2).join(" ");
            let nextWord = this._choice(this.chains[key]);

            if (!nextWord || nextWord.endsWith('.')) break;
            output.push(nextWord);
            yield output.join(" ");
        }
    }

    /** Helper function to pick a random choice from an array */
    _choice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

/** Generate text from multiple files or URLs */
async function makeText(sources) {
    try {
        let combinedText = "";

        for (let source of sources) {
            let text;
            if (source.type === "file") {
                text = fs.readFileSync(source.path, 'utf8');
            } else if (source.type === "url") {
                const response = await axios.get(source.path);
                const $ = cheerio.load(response.data);
                text = $('body').text(); // Strip HTML tags and extract text
            } else {
                console.error(`Unknown source type: ${source.type}`);
                process.exit(1);
            }
            combinedText += text + " ";
        }

        let mm = new MarkovMachine(combinedText);
        console.log(mm.makeText());

    } catch (err) {
        console.error(`Error: Cannot process sources`);
        console.error(err.message);
        process.exit(1);
    }
}

/** Command-line arguments parsing */
let args = process.argv.slice(2);
let sources = [];

while (args.length > 0) {
    let type = args.shift();
    let path = args.shift();
    if (type && path) {
        sources.push({ type, path });
    } else {
        console.error('Usage: node makeText.js <type> <path> [<type> <path> ...]');
        process.exit(1);
    }
}

makeText(sources);
