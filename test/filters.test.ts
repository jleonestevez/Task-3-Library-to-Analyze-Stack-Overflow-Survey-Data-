import { subset } from '../src/filters';
import { loadSurvey } from '../src/loader';
import * as path from 'path';

describe('filters (real data)', () => {
  const filePath = path.join(__dirname, '../data/so_2024_raw.xlsx');
  const data = loadSurvey(filePath);
  const question = 'MainBranch';
  const option = data.options[question][0];

  it('should filter responses by question and option', () => {
    const result = subset(data, question, option);
    expect(result.responses.length).toBeGreaterThan(0);
    expect(result.responses[0][question]).toContain(option.split(' ')[0]);
  });

  it('should handle no matches', () => {
    const result = subset(data, question, 'OpciónInexistente123');
    expect(result.responses.length).toBe(0);
  });
}); 