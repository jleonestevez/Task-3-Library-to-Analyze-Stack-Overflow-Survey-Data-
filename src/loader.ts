import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { SurveyData, Question, Response } from './types';

export function loadSurvey(filePath: string): SurveyData {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to JSON with header row
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
  
  if (jsonData.length < 2) {
    throw new Error('Excel file must have at least a header row and one data row');
  }

  const headers = jsonData[0];
  const dataRows = jsonData.slice(1);

  // Parse responses first
  const responses = parseResponses(dataRows, headers);

  // Parse questions from headers and populate options from responses
  const questions = parseQuestionsFromHeaders(headers);
  populateQuestionOptions(questions, responses);
  
  return {
    questions,
    responses,
    metadata: {
      totalResponses: responses.length,
      columns: headers
    }
  };
}

function parseQuestionsFromHeaders(headers: string[]): Question[] {
  const questions: Question[] = [];
  
  for (const header of headers) {
    if (!header || header.trim() === '') continue;
    
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

function determineQuestionType(header: string): 'sc' | 'mc' | 'text' | 'number' {
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

function parseResponses(dataRows: string[][], headers: string[]): Response[] {
  const responses: Response[] = [];
  
  for (const row of dataRows) {
    const response: Response = {};
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const value = row[i];
      
      if (header && value !== undefined && value !== null && value !== '') {
        // Try to parse as number if it looks like a number
        if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
          response[header] = Number(value);
        } else {
          response[header] = value;
        }
      } else {
        response[header] = null;
      }
    }
    
    responses.push(response);
  }
  
  return responses;
}

function populateQuestionOptions(questions: Question[], responses: Response[]): void {
  for (const question of questions) {
    if (question.type === 'sc' || question.type === 'mc') {
      const optionsSet = new Set<string>();
      
      for (const response of responses) {
        const value = response[question.id];
        if (value !== null && value !== undefined && value !== '') {
          const stringValue = String(value);
          
          // For multiple choice questions, split by semicolon
          if (question.type === 'mc' && stringValue.includes(';')) {
            const splitOptions = stringValue.split(';').map(opt => opt.trim());
            splitOptions.forEach(opt => {
              if (opt) optionsSet.add(opt);
            });
          } else {
            optionsSet.add(stringValue);
          }
        }
      }
      
      question.options = Array.from(optionsSet).sort();
    }
  }
}