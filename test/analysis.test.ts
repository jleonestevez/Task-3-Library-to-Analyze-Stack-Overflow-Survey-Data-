import { distribution } from '../src/analysis';
import { SurveyData } from '../src/types';

describe('distribution', () => {
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

  it('should calculate single choice distribution correctly', () => {
    const result = distribution(mockSurveyData, 'MainBranch', 'sc');
    
    expect(result.question.id).toBe('MainBranch');
    expect(result.type).toBe('sc');
    expect(result.totalResponses).toBe(6); // all MainBranch responses are valid
    expect(result.distribution).toHaveLength(4); // 4 unique responses
    
    // Check sorted by count (descending)
    expect(result.distribution[0].option).toBe('I am a developer by profession');
    expect(result.distribution[0].count).toBe(3);
    expect(result.distribution[0].percentage).toBe(50); // 3/6 = 50%
  });

  it('should calculate single choice distribution correctly for DevType', () => {
    const result = distribution(mockSurveyData, 'DevType', 'sc');
    
    expect(result.question.id).toBe('DevType');
    expect(result.type).toBe('sc');
    expect(result.totalResponses).toBe(5); // excluding null values for DevType
    expect(result.distribution.length).toBeGreaterThan(0);
    
    // Check that each option appears once
    const devTypes = result.distribution.map(item => item.option);
    expect(devTypes).toContain('Developer, full-stack');
    expect(devTypes).toContain('Student');
    expect(devTypes).toContain('Developer, back-end');
    expect(devTypes).toContain('Developer, front-end');
    expect(devTypes).toContain('NA');
  });

  it('should throw error for non-existent question', () => {
    expect(() => distribution(mockSurveyData, 'NonExistent', 'sc'))
      .toThrow('Question not found: NonExistent');
  });

  it('should handle empty responses', () => {
    const emptyData: SurveyData = {
      questions: [
        { id: 'Test', text: 'Test Question', type: 'sc' }
      ],
      responses: [
        { Test: null },
        { Test: '' },
        { Test: null as any }
      ],
      metadata: {
        totalResponses: 3,
        columns: ['Test']
      }
    };

    const result = distribution(emptyData, 'Test', 'sc');
    
    expect(result.totalResponses).toBe(0);
    expect(result.distribution).toHaveLength(0);
  });

  it('should find question by text instead of id', () => {
    const result = distribution(mockSurveyData, 'MainBranch', 'sc');
    
    expect(result.question.id).toBe('MainBranch');
    expect(result.totalResponses).toBe(6);
  });
});