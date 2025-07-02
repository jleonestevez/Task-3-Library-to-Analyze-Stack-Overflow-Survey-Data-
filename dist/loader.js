"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSurvey = loadSurvey;
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
function loadSurvey(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Convert sheet to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (jsonData.length < 2) {
        throw new Error('Excel file must have at least a header row and one data row');
    }
    const headers = jsonData[0];
    const dataRows = jsonData.slice(1);
    // Parse questions from headers
    const questions = parseQuestionsFromHeaders(headers);
    // Parse responses
    const responses = parseResponses(dataRows, headers);
    return {
        questions,
        responses,
        metadata: {
            totalResponses: responses.length,
            columns: headers
        }
    };
}
function parseQuestionsFromHeaders(headers) {
    const questions = [];
    for (const header of headers) {
        if (!header || header.trim() === '')
            continue;
        // Try to determine question type based on header name patterns
        const type = determineQuestionType(header);
        questions.push({
            id: header,
            text: header,
            type,
            options: type === 'sc' || type === 'mc' ? [] : undefined
        });
    }
    return questions;
}
function determineQuestionType(header) {
    const lowerHeader = header.toLowerCase();
    // Common patterns for multiple choice questions
    if (lowerHeader.includes('select all') ||
        lowerHeader.includes('multiple') ||
        lowerHeader.includes('check all')) {
        return 'mc';
    }
    // Common patterns for single choice questions
    if (lowerHeader.includes('choose one') ||
        lowerHeader.includes('select one') ||
        lowerHeader.includes('which of') ||
        lowerHeader.includes('mainbranch') ||
        lowerHeader.includes('employment') ||
        lowerHeader.includes('devtype')) {
        return 'sc';
    }
    // Numeric fields
    if (lowerHeader.includes('age') ||
        lowerHeader.includes('years') ||
        lowerHeader.includes('salary') ||
        lowerHeader.includes('count')) {
        return 'number';
    }
    // Default to text
    return 'text';
}
function parseResponses(dataRows, headers) {
    const responses = [];
    for (const row of dataRows) {
        const response = {};
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const value = row[i];
            if (header && value !== undefined && value !== null && value !== '') {
                // Try to parse as number if it looks like a number
                if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
                    response[header] = Number(value);
                }
                else {
                    response[header] = value;
                }
            }
            else {
                response[header] = null;
            }
        }
        responses.push(response);
    }
    return responses;
}
//# sourceMappingURL=loader.js.map