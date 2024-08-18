/** Command-line tool to generate Markov text. */
const fs = require('fs');
const axios = require('axios');
const MarkovMachine = require('./markov');

/** Generate text from file or URL */
async function makeText(type, path) {
    try {
        let text;

        if (type === "file") {
            text = fs.readFileSync(path, 'utf8');
        } else if (type === "url") {
            const response = await axios.get(path);
            text = response.data;
        } else {
            console.error(`Unknown type: ${type}`);
            process.exit(1);
        }

        let mm = new MarkovMachine(text);
        console.log(mm.makeText());

    } catch (err) {
        console.error(`Error: Cannot read ${type} at ${path}`);
        console.error(err.message);
        process.exit(1);
    }
}

/** Command-line arguments */
let [type, path] = process.argv.slice(2);

if (!type || !path) {
    console.error('Usage: node makeText.js <type> <path>');
    process.exit(1);
}

makeText(type, path);

