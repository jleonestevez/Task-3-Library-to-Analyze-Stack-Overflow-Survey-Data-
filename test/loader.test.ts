import { loadSurvey } from '../src/loader';
import * as path from 'path';

describe('loadSurvey (real data)', () => {
  const filePath = path.join(__dirname, '../data/so_2024_raw.xlsx');
  let data: ReturnType<typeof loadSurvey>;

  beforeAll(() => {
    data = loadSurvey(filePath);
  });

  it('should load questions from the real file', () => {
    expect(Array.isArray(data.questions)).toBe(true);
    expect(data.questions.length).toBeGreaterThan(0);
    expect(data.questions).toContain('MainBranch');
  });

  it('should load options for a known question', () => {
    expect(Array.isArray(data.options['MainBranch'])).toBe(true);
    expect(data.options['MainBranch'].length).toBeGreaterThan(0);
  });

  it('should load responses', () => {
    expect(Array.isArray(data.responses)).toBe(true);
    expect(data.responses.length).toBeGreaterThan(0);
    expect(typeof data.responses[0]).toBe('object');
  });
}); 