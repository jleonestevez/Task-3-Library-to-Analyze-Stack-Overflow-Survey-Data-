"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showQuestions = showQuestions;
exports.search = search;
exports.displaySearchResults = displaySearchResults;
function showQuestions(data) {
    console.log('\n📋 Available Questions:');
    console.log('='.repeat(50));
    data.questions.forEach((question, index) => {
        console.log(`${index + 1}. [${question.type.toUpperCase()}] ${question.text}`);
        if (question.options && question.options.length > 0) {
            question.options.forEach(option => {
                console.log(`   • ${option}`);
            });
        }
        console.log('');
    });
    console.log(`Total Questions: ${data.questions.length}`);
    console.log(`Total Responses: ${data.metadata.totalResponses}`);
}
function search(data, keyword) {
    const matches = [];
    const lowerKeyword = keyword.toLowerCase();
    for (const question of data.questions) {
        // Search in question text
        if (question.text.toLowerCase().includes(lowerKeyword)) {
            matches.push({
                question,
                matchType: 'question',
                matchedText: question.text
            });
        }
        // Search in options if they exist
        if (question.options) {
            for (const option of question.options) {
                if (option.toLowerCase().includes(lowerKeyword)) {
                    matches.push({
                        question,
                        matchType: 'option',
                        matchedText: option
                    });
                }
            }
        }
    }
    return matches;
}
function displaySearchResults(matches, keyword) {
    if (matches.length === 0) {
        console.log(`\n❌ No matches found for "${keyword}"`);
        return;
    }
    console.log(`\n🔍 Search Results for "${keyword}":`);
    console.log('='.repeat(50));
    matches.forEach((match, index) => {
        console.log(`${index + 1}. [${match.question.type.toUpperCase()}] ${match.question.text}`);
        console.log(`   Match in ${match.matchType}: "${match.matchedText}"`);
        console.log('');
    });
    console.log(`Found ${matches.length} match(es)`);
}
//# sourceMappingURL=explorer.js.map