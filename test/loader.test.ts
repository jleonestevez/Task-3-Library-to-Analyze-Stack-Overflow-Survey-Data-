import { loadSurvey } from '../src/loader';
import * as fs from 'fs';

// Mock fs
jest.mock('fs');

// Mock XLSX
const mockSheetToJson = jest.fn();
const mockReadFile = jest.fn();

jest.mock('xlsx', () => ({
  readFile: jest.fn(),
  utils: {
    sheet_to_json: jest.fn()
  }
}));

import * as XLSX from 'xlsx';
const mockedXLSX = XLSX as jest.Mocked<typeof XLSX>;

const mockFs = fs as jest.Mocked<typeof fs>;

describe('loadSurvey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if file does not exist', () => {
    mockFs.existsSync.mockReturnValue(false);
    
    expect(() => loadSurvey('nonexistent.xlsx')).toThrow('File not found: nonexistent.xlsx');
  });

  it('should load survey data from Excel file', () => {
    // Mock file exists
    mockFs.existsSync.mockReturnValue(true);
    
    // Mock Excel data
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      ['MainBranch', 'DevType', 'Age'],
      ['I am a developer by profession', 'Full-stack developer', '25'],
      ['I am a student', 'Back-end developer', '22'],
      ['I am a developer by profession', 'Full-stack developer;Front-end developer', '30']
    ];
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const result = loadSurvey('test.xlsx');
    
    expect(result).toBeDefined();
    expect(result.questions).toHaveLength(3);
    expect(result.responses).toHaveLength(3);
    expect(result.metadata.totalResponses).toBe(3);
    expect(result.metadata.columns).toEqual(['MainBranch', 'DevType', 'Age']);
  });

  it('should handle empty Excel file', () => {
    mockFs.existsSync.mockReturnValue(true);
    
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue([]);
    
    expect(() => loadSurvey('empty.xlsx')).toThrow('Excel file must have at least a header row and one data row');
  });

  it('should determine question types correctly', () => {
    mockFs.existsSync.mockReturnValue(true);
    
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      ['MainBranch', 'DevType', 'Age', 'YearsCode', 'OpenSourcer'],
      ['I am a developer by profession', 'Full-stack developer', '25', '5', 'Yes']
    ];
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const result = loadSurvey('test.xlsx');
    
    expect(result.questions[0].type).toBe('sc'); // MainBranch
    expect(result.questions[1].type).toBe('sc'); // DevType
    expect(result.questions[2].type).toBe('number'); // Age
    expect(result.questions[3].type).toBe('number'); // YearsCode
    expect(result.questions[4].type).toBe('text'); // OpenSourcer
  });

  it('should parse numeric values correctly', () => {
    mockFs.existsSync.mockReturnValue(true);
    
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      ['Age', 'Text'],
      ['25', 'Hello'],
      ['30', 'World']
    ];
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const result = loadSurvey('test.xlsx');
    
    expect(result.responses[0]['Age']).toBe(25);
    expect(result.responses[0]['Text']).toBe('Hello');
    expect(result.responses[1]['Age']).toBe(30);
    expect(result.responses[1]['Text']).toBe('World');
  });
});