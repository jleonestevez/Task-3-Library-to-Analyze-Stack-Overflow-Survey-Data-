"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distribution = distribution;
function distribution(data, question, type) {
    const counts = {};
    for (const row of data.responses) {
        const val = row[question];
        if (!val)
            continue;
        if (type === 'mc') {
            const opts = String(val).split(';').map(v => v.trim());
            for (const opt of opts) {
                if (!opt)
                    continue;
                counts[opt] = (counts[opt] || 0) + 1;
            }
        }
        else {
            counts[val] = (counts[val] || 0) + 1;
        }
    }
    return { question, counts };
}
