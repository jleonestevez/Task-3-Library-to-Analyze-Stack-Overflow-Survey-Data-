import { subset } from '../src/filters';
import { SurveyData } from '../src/types';

describe('subset', () => {
  const mockSurveyData: SurveyData = {
    questions: [
      {
        id: 'MainBranch',
        text: 'Which of the following best describes your role?',
        type: 'sc'
      },
      {
        id: 'DevType',
        text: 'Which of the following describe you? Select all that apply.',
        type: 'mc'
      }
    ],
    responses: [
      { MainBranch: 'I am a developer by profession', DevType: 'Full-stack developer' },
      { MainBranch: 'I am a student', DevType: 'Back-end developer;Front-end developer' },
      { MainBranch: 'I am a developer by profession', DevType: 'Full-stack developer;Data scientist' },
      { MainBranch: 'I code as a hobby', DevType: 'Front-end developer' },
      { MainBranch: 'I am a developer by profession', DevType: null }
    ],
    metadata: {
      totalResponses: 5,
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

  it('should filter responses by multiple choice option', () => {
    const result = subset(mockSurveyData, 'DevType', 'Full-stack developer');
    
    expect(result.filteredResponses).toHaveLength(2);
    
    result.filteredResponses.forEach(response => {
      const devType = String(response.DevType);
      expect(devType).toContain('Full-stack developer');
    });
  });

  it('should handle multiple choice with semicolon separation', () => {
    const result = subset(mockSurveyData, 'DevType', 'Back-end developer');
    
    expect(result.filteredResponses).toHaveLength(1);
    expect(String(result.filteredResponses[0].DevType)).toContain('Back-end developer;Front-end developer');
  });

  it('should throw error for non-existent question', () => {
    expect(() => subset(mockSurveyData, 'NonExistent', 'some option'))
      .toThrow('Question not found: NonExistent');
  });

  it('should exclude null and undefined responses', () => {
    const result = subset(mockSurveyData, 'DevType', 'Data scientist');
    
    // Should only find the one response that has 'Data scientist'
    expect(result.filteredResponses).toHaveLength(1);
  });

  it('should be case insensitive', () => {
    const lowerResult = subset(mockSurveyData, 'MainBranch', 'student');
    const upperResult = subset(mockSurveyData, 'MainBranch', 'STUDENT');
    
    expect(lowerResult.filteredResponses).toHaveLength(upperResult.filteredResponses.length);
  });

  it('should find question by text instead of id', () => {
    const result = subset(mockSurveyData, 'Which of the following best describes your role?', 'student');
    
    expect(result.filteredResponses).toHaveLength(1);
    expect(result.filteredResponses[0].MainBranch).toContain('student');
  });

  it('should return empty result when no matches found', () => {
    const result = subset(mockSurveyData, 'MainBranch', 'xyz123');
    
    expect(result.filteredResponses).toHaveLength(0);
  });
});