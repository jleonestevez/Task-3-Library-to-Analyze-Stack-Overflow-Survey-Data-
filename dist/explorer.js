"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showQuestions = showQuestions;
exports.search = search;
function showQuestions(data) {
    data.questions.forEach((q, i) => {
        console.log(`${i + 1}. ${q}`);
    });
}
function search(data, keyword) {
    const matches = [];
    const lower = keyword.toLowerCase();
    for (const q of data.questions) {
        if (q.toLowerCase().includes(lower)) {
            matches.push({ question: q });
        }
        for (const opt of data.options[q]) {
            if (opt.toLowerCase().includes(lower)) {
                matches.push({ question: q, option: opt });
            }
        }
    }
    return matches;
}
