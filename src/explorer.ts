import { SurveyData } from './loader';

export interface QuestionMatch {
  question: string;
  option?: string;
}

export function showQuestions(data: SurveyData): void {
  data.questions.forEach((q, i) => {
    console.log(`${i + 1}. ${q}`);
  });
}

export function search(data: SurveyData, keyword: string): QuestionMatch[] {
  const matches: QuestionMatch[] = [];
  const lower = keyword.toLowerCase();
  for (const q of data.questions) {
    if (q.toLowerCase().includes(lower)) {
      matches.push({ question: q });
    }
    for (const opt of data.options[q]) {
      if (opt.toLowerCase().includes(lower)) {
        matches.push({ question: q, option: opt });
      }
    }
  }
  return matches;
} 