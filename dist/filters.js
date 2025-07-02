"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subset = subset;
function subset(data, question, option) {
    const filtered = data.responses.filter(row => {
        if (!row[question])
            return false;
        return String(row[question]).split(';').map((v) => v.trim()).includes(option);
    });
    return {
        question,
        option,
        responses: filtered
    };
}
