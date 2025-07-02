import { distribution } from '../src/analysis';
import { SurveyData } from '../src/types';

describe('distribution', () => {
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

  it('should calculate single choice distribution correctly', () => {
    const result = distribution(mockSurveyData, 'MainBranch', 'sc');
    
    expect(result.question.id).toBe('MainBranch');
    expect(result.type).toBe('sc');
    expect(result.totalResponses).toBe(5); // all MainBranch responses are valid
    expect(result.distribution).toHaveLength(3);
    
    // Check sorted by count (descending)
    expect(result.distribution[0].option).toBe('I am a developer by profession');
    expect(result.distribution[0].count).toBe(3);
    expect(result.distribution[0].percentage).toBe(60); // 3/5 = 60%
  });

  it('should calculate multiple choice distribution correctly', () => {
    const result = distribution(mockSurveyData, 'DevType', 'mc');
    
    expect(result.question.id).toBe('DevType');
    expect(result.type).toBe('mc');
    expect(result.totalResponses).toBe(4); // excluding null values for DevType
    expect(result.distribution.length).toBeGreaterThan(0);
    
    // Check that Full-stack developer appears twice
    const fullStackItem = result.distribution.find(item => item.option === 'Full-stack developer');
    expect(fullStackItem).toBeDefined();
    expect(fullStackItem!.count).toBe(2);
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
    const result = distribution(mockSurveyData, 'Which of the following best describes your role?', 'sc');
    
    expect(result.question.id).toBe('MainBranch');
    expect(result.totalResponses).toBe(5);
  });
});