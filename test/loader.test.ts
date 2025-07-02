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

  it('should load survey data from Excel file with realistic SO 2024 data', () => {
    // Mock file exists
    mockFs.existsSync.mockReturnValue(true);
    
    // Mock Excel data with realistic SO 2024 structure
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      ['MainBranch', 'DevType', 'Age', 'Employment', 'RemoteWork'],
      ['I am a developer by profession', 'Developer, full-stack', '25', 'Employed, full-time', 'Fully remote'],
      ['I am learning to code', 'Student', '22', 'Student, full-time', 'Never'],
      ['I am a developer by profession', 'Developer, back-end', '30', 'Employed, full-time', 'Hybrid (some remote, some in-person)']
    ];
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const result = loadSurvey('test.xlsx');
    
    expect(result).toBeDefined();
    expect(result.questions).toHaveLength(5);
    expect(result.responses).toHaveLength(3);
    expect(result.metadata.totalResponses).toBe(3);
    expect(result.metadata.columns).toEqual(['MainBranch', 'DevType', 'Age', 'Employment', 'RemoteWork']);
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

  it('should determine question types correctly for SO 2024 questions', () => {
    mockFs.existsSync.mockReturnValue(true);
    
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      ['MainBranch', 'DevType', 'Age', 'YearsCode', 'RemoteWork', 'TechDoc'],
      ['I am a developer by profession', 'Developer, full-stack', '25', '5', 'Fully remote', 'Stack Overflow']
    ];
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const result = loadSurvey('test.xlsx');
    
    expect(result.questions[0].type).toBe('sc'); // MainBranch
    expect(result.questions[1].type).toBe('sc'); // DevType
    expect(result.questions[2].type).toBe('number'); // Age
    expect(result.questions[3].type).toBe('number'); // YearsCode
    expect(result.questions[4].type).toBe('text'); // RemoteWork
    expect(result.questions[5].type).toBe('text'); // TechDoc
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
      ['Age', 'YearsCode', 'Country'],
      ['25', '5', 'United States of America'],
      ['30', '8', 'Germany']
    ];
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const result = loadSurvey('test.xlsx');
    
    expect(result.responses[0]['Age']).toBe(25);
    expect(result.responses[0]['YearsCode']).toBe(5);
    expect(result.responses[0]['Country']).toBe('United States of America');
    expect(result.responses[1]['Age']).toBe(30);
    expect(result.responses[1]['YearsCode']).toBe(8);
    expect(result.responses[1]['Country']).toBe('Germany');
  });

  it('should handle real SO 2024 data structure with null values', () => {
    mockFs.existsSync.mockReturnValue(true);
    
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {}
      }
    };
    
    const mockData = [
      ['MainBranch', 'DevType', 'Age'],
      ['I am a developer by profession', 'Developer, full-stack', '25'],
      ['I am learning to code', 'NA', null],
      ['', 'Developer, back-end', '30']
    ];
    
    mockedXLSX.readFile.mockReturnValue(mockWorkbook);
    (mockedXLSX.utils.sheet_to_json as jest.Mock).mockReturnValue(mockData);
    
    const result = loadSurvey('test.xlsx');
    
    expect(result.responses).toHaveLength(3);
    expect(result.responses[0]['MainBranch']).toBe('I am a developer by profession');
    expect(result.responses[1]['DevType']).toBe('NA');
    expect(result.responses[1]['Age']).toBeNull();
    expect(result.responses[2]['MainBranch']).toBeNull();
  });
});