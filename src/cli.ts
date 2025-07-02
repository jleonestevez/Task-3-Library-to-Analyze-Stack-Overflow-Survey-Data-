#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { loadSurvey } from './loader';
import { showQuestions, search, displaySearchResults } from './explorer';
import { subset, displaySubsetInfo } from './filters';
import { distribution, displayDistribution } from './analysis';

const program = new Command();

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
      
      const data = loadSurvey(filePath);
      showQuestions(data);
    } catch (error) {
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
      
      const data = loadSurvey(filePath);
      const matches = search(data, keyword);
      displaySearchResults(matches, keyword);
    } catch (error) {
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
      
      const data = loadSurvey(filePath);
      const subsetData = subset(data, options.question, options.option);
      displaySubsetInfo(subsetData);
    } catch (error) {
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
      
      const data = loadSurvey(filePath);
      const result = distribution(data, options.question, options.type);
      displayDistribution(result);
    } catch (error) {
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