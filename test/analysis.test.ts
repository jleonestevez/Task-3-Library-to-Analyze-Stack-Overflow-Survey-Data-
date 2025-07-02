import { distribution } from '../src/analysis';
import { loadSurvey } from '../src/loader';
import * as path from 'path';

describe('analysis (real data)', () => {
  const filePath = path.join(__dirname, '../data/so_2024_raw.xlsx');
  const data = loadSurvey(filePath);
  const question = 'MainBranch';

  it('should count single choice (sc) distribution', () => {
    const result = distribution(data, question, 'sc');
    expect(result.counts).toBeDefined();
    expect(Object.keys(result.counts).length).toBeGreaterThan(0);
    expect(result.counts[data.options[question][0]]).toBeGreaterThan(0);
  });

  it('should count multiple choice (mc) distribution (if applicable)', () => {
    // Usar una pregunta MC si existe, si no, solo validar que no lanza error
    const mcQuestion = data.questions.find(q => data.options[q].some(opt => opt.includes(';')));
    const result = distribution(data, question, 'mc');
    expect(result.counts).toBeDefined();
  });
}); 