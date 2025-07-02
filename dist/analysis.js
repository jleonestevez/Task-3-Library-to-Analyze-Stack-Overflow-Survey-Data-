"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distribution = distribution;
exports.displayDistribution = displayDistribution;
function distribution(data, questionId, type) {
    // Find the question
    const question = data.questions.find(q => q.id === questionId || q.text === questionId);
    if (!question) {
        throw new Error(`Question not found: ${questionId}`);
    }
    const optionCounts = new Map();
    let totalValidResponses = 0;
    // Count responses
    for (const response of data.responses) {
        const value = response[question.id];
        if (value === null || value === undefined || value === '') {
            continue;
        }
        const responseValue = String(value);
        if (type === 'mc' && responseValue.includes(';')) {
            // Multiple choice: split by semicolon and count each option
            const options = responseValue.split(';').map(opt => opt.trim()).filter(opt => opt !== '');
            for (const option of options) {
                optionCounts.set(option, (optionCounts.get(option) || 0) + 1);
            }
            totalValidResponses++;
        }
        else {
            // Single choice or simple text
            optionCounts.set(responseValue, (optionCounts.get(responseValue) || 0) + 1);
            totalValidResponses++;
        }
    }
    // Convert to distribution items and sort by count (descending)
    const distributionItems = Array.from(optionCounts.entries())
        .map(([option, count]) => ({
        option,
        count,
        percentage: totalValidResponses > 0 ? (count / totalValidResponses) * 100 : 0
    }))
        .sort((a, b) => b.count - a.count);
    return {
        question,
        type,
        distribution: distributionItems,
        totalResponses: totalValidResponses
    };
}
function displayDistribution(result) {
    console.log(`\n📊 Distribution for "${result.question.text}" (${result.type.toUpperCase()}):`);
    console.log('='.repeat(80));
    console.log(`Total valid responses: ${result.totalResponses}`);
    console.log('');
    if (result.distribution.length === 0) {
        console.log('❌ No valid responses found for this question.');
        return;
    }
    // Calculate the maximum option length for formatting
    const maxOptionLength = Math.max(...result.distribution.map(item => item.option.length));
    const maxCountLength = Math.max(...result.distribution.map(item => item.count.toString().length));
    result.distribution.forEach((item, index) => {
        const optionPadded = item.option.padEnd(maxOptionLength);
        const countPadded = item.count.toString().padStart(maxCountLength);
        const percentage = item.percentage.toFixed(2).padStart(6);
        const bar = '█'.repeat(Math.round(item.percentage / 2)); // Scale bar to fit in terminal
        console.log(`${(index + 1).toString().padStart(2)}. ${optionPadded} | ${countPadded} (${percentage}%) ${bar}`);
    });
    console.log('');
    console.log(`Showing ${result.distribution.length} unique response(s)`);
}
//# sourceMappingURL=analysis.js.map