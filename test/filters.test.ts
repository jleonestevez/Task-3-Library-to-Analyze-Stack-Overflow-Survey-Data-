import { subset } from '../src/filters';
import { SurveyData } from '../src/types';

describe('subset', () => {
  const mockSurveyData: SurveyData = {
    questions: [
      {
        id: 'MainBranch',
        text: 'MainBranch',
        type: 'sc'
      },
      {
        id: 'DevType',
        text: 'DevType',
        type: 'sc'
      }
    ],
    responses: [
      { MainBranch: 'I am a developer by profession', DevType: 'Developer, full-stack' },
      { MainBranch: 'I am learning to code', DevType: 'Student' },
      { MainBranch: 'I am a developer by profession', DevType: 'Developer, back-end' },
      { MainBranch: 'I code primarily as a hobby', DevType: 'Developer, front-end' },
      { MainBranch: 'I am a developer by profession', DevType: null },
      { MainBranch: 'I am not primarily a developer, but I write code sometimes as part of my work/studies', DevType: 'NA' }
    ],
    metadata: {
      totalResponses: 6,
      columns: ['MainBranch', 'DevType']
    }
  };

  it('should filter responses by single choice option', () => {
    const result = subset(mockSurveyData, 'MainBranch', 'developer by profession');
    
    expect(result.filteredResponses).toHaveLength(3);
    expect(result.filterCriteria.question).toBe('MainBranch');
    expect(result.filterCriteria.option).toBe('developer by profession');
    
    result.filteredResponses.forEach(response => {
      expect(response.MainBranch).toContain('developer by profession');
    });
  });

  it('should filter responses by DevType option', () => {
    const result = subset(mockSurveyData, 'DevType', 'Developer, full-stack');
    
    expect(result.filteredResponses).toHaveLength(1);
    
    result.filteredResponses.forEach(response => {
      const devType = String(response.DevType);
      expect(devType).toContain('Developer, full-stack');
    });
  });

  it('should handle student DevType filter', () => {
    const result = subset(mockSurveyData, 'DevType', 'Student');
    
    expect(result.filteredResponses).toHaveLength(1);
    expect(String(result.filteredResponses[0].DevType)).toBe('Student');
  });

  it('should throw error for non-existent question', () => {
    expect(() => subset(mockSurveyData, 'NonExistent', 'some option'))
      .toThrow('Question not found: NonExistent');
  });

  it('should exclude null and undefined responses', () => {
    const result = subset(mockSurveyData, 'DevType', 'NA');
    
    // Should only find the one response that has 'NA'
    expect(result.filteredResponses).toHaveLength(1);
  });

  it('should be case insensitive', () => {
    const lowerResult = subset(mockSurveyData, 'MainBranch', 'learning');
    const upperResult = subset(mockSurveyData, 'MainBranch', 'LEARNING');
    
    expect(lowerResult.filteredResponses).toHaveLength(upperResult.filteredResponses.length);
  });

  it('should find question by text instead of id', () => {
    const result = subset(mockSurveyData, 'MainBranch', 'learning');
    
    expect(result.filteredResponses).toHaveLength(1);
    expect(result.filteredResponses[0].MainBranch).toContain('learning');
  });

  it('should return empty result when no matches found', () => {
    const result = subset(mockSurveyData, 'MainBranch', 'xyz123');
    
    expect(result.filteredResponses).toHaveLength(0);
  });
});