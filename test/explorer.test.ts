import { search } from '../src/explorer';
import { SurveyData } from '../src/types';

describe('search', () => {
  const mockSurveyData: SurveyData = {
    questions: [
      {
        id: 'MainBranch',
        text: 'Which of the following best describes your role?',
        type: 'sc',
        options: ['I am a developer by profession', 'I am a student', 'I code as a hobby']
      },
      {
        id: 'DevType',
        text: 'Which of the following describe you? Select all that apply.',
        type: 'mc',
        options: ['Full-stack developer', 'Back-end developer', 'Front-end developer', 'Data scientist']
      },
      {
        id: 'RemoteWork',
        text: 'How often do you work remotely?',
        type: 'sc',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
      }
    ],
    responses: [],
    metadata: {
      totalResponses: 0,
      columns: []
    }
  };

  it('should find matches in question text', () => {
    const matches = search(mockSurveyData, 'remote');
    
    expect(matches).toHaveLength(1);
    expect(matches[0].question.id).toBe('RemoteWork');
    expect(matches[0].matchType).toBe('question');
    expect(matches[0].matchedText).toBe('How often do you work remotely?');
  });

  it('should find matches in options', () => {
    const matches = search(mockSurveyData, 'student');
    
    expect(matches).toHaveLength(1);
    expect(matches[0].question.id).toBe('MainBranch');
    expect(matches[0].matchType).toBe('option');
    expect(matches[0].matchedText).toBe('I am a student');
  });

  it('should find multiple matches', () => {
    const matches = search(mockSurveyData, 'developer');
    
    expect(matches.length).toBeGreaterThan(1);
    
    // Should find matches in options (multiple developer types)
    const optionMatches = matches.filter(m => m.matchType === 'option');
    expect(optionMatches.length).toBeGreaterThan(0);
    
    // DevType question text contains "describe you" but not "developer"
    // So we should find at least 3 developer options in DevType question
    const devTypeMatches = matches.filter(m => m.question.id === 'DevType');
    expect(devTypeMatches.length).toBeGreaterThan(2); // Full-stack, Back-end, Front-end
  });

  it('should be case insensitive', () => {
    const lowerCaseMatches = search(mockSurveyData, 'developer');
    const upperCaseMatches = search(mockSurveyData, 'DEVELOPER');
    const mixedCaseMatches = search(mockSurveyData, 'Developer');
    
    expect(lowerCaseMatches).toHaveLength(upperCaseMatches.length);
    expect(lowerCaseMatches).toHaveLength(mixedCaseMatches.length);
  });

  it('should return empty array for no matches', () => {
    const matches = search(mockSurveyData, 'xyz123');
    
    expect(matches).toHaveLength(0);
  });

  it('should handle questions without options', () => {
    const dataWithoutOptions: SurveyData = {
      questions: [
        {
          id: 'Comments',
          text: 'Additional comments about remote work',
          type: 'text'
        }
      ],
      responses: [],
      metadata: {
        totalResponses: 0,
        columns: []
      }
    };

    const matches = search(dataWithoutOptions, 'remote');
    
    expect(matches).toHaveLength(1);
    expect(matches[0].matchType).toBe('question');
  });
});