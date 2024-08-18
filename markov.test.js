const MarkovMachine = require('./markov');

describe('MarkovMachine', () => {
    test('makeChains correctly creates chains', () => {
        let mm = new MarkovMachine("the cat in the hat");
        expect(mm.chains).toEqual({
            "the": ["cat", "hat"],
            "cat": ["in"],
            "in": ["the"],
            "hat": [null]
        });
    });

    test('makeText generates text within word limit', () => {
        let mm = new MarkovMachine("the cat in the hat");
        let text = mm.makeText(5);
        let words = text.split(/[ \r\n]+/);
        expect(words.length).toBeLessThanOrEqual(5);
    });

    test('makeText generates valid text', () => {
        let mm = new MarkovMachine("the cat in the hat");
        let text = mm.makeText(50);
        let words = text.split(/[ \r\n]+/);

        for (let i = 0; i < words.length - 1; i++) {
            expect(mm.chains[words[i]]).toContain(words[i + 1]);
        }
    });
});
