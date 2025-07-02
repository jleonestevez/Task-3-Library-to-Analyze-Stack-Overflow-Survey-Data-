import { SurveyData } from './loader';

export interface SurveyDataSubset {
  question: string;
  option: string;
  responses: Record<string, any>[];
}

export function subset(data: SurveyData, question: string, option: string): SurveyDataSubset {
  const filtered = data.responses.filter(row => {
    if (!row[question]) return false;
    return String(row[question]).split(';').map((v: string) => v.trim()).includes(option);
  });
  return {
    question,
    option,
    responses: filtered
  };
} 