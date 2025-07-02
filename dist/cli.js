#!/usr/bin/env node
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
const commander_1 = require("commander");
const path = __importStar(require("path"));
const loader_1 = require("./loader");
const explorer_1 = require("./explorer");
const filters_1 = require("./filters");
const analysis_1 = require("./analysis");
const program = new commander_1.Command();
program
    .name('so-analyzer')
    .description('Stack Overflow Survey Analyzer - CLI tool for analyzing survey data')
    .version('1.0.0');
program
    .command('show-questions')
    .description('Show all available questions in the survey')
    .option('-f, --file <path>', 'Path to Excel file', './data/so_2024_raw.xlsx')
    .action(async (options) => {
    try {
        const filePath = path.resolve(options.file);
        console.log(`Loading survey data from: ${filePath}`);
        const data = (0, loader_1.loadSurvey)(filePath);
        (0, explorer_1.showQuestions)(data);
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('search')
    .description('Search for questions or options containing a keyword')
    .argument('<keyword>', 'Keyword to search for')
    .option('-f, --file <path>', 'Path to Excel file', './data/so_2024_raw.xlsx')
    .action(async (keyword, options) => {
    try {
        const filePath = path.resolve(options.file);
        console.log(`Loading survey data from: ${filePath}`);
        const data = (0, loader_1.loadSurvey)(filePath);
        const matches = (0, explorer_1.search)(data, keyword);
        (0, explorer_1.displaySearchResults)(matches, keyword);
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('subset')
    .description('Create a subset of responses based on a question and option')
    .requiredOption('-q, --question <question>', 'Question ID or text')
    .requiredOption('-o, --option <option>', 'Option value to filter by')
    .option('-f, --file <path>', 'Path to Excel file', './data/so_2024_raw.xlsx')
    .action(async (options) => {
    try {
        const filePath = path.resolve(options.file);
        console.log(`Loading survey data from: ${filePath}`);
        const data = (0, loader_1.loadSurvey)(filePath);
        const subsetData = (0, filters_1.subset)(data, options.question, options.option);
        (0, filters_1.displaySubsetInfo)(subsetData);
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
program
    .command('distribution')
    .description('Show response distribution for a question')
    .requiredOption('-q, --question <question>', 'Question ID or text')
    .requiredOption('-t, --type <type>', 'Question type: sc (single choice) or mc (multiple choice)')
    .option('-f, --file <path>', 'Path to Excel file', './data/so_2024_raw.xlsx')
    .action(async (options) => {
    try {
        const filePath = path.resolve(options.file);
        console.log(`Loading survey data from: ${filePath}`);
        if (options.type !== 'sc' && options.type !== 'mc') {
            throw new Error('Type must be either "sc" (single choice) or "mc" (multiple choice)');
        }
        const data = (0, loader_1.loadSurvey)(filePath);
        const result = (0, analysis_1.distribution)(data, options.question, options.type);
        (0, analysis_1.displayDistribution)(result);
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
// Add help examples
program.on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ so-analyzer show-questions');
    console.log('  $ so-analyzer search "remote"');
    console.log('  $ so-analyzer subset --question="MainBranch" --option="Freelancer"');
    console.log('  $ so-analyzer distribution --question="DevType" --type=mc');
    console.log('');
    console.log('Note: Make sure the Excel file exists at the specified path.');
});
if (require.main === module) {
    program.parse();
}
//# sourceMappingURL=cli.js.map