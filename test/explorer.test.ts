import { search } from '../src/explorer';
import { SurveyData } from '../src/types';

describe('search', () => {
  const mockSurveyData: SurveyData = {
    questions: [
      {
        id: 'MainBranch',
        text: 'MainBranch',
        type: 'sc',
        options: ['I am a developer by profession', 'I am learning to code', 'I code primarily as a hobby', 'I am not primarily a developer, but I write code sometimes as part of my work/studies']
      },
      {
        id: 'DevType',
        text: 'DevType',
        type: 'sc',
        options: ['Developer, full-stack', 'Developer, back-end', 'Developer, front-end', 'Student', 'Developer, mobile', 'NA']
      },
      {
        id: 'RemoteWork',
        text: 'RemoteWork',
        type: 'text',
        options: ['Fully remote', 'Hybrid (some remote, some in-person)', 'Never', 'In-person']
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
    
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const questionMatch = matches.find(m => m.question.id === 'RemoteWork' && m.matchType === 'question');
    expect(questionMatch).toBeDefined();
    expect(questionMatch!.matchedText).toBe('RemoteWork');
  });

  it('should find matches in options', () => {
    const matches = search(mockSurveyData, 'student');
    
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const optionMatch = matches.find(m => m.matchType === 'option' && m.matchedText.toLowerCase().includes('student'));
    expect(optionMatch).toBeDefined();
  });

  it('should find multiple matches', () => {
    const matches = search(mockSurveyData, 'developer');
    
    expect(matches.length).toBeGreaterThan(1);
    
    // Should find matches in options (multiple developer types)
    const optionMatches = matches.filter(m => m.matchType === 'option');
    expect(optionMatches.length).toBeGreaterThan(0);
    
    // Should find multiple developer-related matches in both MainBranch and DevType
    const devTypeMatches = matches.filter(m => m.question.id === 'DevType' && m.matchedText.toLowerCase().includes('developer'));
    expect(devTypeMatches.length).toBeGreaterThan(2); // Developer, full-stack; Developer, back-end; Developer, front-end
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
          id: 'TechDoc',
          text: 'TechDoc',
          type: 'text'
        }
      ],
      responses: [],
      metadata: {
        totalResponses: 0,
        columns: []
      }
    };

    const matches = search(dataWithoutOptions, 'tech');
    
    expect(matches).toHaveLength(1);
    expect(matches[0].matchType).toBe('question');
  });
});