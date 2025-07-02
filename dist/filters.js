"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subset = subset;
exports.displaySubsetInfo = displaySubsetInfo;
function subset(data, questionId, option) {
    // Find the question
    const question = data.questions.find(q => q.id === questionId || q.text === questionId);
    if (!question) {
        throw new Error(`Question not found: ${questionId}`);
    }
    // Filter responses based on the option
    const filteredResponses = data.responses.filter(response => {
        const value = response[question.id];
        if (value === null || value === undefined) {
            return false;
        }
        const responseValue = String(value);
        // For multiple choice questions, check if the option is in the semicolon-separated list
        if (question.type === 'mc' && responseValue.includes(';')) {
            const options = responseValue.split(';').map(opt => opt.trim());
            return options.some(opt => opt.toLowerCase().includes(option.toLowerCase()) ||
                option.toLowerCase().includes(opt.toLowerCase()));
        }
        // For single choice or text questions, check if the response contains the option
        return responseValue.toLowerCase().includes(option.toLowerCase()) ||
            option.toLowerCase().includes(responseValue.toLowerCase());
    });
    return {
        originalData: data,
        filteredResponses,
        filterCriteria: {
            question: questionId,
            option
        }
    };
}
function displaySubsetInfo(subsetData) {
    const { originalData, filteredResponses, filterCriteria } = subsetData;
    console.log('\n📊 Subset Information:');
    console.log('='.repeat(50));
    console.log(`Filter: Question="${filterCriteria.question}", Option="${filterCriteria.option}"`);
    console.log(`Original responses: ${originalData.metadata.totalResponses}`);
    console.log(`Filtered responses: ${filteredResponses.length}`);
    console.log(`Percentage: ${((filteredResponses.length / originalData.metadata.totalResponses) * 100).toFixed(2)}%`);
    if (filteredResponses.length > 0) {
        console.log('\n📋 Sample of filtered responses:');
        console.log('-'.repeat(30));
        // Show first 5 responses as examples
        const sampleSize = Math.min(5, filteredResponses.length);
        for (let i = 0; i < sampleSize; i++) {
            const response = filteredResponses[i];
            const questionValue = response[filterCriteria.question];
            console.log(`${i + 1}. ${filterCriteria.question}: ${questionValue}`);
        }
        if (filteredResponses.length > sampleSize) {
            console.log(`... and ${filteredResponses.length - sampleSize} more responses`);
        }
    }
}
//# sourceMappingURL=filters.js.map