export interface SurveyData {
  questions: Question[];
  responses: Response[];
  metadata: {
    totalResponses: number;
    columns: string[];
  };
}

export interface Question {
  id: string;
  text: string;
  type: 'sc' | 'mc' | 'text' | 'number';
  options?: string[];
}

export interface Response {
  [questionId: string]: string | number | null;
}

export interface QuestionMatch {
  question: Question;
  matchType: 'question' | 'option';
  matchedText: string;
}

export interface SurveyDataSubset {
  originalData: SurveyData;
  filteredResponses: Response[];
  filterCriteria: {
    question: string;
    option: string;
  };
}

export interface DistributionResult {
  question: Question;
  type: 'sc' | 'mc';
  distribution: DistributionItem[];
  totalResponses: number;
}

export interface DistributionItem {
  option: string;
  count: number;
  percentage: number;
}