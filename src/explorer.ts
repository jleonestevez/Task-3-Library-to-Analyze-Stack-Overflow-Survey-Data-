import { SurveyData, QuestionMatch } from './types';

export function showQuestions(data: SurveyData): void {
  console.log('\n📋 Available Questions:');
  console.log('='.repeat(50));
  
  data.questions.forEach((question, index) => {
    console.log(`${index + 1}. [${question.type.toUpperCase()}] ${question.text}`);
    if (question.options && question.options.length > 0) {
      question.options.forEach(option => {
        console.log(`   • ${option}`);
      });
    }
    console.log('');
  });
  
  console.log(`Total Questions: ${data.questions.length}`);
  console.log(`Total Responses: ${data.metadata.totalResponses}`);
}

export function search(data: SurveyData, keyword: string): QuestionMatch[] {
  const matches: QuestionMatch[] = [];
  const lowerKeyword = keyword.toLowerCase();
  
  for (const question of data.questions) {
    // Search in question text
    if (question.text.toLowerCase().includes(lowerKeyword)) {
      matches.push({
        question,
        matchType: 'question',
        matchedText: question.text
      });
    }
    
    // Search in options if they exist
    if (question.options) {
      for (const option of question.options) {
        if (option.toLowerCase().includes(lowerKeyword)) {
          matches.push({
            question,
            matchType: 'option',
            matchedText: option
          });
        }
      }
    }
  }
  
  return matches;
}

export function displaySearchResults(matches: QuestionMatch[], keyword: string): void {
  if (matches.length === 0) {
    console.log(`\n❌ No matches found for "${keyword}"`);
    return;
  }
  
  console.log(`\n🔍 Search Results for "${keyword}":`);
  console.log('='.repeat(50));
  
  matches.forEach((match, index) => {
    console.log(`${index + 1}. [${match.question.type.toUpperCase()}] ${match.question.text}`);
    console.log(`   Match in ${match.matchType}: "${match.matchedText}"`);
    console.log('');
  });
  
  console.log(`Found ${matches.length} match(es)`);
}